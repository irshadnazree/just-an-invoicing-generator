export function generateRandomString(length: number): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
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
