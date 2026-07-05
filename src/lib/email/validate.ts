import { Resolver } from "node:dns";
import { promisify } from "node:util";
import validator from "validator";

const EMAIL_DOES_NOT_EXIST_MESSAGE = "This email address does not exist.";
const DNS_LOOKUP_TIMEOUT_MS = 3_000;

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

const resolver = new Resolver();
resolver.setServers(["1.1.1.1", "8.8.8.8"]);

const resolveMx = promisify(resolver.resolveMx.bind(resolver));

const mxCache = new Map<string, { records: string[]; expiresAt: number }>();
const MX_CACHE_TTL_MS = 10 * 60 * 1_000;

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

async function lookupMxRecords(domain: string): Promise<string[]> {
  const cached = mxCache.get(domain);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.records;
  }

  try {
    const records = await withTimeout(resolveMx(domain), DNS_LOOKUP_TIMEOUT_MS);
    const exchanges = records
      .map((record) => record.exchange.replace(/\.$/, "").trim().toLowerCase())
      .filter(Boolean);

    mxCache.set(domain, { records: exchanges, expiresAt: Date.now() + MX_CACHE_TTL_MS });
    return exchanges;
  } catch {
    return [];
  }
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

  return { valid: true as const, email: normalized };
}
