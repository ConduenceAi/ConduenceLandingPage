import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const NOREPLY_FROM = "CONDUENCE <noreply@conduence.xyz>";

const FORWARDING_RULES: Record<string, string | string[]> = {
  "anjali@conduence.xyz": "anjalijha2k3@gmail.com",
  "sarthakden@conduence.xyz": "dengresarthak420@gmail.com",
  "contact@conduence.xyz": ["dengresarthak420@gmail.com", "blizet2k3@gmail.com"],
};

type ResendWebhookEvent = {
  type: string;
  data: {
    email_id: string;
    to?: string[];
    cc?: string[];
    bcc?: string[];
    received_for?: string[];
  };
};

function normalizeAddress(address: string) {
  const match = address.match(/<([^>]+)>/);
  return (match?.[1] ?? address).trim().toLowerCase();
}

function resolveForwardTargets(address: string): string[] {
  const rule = FORWARDING_RULES[normalizeAddress(address)];
  if (!rule) return [];
  return Array.isArray(rule) ? rule : [rule];
}

function collectRecipients(event: ResendWebhookEvent): string[] {
  return [
    ...(event.data.to ?? []),
    ...(event.data.cc ?? []),
    ...(event.data.bcc ?? []),
    ...(event.data.received_for ?? []),
  ];
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Email service is not configured." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const payload = await request.text();
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;

  let event: ResendWebhookEvent;

  if (webhookSecret) {
    try {
      event = resend.webhooks.verify({
        payload,
        headers: {
          id: request.headers.get("svix-id") ?? "",
          timestamp: request.headers.get("svix-timestamp") ?? "",
          signature: request.headers.get("svix-signature") ?? "",
        },
        webhookSecret,
      }) as ResendWebhookEvent;
    } catch (error) {
      console.error("Resend webhook verification failed", error);
      return NextResponse.json({ error: "Invalid webhook signature." }, { status: 401 });
    }
  } else {
    event = JSON.parse(payload) as ResendWebhookEvent;
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true });
  }

  const recipients = collectRecipients(event);
  const forwardTargets = new Set<string>();

  for (const recipient of recipients) {
    for (const forwardTo of resolveForwardTargets(recipient)) {
      forwardTargets.add(forwardTo);
    }
  }

  if (forwardTargets.size === 0) {
    return NextResponse.json({ ok: true, forwarded: false, recipients });
  }

  try {
    const { data: receivedEmail, error: receiveError } = await resend.emails.receiving.get(
      event.data.email_id,
    );

    if (receiveError || !receivedEmail) {
      throw new Error(receiveError?.message ?? "Unable to load received email.");
    }

    const html =
      receivedEmail.html ??
      (receivedEmail.text ? `<pre>${receivedEmail.text}</pre>` : "<p>(no content)</p>");
    const text = receivedEmail.text ?? receivedEmail.html ?? "(no content)";

    const sendResults = await Promise.all(
      [...forwardTargets].map(async (to) => {
        const { error: sendError } = await resend.emails.send({
          from: NOREPLY_FROM,
          to,
          subject: receivedEmail.subject ? `Fwd: ${receivedEmail.subject}` : "Forwarded email",
          html,
          text,
          replyTo: receivedEmail.from,
        });
        if (sendError) {
          throw new Error(sendError.message);
        }
        return to;
      }),
    );

    return NextResponse.json({ ok: true, forwarded: true, to: sendResults });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to forward email.";
    console.error("Inbound email forwarding failed", message, error);
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
