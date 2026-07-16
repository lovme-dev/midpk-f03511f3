
export interface HonorOfKingsPackage {
  id: string;
  baseAmount: number;
  bonusAmount: number;
  discount: string;
  price: number;
  originalPrice: number;
  bonusPercent: string;
  image: string;
}

export const honorOfKingsPackages: HonorOfKingsPackage[] = [
  {
    id: "8tokens",
    baseAmount: 8,
    bonusAmount: 8,
    discount: "-10%",
    price: 0.1,
    originalPrice: 0.11,
    bonusPercent: "100%",
    image: "/lovable-uploads/2e9671ef-3fb8-44fe-99d8-23e8770e0184.png"
  },
  {
    id: "16tokens",
    baseAmount: 16,
    bonusAmount: 16,
    discount: "-10%",
    price: 0.2,
    originalPrice: 0.22,
    bonusPercent: "100%",
    image: "/lovable-uploads/2e9671ef-3fb8-44fe-99d8-23e8770e0184.png"
  },
  {
    id: "23tokens",
    baseAmount: 23,
    bonusAmount: 23,
    discount: "-10%",
    price: 0.29,
    originalPrice: 0.32,
    bonusPercent: "100%",
    image: "/lovable-uploads/2e9671ef-3fb8-44fe-99d8-23e8770e0184.png"
  },
  {
    id: "80tokens",
    baseAmount: 80,
    bonusAmount: 80,
    discount: "-10%",
    price: 0.99,
    originalPrice: 1.10,
    bonusPercent: "100%",
    image: "/lovable-uploads/2e9671ef-3fb8-44fe-99d8-23e8770e0184.png"
  },
  {
    id: "240tokens",
    baseAmount: 240,
    bonusAmount: 48,
    discount: "-10%",
    price: 2.99,
    originalPrice: 3.33,
    bonusPercent: "20%",
    image: "/lovable-uploads/7a1260dc-a150-4ffe-9b1b-fb5c14d3ccb5.png"
  },
  {
    id: "400tokens",
    baseAmount: 400,
    bonusAmount: 80,
    discount: "-10%",
    price: 4.99,
    originalPrice: 5.55,
    bonusPercent: "20%",
    image: "/lovable-uploads/7a1260dc-a150-4ffe-9b1b-fb5c14d3ccb5.png"
  },
  {
    id: "560tokens",
    baseAmount: 560,
    bonusAmount: 112,
    discount: "-10%",
    price: 6.99,
    originalPrice: 7.77,
    bonusPercent: "20%",
    image: "/lovable-uploads/7a1260dc-a150-4ffe-9b1b-fb5c14d3ccb5.png"
  },
  {
    id: "800tokens",
    baseAmount: 800,
    bonusAmount: 160,
    discount: "-10%",
    price: 9.99,
    originalPrice: 11.11,
    bonusPercent: "20%",
    image: "/lovable-uploads/7a1260dc-a150-4ffe-9b1b-fb5c14d3ccb5.png"
  },
  {
    id: "1200tokens",
    baseAmount: 1200,
    bonusAmount: 240,
    discount: "-10%",
    price: 14.99,
    originalPrice: 16.66,
    bonusPercent: "20%",
    image: "/lovable-uploads/7a1260dc-a150-4ffe-9b1b-fb5c14d3ccb5.png"
  },
  {
    id: "2400tokens",
    baseAmount: 2400,
    bonusAmount: 480,
    discount: "-10%",
    price: 29.99,
    originalPrice: 33.33,
    bonusPercent: "20%",
    image: "/lovable-uploads/7a1260dc-a150-4ffe-9b1b-fb5c14d3ccb5.png"
  },
  {
    id: "4000tokens",
    baseAmount: 4000,
    bonusAmount: 800,
    discount: "-10%",
    price: 49.99,
    originalPrice: 55.55,
    bonusPercent: "20%",
    image: "/lovable-uploads/fc52979d-4c60-4eeb-b9a4-ccd58beaa934.png"
  },
  {
    id: "8000tokens",
    baseAmount: 8000,
    bonusAmount: 1600,
    discount: "-10%",
    price: 99.99,
    originalPrice: 111.11,
    bonusPercent: "20%",
    image: "/lovable-uploads/fc52979d-4c60-4eeb-b9a4-ccd58beaa934.png"
  }
];

export const getHonorOfKingsPackageById = (id: string): HonorOfKingsPackage | undefined => {
  return honorOfKingsPackages.find(pkg => pkg.id === id);
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
  return { code: 'us', currency: 'USD' }; // Default to US/USD
};

// Create a broadcasted channel to communicate currency changes
export const setupCountryChangeListener = (callback: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'selectedCountry') {
      callback();
    }
  };
  
  // For direct changes in the same window
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

// Trigger a custom event when country changes
export const triggerCountryChangeEvent = () => {
  const event = new CustomEvent('countryChanged');
  window.dispatchEvent(event);
};
