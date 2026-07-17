export interface DiamondPackage {
  id: string;
  baseAmount: number;
  bonusAmount: number;
  price: number;
  discount: string;
  image: string;
  featured?: boolean;
}

export const diamondPackages: DiamondPackage[] = [
  // Row 1
  {
    id: "diamond-001",
    baseAmount: 2800,
    bonusAmount: 2500,
    price: 3192,
    discount: "14%",
    image: "/lovable-uploads/ff-package-1.png"
  },
  {
    id: "diamond-002",
    baseAmount: 4900,
    bonusAmount: 4985,
    price: 7056,
    discount: "11%",
    image: "/lovable-uploads/ff-package-2.png"
  },
  
  // Row 2
  {
    id: "diamond-003",
    baseAmount: 8400,
    bonusAmount: 7500,
    price: 10584,
    discount: "18%",
    image: "/lovable-uploads/ff-package-3.png",
    featured: true
  },
  {
    id: "diamond-004",
    baseAmount: 14000,
    bonusAmount: 12500,
    price: 17640,
    discount: "13%",
    image: "/lovable-uploads/ff-package-4.png"
  },
  
  // Row 3
  {
    id: "diamond-005",
    baseAmount: 21000,
    bonusAmount: 7439,
    price: 35280,
    discount: "17%",
    image: "/lovable-uploads/ff-package-5.png",
    featured: true
  },
  {
    id: "diamond-006",
    baseAmount: 25900,
    bonusAmount: 13950,
    price: 39299,
    discount: "15%",
    image: "/lovable-uploads/ff-package-6.png"
  },
  
  // Row 4
  {
    id: "diamond-007",
    baseAmount: 27300,
    bonusAmount: 14500,
    price: 41790,
    discount: "16%",
    image: "/lovable-uploads/ff-package-1.png"
  },
  {
    id: "diamond-008",
    baseAmount: 28700,
    bonusAmount: 15250,
    price: 44646,
    discount: "12%",
    image: "/lovable-uploads/ff-package-2.png"
  },
  
  // Row 5
  {
    id: "diamond-009",
    baseAmount: 30100,
    bonusAmount: 16000,
    price: 47586,
    discount: "14%",
    image: "/lovable-uploads/ff-package-3.png"
  },
  {
    id: "diamond-010",
    baseAmount: 31500,
    bonusAmount: 16750,
    price: 50442,
    discount: "18%",
    image: "/lovable-uploads/ff-package-4.png"
  },
  
  // Row 6
  {
    id: "diamond-011",
    baseAmount: 32900,
    bonusAmount: 17500,
    price: 53382,
    discount: "12%",
    image: "/lovable-uploads/ff-package-5.png"
  },
  {
    id: "diamond-012",
    baseAmount: 34300,
    bonusAmount: 18250,
    price: 56322,
    discount: "19%",
    image: "/lovable-uploads/ff-package-6.png"
  },
  
  // Row 7
  {
    id: "diamond-013",
    baseAmount: 35700,
    bonusAmount: 19000,
    price: 59262,
    discount: "11%",
    image: "/lovable-uploads/ff-package-1.png"
  },
  {
    id: "diamond-014",
    baseAmount: 37100,
    bonusAmount: 19750,
    price: 62202,
    discount: "16%",
    image: "/lovable-uploads/ff-package-2.png"
  },
  
  // Row 8
  {
    id: "diamond-015",
    baseAmount: 38500,
    bonusAmount: 20500,
    price: 65142,
    discount: "14%",
    image: "/lovable-uploads/ff-package-3.png"
  },
  {
    id: "diamond-016",
    baseAmount: 56000,
    bonusAmount: 50000,
    price: 70560,
    discount: "18%",
    image: "/lovable-uploads/ff-package-4.png"
  },
  
  // Row 9
  {
    id: "diamond-017",
    baseAmount: 84000,
    bonusAmount: 75000,
    price: 105840,
    discount: "20%",
    image: "/lovable-uploads/ff-package-5.png"
  },
  {
    id: "diamond-018",
    baseAmount: 140000,
    bonusAmount: 125000,
    price: 176400,
    discount: "12%",
    image: "/lovable-uploads/ff-package-6.png"
  },
  
];

export const getSelectedCountry = () => {
  try {
    const stored = localStorage.getItem('selectedCountry');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing selected country from localStorage:', error);
  }
  return { code: 'us', currency: 'USD' };
};

export const setupCountryChangeListener = (callback: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === 'selectedCountry') {
      callback();
    }
  };

  const handleCountryChanged = () => {
    callback();
  };

  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('countryChanged', handleCountryChanged);

  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('countryChanged', handleCountryChanged);
  };
};

export const triggerCountryChangeEvent = () => {
  window.dispatchEvent(new Event('countryChanged'));
};