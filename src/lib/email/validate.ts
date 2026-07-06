const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function validateEmail(email: string) {
  const normalized = email.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(normalized)) {
    return { valid: false as const, error: "Please enter a valid email address." };
  }

  const domain = normalized.split("@")[1];
  if (domain && DISPOSABLE_DOMAINS.has(domain)) {
    return { valid: false as const, error: "Please use a permanent email address." };
  }

  return { valid: true as const, email: normalized };
}
