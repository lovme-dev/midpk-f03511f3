// SSR safety: provide no-op localStorage/sessionStorage on the server so
// modules that read browser storage during evaluation/render don't crash.
type StorageLike = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  key: (index: number) => string | null;
  length: number;
};

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    getItem: (key) => (map.has(key) ? (map.get(key) as string) : null),
    setItem: (key, value) => {
      map.set(key, String(value));
    },
    removeItem: (key) => {
      map.delete(key);
    },
    clear: () => {
      map.clear();
    },
    key: (index) => Array.from(map.keys())[index] ?? null,
    get length() {
      return map.size;
    },
  };
}

export function installSsrStoragePolyfill(): void {
  const g = globalThis as unknown as Record<string, unknown>;
  if (typeof g["window"] !== "undefined") return;
  if (typeof g["localStorage"] === "undefined") {
    g["localStorage"] = createMemoryStorage();
  }
  if (typeof g["sessionStorage"] === "undefined") {
    g["sessionStorage"] = createMemoryStorage();
  }
}

installSsrStoragePolyfill();
