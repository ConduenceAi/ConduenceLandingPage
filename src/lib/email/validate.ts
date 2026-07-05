import { Resolver } from "node:dns";
import * as net from "node:net";
import { promisify } from "node:util";
import validator from "validator";

const EMAIL_DOES_NOT_EXIST_MESSAGE = "This email address does not exist.";
const DNS_LOOKUP_TIMEOUT_MS = 5_000;
const SMTP_TIMEOUT_MS = 12_000;

const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "tempmail.com",
  "throwaway.email",
  "yopmail.com",
  "sharklasers.com",
  "trashmail.com",
  "getnada.com",
  "maildrop.cc",
  "10minutemail.com",
  "temp-mail.org",
]);

const RESERVED_LOCAL_PARTS = new Set([
  "admin",
  "hostmaster",
  "noreply",
  "no-reply",
  "postmaster",
  "root",
  "test",
  "webmaster",
]);

// SMTP RCPT checks are unreliable for these providers (catch-all / anti-enumeration).
const SMTP_SKIP_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
]);

const resolver = new Resolver();
resolver.setServers(["1.1.1.1", "8.8.8.8"]);

const resolveMx = promisify(resolver.resolveMx.bind(resolver));

type MxRecord = { exchange: string; priority: number };

function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timed out")), timeoutMs);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error: unknown) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

function normalizeMxHost(exchange: string) {
  return exchange.replace(/\.$/, "").trim().toLowerCase();
}

async function lookupMxRecords(domain: string): Promise<MxRecord[]> {
  try {
    const records = await withTimeout(resolveMx(domain), DNS_LOOKUP_TIMEOUT_MS);
    return records
      .map((record) => ({
        exchange: normalizeMxHost(record.exchange),
        priority: record.priority,
      }))
      .filter((record) => record.exchange.length > 0);
  } catch {
    return [];
  }
}

type SmtpResult = "accepted" | "rejected" | "unknown";

function readSmtpResponse(buffer: string) {
  const lines = buffer.split(/\r?\n/).filter(Boolean);
  const lastLine = lines.at(-1) ?? "";
  const code = Number.parseInt(lastLine.slice(0, 3), 10);
  return { code, complete: /^\d{3} /.test(lastLine), buffer: "" };
}

async function smtpRcptTo(mxHost: string, email: string): Promise<SmtpResult> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: mxHost, port: 25 });
    let buffer = "";
    let step = 0;
    let settled = false;

    const finish = (result: SmtpResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      socket.destroy();
      resolve(result);
    };

    const timer = setTimeout(() => finish("unknown"), SMTP_TIMEOUT_MS);

    const send = (command: string) => {
      socket.write(`${command}\r\n`);
    };

    socket.on("error", () => finish("unknown"));

    socket.on("data", (chunk) => {
      buffer += chunk.toString();
      const { code, complete } = readSmtpResponse(buffer);
      if (!complete) return;

      buffer = "";

      if (step === 0) {
        if (code !== 220) return finish("unknown");
        send("EHLO conduence.xyz");
        step = 1;
        return;
      }

      if (step === 1) {
        if (code < 200 || code >= 400) return finish("unknown");
        send("MAIL FROM:<verify@conduence.xyz>");
        step = 2;
        return;
      }

      if (step === 2) {
        if (code < 200 || code >= 400) return finish("unknown");
        send(`RCPT TO:<${email}>`);
        step = 3;
        return;
      }

      if (step === 3) {
        send("QUIT");
        if (code >= 200 && code < 300) return finish("accepted");
        if (code >= 500) return finish("rejected");
        return finish("unknown");
      }
    });
  });
}

async function verifyMailbox(email: string, mxRecords: MxRecord[]) {
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (SMTP_SKIP_DOMAINS.has(domain)) {
    return true;
  }

  const ordered = [...mxRecords].sort((a, b) => a.priority - b.priority);

  for (const mx of ordered) {
    const result = await smtpRcptTo(mx.exchange, email);
    if (result === "accepted") return true;
    if (result === "rejected") return false;
  }

  return false;
}

export async function validateEmailExists(email: string) {
  const normalized = email.trim().toLowerCase();

  if (
    !validator.isEmail(normalized, {
      allow_utf8_local_part: false,
      require_tld: true,
      domain_specific_validation: true,
    })
  ) {
    return { valid: false as const, error: EMAIL_DOES_NOT_EXIST_MESSAGE };
  }

  const [localPart, domain] = normalized.split("@");
  if (!localPart || !domain) {
    return { valid: false as const, error: EMAIL_DOES_NOT_EXIST_MESSAGE };
  }

  if (DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false as const, error: EMAIL_DOES_NOT_EXIST_MESSAGE };
  }

  if (RESERVED_LOCAL_PARTS.has(localPart)) {
    return { valid: false as const, error: EMAIL_DOES_NOT_EXIST_MESSAGE };
  }

  const mxRecords = await lookupMxRecords(domain);
  if (mxRecords.length === 0) {
    return { valid: false as const, error: EMAIL_DOES_NOT_EXIST_MESSAGE };
  }

  const mailboxExists = await verifyMailbox(normalized, mxRecords);
  if (!mailboxExists) {
    return { valid: false as const, error: EMAIL_DOES_NOT_EXIST_MESSAGE };
  }

  return { valid: true as const, email: normalized };
}
