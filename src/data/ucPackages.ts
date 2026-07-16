
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
    baseAmount: 1230,
    bonusAmount: 990,
    discount: "-10%",
    price: 3600,
    originalPrice: 4000,
    bonusPercent: "80%",
    image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
  },
  {
    id: "6720uc",
    baseAmount: 2500,
    bonusAmount: 1675,
    discount: "-12%",
    price: 8400,
    originalPrice: 9550,
    bonusPercent: "67%",
    image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
  },
  {
    id: "10904uc",
    baseAmount: 4000,
    bonusAmount: 2475,
    discount: "-14%",
    price: 12350,
    originalPrice: 14360,
    bonusPercent: "62%",
    image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
  },
  {
    id: "14668uc",
    baseAmount: 6400,
    bonusAmount: 2940,
    discount: "-16%",
    price: 16200,
    originalPrice: 19285,
    bonusPercent: "46%",
    image: "/lovable-uploads/6b0727f0-f8bd-4223-9e36-ffd7671fc90d.png"
  },
  {
    id: "18341uc",
    baseAmount: 8320,
    bonusAmount: 3365,
    discount: "-18%",
    price: 18750,
    originalPrice: 22865,
    bonusPercent: "40%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "22014uc",
    baseAmount: 10240,
    bonusAmount: 3790,
    discount: "-20%",
    price: 22100,
    originalPrice: 27625,
    bonusPercent: "37%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "25687uc",
    baseAmount: 12160,
    bonusAmount: 4215,
    discount: "-22%",
    price: 25750,
    originalPrice: 33015,
    bonusPercent: "35%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "29360uc",
    baseAmount: 14080,
    bonusAmount: 4635,
    discount: "-23%",
    price: 28750,
    originalPrice: 37335,
    bonusPercent: "33%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "33033uc",
    baseAmount: 16000,
    bonusAmount: 5060,
    discount: "-25%",
    price: 32850,
    originalPrice: 43800,
    bonusPercent: "32%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "36706uc",
    baseAmount: 17920,
    bonusAmount: 5485,
    discount: "-26%",
    price: 35900,
    originalPrice: 48515,
    bonusPercent: "31%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "40379uc",
    baseAmount: 19840,
    bonusAmount: 5910,
    discount: "-28%",
    price: 39750,
    originalPrice: 55210,
    bonusPercent: "30%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "44052uc",
    baseAmount: 21760,
    bonusAmount: 6335,
    discount: "-29%",
    price: 43500,
    originalPrice: 61270,
    bonusPercent: "29%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "47725uc",
    baseAmount: 23680,
    bonusAmount: 6755,
    discount: "-30%",
    price: 47250,
    originalPrice: 67500,
    bonusPercent: "29%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "51398uc",
    baseAmount: 25600,
    bonusAmount: 7180,
    discount: "-31%",
    price: 51000,
    originalPrice: 73915,
    bonusPercent: "28%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "55071uc",
    baseAmount: 27520,
    bonusAmount: 7605,
    discount: "-32%",
    price: 54750,
    originalPrice: 80515,
    bonusPercent: "28%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "58744uc",
    baseAmount: 29440,
    bonusAmount: 8030,
    discount: "-33%",
    price: 58500,
    originalPrice: 87315,
    bonusPercent: "27%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "62417uc",
    baseAmount: 31360,
    bonusAmount: 8455,
    discount: "-34%",
    price: 62250,
    originalPrice: 94320,
    bonusPercent: "27%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  },
  {
    id: "66090uc",
    baseAmount: 33280,
    bonusAmount: 8875,
    discount: "-35%",
    price: 66000,
    originalPrice: 101540,
    bonusPercent: "27%",
    image: "/lovable-uploads/6dcffa69-b046-4099-b802-d86a27b04cc3.png"
  }
];

export const getPackageById = (id: string): UCPackage | undefined => {
  return ucPackages.find(pkg => pkg.id === id);
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
