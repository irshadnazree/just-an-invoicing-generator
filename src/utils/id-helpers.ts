export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const randomValues = crypto.getRandomValues(new Uint8Array(length));

  return Array.from(randomValues, (value) => chars[value % chars.length]).join(
    ""
  );
}

const CODE_REGEX = /^(\D*)(\d+)$/;

export function incrementCodeFlexible(code: string) {
  const match = code.match(CODE_REGEX);
  if (!match) {
    throw new Error("Code must end with digits");
  }
  const [, prefix, digits] = match;
  const next = String(Number.parseInt(digits, 10) + 1).padStart(
    digits.length,
    "0"
  );
  return prefix + next;
}
