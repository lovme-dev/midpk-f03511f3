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
    baseAmount: 4000,
    bonusAmount: 2500,
    price: 3800,
    discount: "35%",
    image: "/lovable-uploads/ff-package-1.png"
  },
  {
    id: "diamond-002",
    baseAmount: 7000,
    bonusAmount: 4985,
    price: 8400,
    discount: "28%",
    image: "/lovable-uploads/ff-package-2.png"
  },
  
  // Row 2
  {
    id: "diamond-003",
    baseAmount: 12000,
    bonusAmount: 7500,
    price: 12600,
    discount: "45%",
    image: "/lovable-uploads/ff-package-3.png",
    featured: true
  },
  {
    id: "diamond-004",
    baseAmount: 20000,
    bonusAmount: 12500,
    price: 21000,
    discount: "33%",
    image: "/lovable-uploads/ff-package-4.png"
  },
  
  // Row 3
  {
    id: "diamond-005",
    baseAmount: 30000,
    bonusAmount: 7439,
    price: 42000,
    discount: "42%",
    image: "/lovable-uploads/ff-package-5.png",
    featured: true
  },
  {
    id: "diamond-006",
    baseAmount: 37000,
    bonusAmount: 13950,
    price: 46785,
    discount: "38%",
    image: "/lovable-uploads/ff-package-6.png"
  },
  
  // Row 4
  {
    id: "diamond-007",
    baseAmount: 39000,
    bonusAmount: 14500,
    price: 49750,
    discount: "40%",
    image: "/lovable-uploads/ff-package-1.png"
  },
  {
    id: "diamond-008",
    baseAmount: 41000,
    bonusAmount: 15250,
    price: 53150,
    discount: "29%",
    image: "/lovable-uploads/ff-package-2.png"
  },
  
  // Row 5
  {
    id: "diamond-009",
    baseAmount: 43000,
    bonusAmount: 16000,
    price: 56650,
    discount: "36%",
    image: "/lovable-uploads/ff-package-3.png"
  },
  {
    id: "diamond-010",
    baseAmount: 45000,
    bonusAmount: 16750,
    price: 60050,
    discount: "44%",
    image: "/lovable-uploads/ff-package-4.png"
  },
  
  // Row 6
  {
    id: "diamond-011",
    baseAmount: 47000,
    bonusAmount: 17500,
    price: 63550,
    discount: "31%",
    image: "/lovable-uploads/ff-package-5.png"
  },
  {
    id: "diamond-012",
    baseAmount: 49000,
    bonusAmount: 18250,
    price: 67050,
    discount: "48%",
    image: "/lovable-uploads/ff-package-6.png"
  },
  
  // Row 7
  {
    id: "diamond-013",
    baseAmount: 51000,
    bonusAmount: 19000,
    price: 70550,
    discount: "27%",
    image: "/lovable-uploads/ff-package-1.png"
  },
  {
    id: "diamond-014",
    baseAmount: 53000,
    bonusAmount: 19750,
    price: 74050,
    discount: "41%",
    image: "/lovable-uploads/ff-package-2.png"
  },
  
  // Row 8
  {
    id: "diamond-015",
    baseAmount: 55000,
    bonusAmount: 20500,
    price: 77550,
    discount: "34%",
    image: "/lovable-uploads/ff-package-3.png"
  },
  {
    id: "diamond-016",
    baseAmount: 80000,
    bonusAmount: 50000,
    price: 84000,
    discount: "46%",
    image: "/lovable-uploads/ff-package-4.png"
  },
  
  // Row 9
  {
    id: "diamond-017",
    baseAmount: 120000,
    bonusAmount: 75000,
    price: 126000,
    discount: "50%",
    image: "/lovable-uploads/ff-package-5.png"
  },
  {
    id: "diamond-018",
    baseAmount: 200000,
    bonusAmount: 125000,
    price: 210000,
    discount: "30%",
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