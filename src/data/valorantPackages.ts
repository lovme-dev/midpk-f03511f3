export interface ValorantPackage {
  id: string;
  baseAmount: number;
  bonusAmount: number;
  discount: string;
  price: number;
  originalPrice: number;
  bonusPercent: string;
  image: string;
}

export const valorantPackages: ValorantPackage[] = [
  {
    id: "vp-475",
    baseAmount: 475,
    bonusAmount: 25,
    discount: "-15%",
    price: 850,
    originalPrice: 1000,
    bonusPercent: "5%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-1000",
    baseAmount: 1000,
    bonusAmount: 50,
    discount: "-20%",
    price: 1700,
    originalPrice: 2125,
    bonusPercent: "5%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-2050",
    baseAmount: 2050,
    bonusAmount: 150,
    discount: "-25%",
    price: 3400,
    originalPrice: 4533,
    bonusPercent: "7%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-3650",
    baseAmount: 3650,
    bonusAmount: 300,
    discount: "-30%",
    price: 5950,
    originalPrice: 8500,
    bonusPercent: "8%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-5350",
    baseAmount: 5350,
    bonusAmount: 500,
    discount: "-35%",
    price: 8500,
    originalPrice: 13077,
    bonusPercent: "9%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-11000",
    baseAmount: 11000,
    bonusAmount: 1200,
    discount: "-40%",
    price: 16500,
    originalPrice: 27500,
    bonusPercent: "11%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-18500",
    baseAmount: 18500,
    bonusAmount: 2500,
    discount: "-45%",
    price: 27000,
    originalPrice: 49091,
    bonusPercent: "14%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-25000",
    baseAmount: 25000,
    bonusAmount: 3500,
    discount: "-50%",
    price: 35000,
    originalPrice: 70000,
    bonusPercent: "14%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-35000",
    baseAmount: 35000,
    bonusAmount: 5500,
    discount: "-55%",
    price: 48000,
    originalPrice: 106667,
    bonusPercent: "16%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  },
  {
    id: "vp-50000",
    baseAmount: 50000,
    bonusAmount: 8500,
    discount: "-60%",
    price: 65000,
    originalPrice: 162500,
    bonusPercent: "17%",
    image: "/lovable-uploads/valorant-points-logo.webp"
  }
];

export const getSelectedCountry = () => {
  try {
    const stored = localStorage.getItem('selectedCountry');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error parsing stored country:', error);
  }
  return { code: 'pk', currency: 'PKR' };
};
