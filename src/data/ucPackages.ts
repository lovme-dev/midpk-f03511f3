
export interface UCPackage {
  id: string;
  baseAmount: number;
  bonusAmount: number;
  discount: string;
  price: number;
  originalPrice: number;
  bonusPercent: string;
  image: string;
}

// Discount ladder from 10% (first) up to 35% (last) across 17 packages
// originalPrice = round(price / (1 - discount/100))
export const ucPackages: UCPackage[] = [
  {
    id: "3350uc",
    baseAmount: 1107,
    bonusAmount: 921,
    discount: "-10%",
    price: 3420,
    originalPrice: 3800,
    bonusPercent: "83%",
    image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
  },
  {
    id: "6720uc",
    baseAmount: 2250,
    bonusAmount: 1558,
    discount: "-12%",
    price: 7980,
    originalPrice: 9068,
    bonusPercent: "69%",
    image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
  },
  {
    id: "10904uc",
    baseAmount: 3600,
    bonusAmount: 2302,
    discount: "-14%",
    price: 11732,
    originalPrice: 13642,
    bonusPercent: "64%",
    image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
  },
  {
    id: "14668uc",
    baseAmount: 5760,
    bonusAmount: 2734,
    discount: "-16%",
    price: 15390,
    originalPrice: 18321,
    bonusPercent: "47%",
    image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
  },
  {
    id: "18341uc",
    baseAmount: 7488,
    bonusAmount: 3129,
    discount: "-18%",
    price: 17812,
    originalPrice: 21722,
    bonusPercent: "42%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "22014uc",
    baseAmount: 9216,
    bonusAmount: 3525,
    discount: "-20%",
    price: 20995,
    originalPrice: 26244,
    bonusPercent: "38%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "25687uc",
    baseAmount: 10944,
    bonusAmount: 3920,
    discount: "-22%",
    price: 24462,
    originalPrice: 31362,
    bonusPercent: "36%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "29360uc",
    baseAmount: 12672,
    bonusAmount: 4311,
    discount: "-23%",
    price: 27312,
    originalPrice: 35470,
    bonusPercent: "34%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "33033uc",
    baseAmount: 14400,
    bonusAmount: 4706,
    discount: "-25%",
    price: 31208,
    originalPrice: 41611,
    bonusPercent: "33%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "36706uc",
    baseAmount: 16128,
    bonusAmount: 5101,
    discount: "-26%",
    price: 34105,
    originalPrice: 46088,
    bonusPercent: "32%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "40379uc",
    baseAmount: 17856,
    bonusAmount: 5496,
    discount: "-28%",
    price: 37762,
    originalPrice: 52447,
    bonusPercent: "31%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "44052uc",
    baseAmount: 19584,
    bonusAmount: 5892,
    discount: "-29%",
    price: 41325,
    originalPrice: 58204,
    bonusPercent: "30%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "47725uc",
    baseAmount: 21312,
    bonusAmount: 6282,
    discount: "-30%",
    price: 44888,
    originalPrice: 64126,
    bonusPercent: "29%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "51398uc",
    baseAmount: 23040,
    bonusAmount: 6677,
    discount: "-31%",
    price: 48450,
    originalPrice: 70217,
    bonusPercent: "29%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "55071uc",
    baseAmount: 24768,
    bonusAmount: 7073,
    discount: "-32%",
    price: 52012,
    originalPrice: 76488,
    bonusPercent: "29%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "58744uc",
    baseAmount: 26496,
    bonusAmount: 7468,
    discount: "-33%",
    price: 55575,
    originalPrice: 82948,
    bonusPercent: "28%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "62417uc",
    baseAmount: 28224,
    bonusAmount: 7863,
    discount: "-34%",
    price: 59138,
    originalPrice: 89603,
    bonusPercent: "28%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "66090uc",
    baseAmount: 29952,
    bonusAmount: 8254,
    discount: "-35%",
    price: 62700,
    originalPrice: 96462,
    bonusPercent: "28%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  }
];

// Admin-only test package for QA'ing real card payments cheaply.
// Only injected into the visible list when the current user has the admin role.
export const adminTestPackage: UCPackage = {
  id: "admin-test-100uc",
  baseAmount: 100,
  bonusAmount: 0,
  discount: "-98%",
  price: 10,
  originalPrice: 510,
  bonusPercent: "0%",
  image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png",
};

export const getPackageById = (id: string): UCPackage | undefined => {
  if (id === adminTestPackage.id) return adminTestPackage;
  return ucPackages.find(pkg => pkg.id === id);
};

// VIP Coin "Extra for you" reward count. Scales with package size:
// smallest package = x20, and each larger tier adds +10 (x30, x40, ..., x180).
// Admin test package always returns x20.
export const getVipCoinCount = (input: { id?: string; baseAmount?: number; ucAmount?: number } | string | number): number => {
  let idx = -1;
  if (typeof input === 'string') {
    if (input === adminTestPackage.id) return 20;
    idx = ucPackages.findIndex(p => p.id === input);
  } else if (typeof input === 'number') {
    idx = ucPackages.findIndex(p => p.baseAmount === input);
  } else if (input && typeof input === 'object') {
    if (input.id === adminTestPackage.id) return 20;
    if (input.id) idx = ucPackages.findIndex(p => p.id === input.id);
    if (idx < 0 && input.baseAmount != null) idx = ucPackages.findIndex(p => p.baseAmount === input.baseAmount);
    if (idx < 0 && input.ucAmount != null) idx = ucPackages.findIndex(p => p.baseAmount === input.ucAmount);
  }
  if (idx < 0) return 20;
  return 20 + idx * 10;
};

// Get currently selected country from localStorage
export const getSelectedCountry = (): { code: string; currency: string } => {
  try {
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      const country = JSON.parse(savedCountry);
      return { code: country.code, currency: country.currency };
    }
  } catch (error) {
    console.error('Error getting selected country:', error);
  }
  return { code: 'pk', currency: 'PKR' };
};

export const setupCountryChangeListener = (callback: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'selectedCountry') {
      callback();
    }
  };
  
  const handleCustomEvent = () => {
    callback();
  };
  
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('countryChanged', handleCustomEvent);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('countryChanged', handleCustomEvent);
  };
};

export const triggerCountryChangeEvent = () => {
  const event = new CustomEvent('countryChanged');
  window.dispatchEvent(event);
};
