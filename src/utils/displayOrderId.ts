// Public-facing order reference.
// Customers must never see the internal database UUID of an order.
// If an order already has an 18-char style transaction id, we use it.
// Otherwise we derive a stable, uuid-independent-looking 18-letter code.

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const isPublicStyleId = (value?: string | null): boolean =>
  !!value && /^[A-Z0-9]{12,24}$/.test(value);

/** Deterministic 18-letter code derived from any string (e.g. an order UUID). */
export const deriveDisplayOrderId = (seed: string, length = 18): string => {
  let h1 = 0x811c9dc5;
  let h2 = 0x01000193;
  for (let i = 0; i < seed.length; i++) {
    h1 = (h1 ^ seed.charCodeAt(i)) >>> 0;
    h1 = Math.imul(h1, 16777619) >>> 0;
    h2 = (h2 + Math.imul(seed.charCodeAt(i) + i, 2654435761)) >>> 0;
  }
  let out = "";
  for (let i = 0; i < length; i++) {
    h1 = (Math.imul(h1 ^ (i + 1), 2246822519) + h2) >>> 0;
    h2 = (Math.imul(h2 ^ (h1 >>> 13), 3266489917) + 0x9e3779b9) >>> 0;
    out += CHARS[h1 % CHARS.length];
  }
  return out;
};

/** Returns the order reference safe to show customers (never the raw UUID). */
export const getDisplayOrderId = (
  order: { id?: string | null; transaction_id?: string | null } | string,
  transactionId?: string | null
): string => {
  if (typeof order === "string") {
    return isPublicStyleId(transactionId) ? (transactionId as string) : deriveDisplayOrderId(order);
  }
  if (isPublicStyleId(order.transaction_id)) return order.transaction_id as string;
  return deriveDisplayOrderId(order.id || "unknown");
};

export default getDisplayOrderId;
