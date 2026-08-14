// Helpers for support.functions.ts server functions.

export const SELECT_COLUMNS = [
  "id",
  "transaction_id",
  "status",
  "package_id",
  "product_type",
  "product_name",
  "product_amount",
  "price",
  "currency_code",
  "created_at",
  "payment_method",
  "player_id",
].join(",");

export const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export const detectLanguage = (text: string) => {
  if (/[\u0600-\u06FF]/.test(text)) return 'urdu';
  if (/[\u4e00-\u9fff]/.test(text)) return 'chinese';
  if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'japanese';
  if (/[\uac00-\ud7af]/.test(text)) return 'korean';
  if (/[\u0400-\u04FF]/.test(text)) return 'russian';
  if (/[ñáéíóúü]/i.test(text)) return 'spanish';
  if (/[àâäçéèêëïîôöùûüÿ]/i.test(text)) return 'french';
  if (/[äöüß]/i.test(text)) return 'german';
  return 'english';
};

export const getCountryFromCurrency = (currencyCode: string): string => {
  const currencyToCountry: Record<string, string> = {
    PKR: "PK", USD: "US", EUR: "DE", GBP: "GB", RUB: "RU", INR: "IN",
    AED: "AE", SAR: "SA", BDT: "BD", MYR: "MY", IDR: "ID", PHP: "PH",
    THB: "TH", VND: "VN", TRY: "TR", JPY: "JP", CNY: "CN", KRW: "KR",
    KZT: "KZ", BRL: "BR", MXN: "MX", CAD: "CA", AUD: "AU",
  };
  return currencyToCountry[currencyCode?.toUpperCase()] || "US";
};

export const parsePrimaryAmount = (productAmount?: string | null): number => {
  const first = String(productAmount || "").split("+")[0];
  const parsed = parseInt(first, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

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

export const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Resolves the caller's user id + admin flag from a Bearer token, if present. */
export async function getCallerAuth(authHeader: string | null): Promise<{ userId: string | null; isAdmin: boolean }> {
  const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

  let token = "";
  if (authHeader?.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  }

  if (!token) return { userId: null, isAdmin: false };

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data?.user) return { userId: null, isAdmin: false };

  const { data: isAdmin } = await supabaseAdmin.rpc('has_role', { _user_id: data.user.id, _role: 'admin' });

  return { userId: data.user.id, isAdmin: !!isAdmin };
}
