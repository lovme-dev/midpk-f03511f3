// Generates a random mixed uppercase letter ID like "SRRTTFDFGSRYTRHDHD"
// No prefix, no numbers, no separators — pure A-Z letters.
export const generateOrderId = (length: number = 16): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let out = "";
  const cryptoObj: Crypto | undefined =
    typeof globalThis !== "undefined" ? (globalThis.crypto as Crypto | undefined) : undefined;
  if (cryptoObj && cryptoObj.getRandomValues) {
    const arr = new Uint32Array(length);
    cryptoObj.getRandomValues(arr);
    for (let i = 0; i < length; i++) out += chars[arr[i] % chars.length];
  } else {
    for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
};
