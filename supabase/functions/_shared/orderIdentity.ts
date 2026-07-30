// Shared helpers for edge functions: public order reference + dummy gateway identity.

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const isPublicStyleId = (value?: string | null): boolean =>
  !!value && /^[A-Z0-9]{12,24}$/.test(value);

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

export const getDisplayOrderId = (id: string, transactionId?: string | null): string =>
  isPublicStyleId(transactionId) ? (transactionId as string) : deriveDisplayOrderId(id || "unknown");

/** Random but valid-looking Pakistani mobile number, unique per order. */
export const generateDummyPhone = (): string => {
  const prefixes = ["300", "301", "302", "303", "304", "305", "310", "311", "312", "313", "314", "315", "320", "321", "322", "323", "324", "330", "331", "332", "333", "334", "335", "340", "341", "342", "343", "344", "345"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  let rest = "";
  for (let i = 0; i < 7; i++) rest += Math.floor(Math.random() * 10);
  return `0${prefix}${rest}`;
};

/** Random realistic-looking dummy email for the payment gateway (never the customer's real email). */
export const generateDummyEmail = (): string => {
  const names = ["rehan", "adnan", "bilal", "hamza", "usman", "faisal", "kamran", "noman", "shahid", "waqar", "imran", "danish", "salman", "tariq", "zeeshan", "arsalan", "junaid", "saad", "yasir", "nadeem"];
  const name = names[Math.floor(Math.random() * names.length)];
  const num = Math.floor(1000 + Math.random() * 8999);
  return `${name}${num}@gmail.com`;
};
