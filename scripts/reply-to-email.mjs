import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Resend } from "resend";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  try {
    const raw = readFileSync(envPath, "utf8").replace(/^\uFEFF/, "");
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      if (key && process.env[key] == null) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env is optional when RESEND_API_KEY is already set.
  }
}

loadEnvFile();

const resendApiKey = process.env.RESEND_API_KEY ?? "";
const parentMessageId = "b5ff4aef-595e-4bb9-8f87-86b948e42c09";
const recipientEmail = "startups@cartesia.ai";
const originalSubject = "Welcome to the Cartesia Startups Grant Program!";
const cc = ["anjali@conduence.xyz"];
const from = "Sarthak <sarthakden@conduence.xyz>";
const dryRun = process.argv.includes("--dry-run");

const replyTextBody = `Hi,

We are not sure on how to redeem it. Can you help us with it.

Our Organization Id is - org-_3JsPPenhpp72hAvd4ZV6tnh7FS4

Thanks.`;

const replyHtmlBody = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Re: Welcome to the Cartesia Startups Grant Program!</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #ffffff;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding: 20px; font-family: Arial, Helvetica, sans-serif; color: #111111; font-size: 14px; line-height: 1.5;">
          <p style="margin: 0 0 16px;">Hi,</p>
          <p style="margin: 0 0 16px;">
            We are not sure on how to redeem it. Can you help us with it.
          </p>
          <p style="margin: 0 0 16px;">
            Our Organization Id is - org-_3JsPPenhpp72hAvd4ZV6tnh7FS4
          </p>
          <p style="margin: 0;">Thanks.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;

function formatReplySubject(subject) {
  const stripped = String(subject ?? "")
    .replace(/^\s*((re|fw|fwd)\s*:\s*)+/i, "")
    .trim();
  return stripped ? `Re: ${stripped}` : "Re:";
}

function extractMessageIds(value) {
  if (Array.isArray(value)) return value.flatMap(extractMessageIds);
  const matches = String(value ?? "").match(/<[^>]+>/g);
  return matches ?? [];
}

function uniqueMessageIds(ids) {
  const seen = new Set();
  const result = [];
  for (const id of ids.flatMap(extractMessageIds)) {
    if (seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }
  return result;
}

function normalizeAddress(address) {
  const match = String(address ?? "").match(/<([^>]+)>/);
  return (match?.[1] ?? address ?? "").trim().toLowerCase();
}

function stripSubjectPrefixes(subject) {
  return String(subject ?? "")
    .replace(/^\s*((re|fw|fwd)\s*:\s*)+/i, "")
    .trim()
    .toLowerCase();
}

async function findMatchingReceivedEmail(resend, sentEmail) {
  const replyTo = (sentEmail.reply_to ?? []).map(normalizeAddress).filter(Boolean);
  const sentSubject = stripSubjectPrefixes(sentEmail.subject);
  const sentAt = sentEmail.created_at ? Date.parse(sentEmail.created_at) : NaN;
  let cursor;

  for (let page = 0; page < 10; page += 1) {
    const { data, error } = await resend.emails.receiving.list({
      limit: 20,
      ...(cursor ? { after: cursor } : {}),
    });
    if (error) throw new Error(error.message);
    const items = data?.data ?? [];

    const match = items.find((email) => {
      const sameSubject = stripSubjectPrefixes(email.subject) === sentSubject;
      if (!sameSubject) return false;
      const fromMatches = replyTo.length === 0 || replyTo.includes(normalizeAddress(email.from));
      if (!fromMatches) return false;
      if (!Number.isNaN(sentAt) && email.created_at) {
        return Math.abs(Date.parse(email.created_at) - sentAt) < 5 * 60 * 1000;
      }
      return true;
    });
    if (match) return match;
    if (!data?.has_more || items.length === 0) break;
    cursor = items[items.length - 1]?.id;
    if (!cursor) break;
  }

  return null;
}

async function resolveThread(resend, id) {
  const received = await resend.emails.receiving.get(id);
  if (received.data) {
    const headers = received.data.headers ?? {};
    return {
      source: "received",
      resendId: received.data.id,
      rfcMessageId: received.data.message_id,
      subject: received.data.subject,
      from: received.data.from,
      inReplyTo: received.data.message_id,
      references: uniqueMessageIds([
        headers.references,
        headers.References,
        headers["in-reply-to"],
        headers["In-Reply-To"],
        received.data.message_id,
      ]),
    };
  }

  const sent = await resend.emails.get(id);
  if (sent.error || !sent.data) {
    throw new Error(
      received.error?.message ?? sent.error?.message ?? `Email ${id} was not found in Resend.`,
    );
  }

  const inbound = await findMatchingReceivedEmail(resend, sent.data);
  const inboundHeaders = inbound
    ? ((await resend.emails.receiving.get(inbound.id)).data?.headers ?? {})
    : {};
  const rfcMessageId = inbound?.message_id ?? sent.data.message_id;

  return {
    source: inbound ? "received-via-forward" : "sent",
    resendId: inbound?.id ?? sent.data.id,
    rfcMessageId,
    subject: inbound?.subject ?? sent.data.subject,
    from: inbound?.from ?? sent.data.from,
    inReplyTo: rfcMessageId,
    references: uniqueMessageIds([
      inboundHeaders.references,
      inboundHeaders.References,
      inboundHeaders["in-reply-to"],
      inboundHeaders["In-Reply-To"],
      rfcMessageId,
    ]),
  };
}

async function main() {
  if (!resendApiKey) {
    console.error("Missing RESEND_API_KEY. Add it to .env, then run:");
    console.error("  npm run email:reply -- --dry-run");
    process.exit(1);
  }

  const resend = new Resend(resendApiKey);
  const thread = await resolveThread(resend, parentMessageId);
  const subject = formatReplySubject(originalSubject || thread.subject);
  const payload = {
    from,
    to: [recipientEmail],
    cc,
    replyTo: from,
    subject,
    html: replyHtmlBody,
    text: replyTextBody,
    headers: {
      "In-Reply-To": thread.inReplyTo,
      References: thread.references.join(" "),
    },
    tags: [{ name: "category", value: "thread-reply" }],
  };

  console.log("Reply preview");
  console.log(`  parent Resend id: ${parentMessageId}`);
  console.log(`  thread source: ${thread.source}`);
  console.log(`  RFC Message-ID: ${thread.rfcMessageId}`);
  console.log(`  from: ${payload.from}`);
  console.log(`  to: ${payload.to.join(", ")}`);
  console.log(`  cc: ${payload.cc.join(", ")}`);
  console.log(`  subject: ${payload.subject}`);
  console.log(`  In-Reply-To: ${payload.headers["In-Reply-To"]}`);
  console.log(`  References: ${payload.headers.References}`);

  if (dryRun) {
    console.log("\nDry run only. Email was not sent.");
    return;
  }

  const { data, error } = await resend.emails.send(payload);
  if (error) {
    console.error("Failed to send reply:", error);
    process.exit(1);
  }

  console.log("\nReply sent.");
  console.log(`  id: ${data?.id}`);
}

main();
