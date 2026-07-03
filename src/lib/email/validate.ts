import { Resolver } from "node:dns";
import { promisify } from "node:util";
import validator from "validator";

const EMAIL_DOES_NOT_EXIST_MESSAGE = "This email address does not exist.";

const resolver = new Resolver();
resolver.setServers(["1.1.1.1", "8.8.8.8"]);

const resolveMx = promisify(resolver.resolveMx.bind(resolver));
const resolve4 = promisify(resolver.resolve4.bind(resolver));
const resolve6 = promisify(resolver.resolve6.bind(resolver));

async function domainAcceptsMail(domain: string) {
  try {
    const mxRecords = await resolveMx(domain);
    if (mxRecords.length > 0) {
      return true;
    }
  } catch {
    // Fall through to A/AAAA lookup per RFC 5321.
  }

  try {
    const ipv4 = await resolve4(domain);
    if (ipv4.length > 0) {
      return true;
    }
  } catch {
    // Fall through.
  }

  try {
    const ipv6 = await resolve6(domain);
    return ipv6.length > 0;
  } catch {
    return false;
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

  const domain = normalized.split("@")[1];
  if (!domain) {
    return { valid: false as const, error: EMAIL_DOES_NOT_EXIST_MESSAGE };
  }

  const acceptsMail = await domainAcceptsMail(domain);
  if (!acceptsMail) {
    return { valid: false as const, error: EMAIL_DOES_NOT_EXIST_MESSAGE };
  }

  return { valid: true as const, email: normalized };
}
