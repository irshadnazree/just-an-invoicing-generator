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

// Regex for display IDs like "RDQ001" or "RDI001" (3-letter prefix + 3 digits)
const DISPLAY_ID_REGEX = /^([A-Z]{2})(\d{3})$/;

/**
 * Increment a display ID with 3-letter prefix and 3-digit number
 * Returns default if the ID doesn't match pattern or overflows
 */
export function incrementDisplayId(
  currentId: string,
  defaultId: string
): string {
  const match = currentId.match(DISPLAY_ID_REGEX);
  if (!match) {
    return defaultId;
  }

  const [, prefix, digits] = match;
  const num = Number.parseInt(digits, 10);

  // Check if incrementing would exceed 3 digits
  if (num >= 999) {
    return defaultId;
  }

  const next = String(num + 1).padStart(3, "0");
  return prefix + next;
}

type ItemWithDisplayId = {
  [key: string]: unknown;
  updatedAt: string;
};

/**
 * Get the next display ID based on the most recent item
 * Finds item with latest updatedAt, extracts ID, and increments it
 * Returns defaultId if no items or pattern doesn't match
 */
export function getNextDisplayId<T extends ItemWithDisplayId>(
  items: T[],
  idField: keyof T,
  defaultId: string
): string {
  if (items.length === 0) {
    return defaultId;
  }

  // Find the most recent item by updatedAt
  const mostRecent = items.reduce((latest, current) =>
    new Date(current.updatedAt) > new Date(latest.updatedAt) ? current : latest
  );

  const currentId = mostRecent[idField] as string;

  if (!currentId || currentId.trim() === "") {
    return defaultId;
  }

  return incrementDisplayId(currentId, defaultId);
}
