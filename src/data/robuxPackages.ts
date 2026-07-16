// Roblox Robux icon imported from assets
import robuxIcon from "@/assets/roblox-logo.jpeg";

export interface RobuxPackage {
  id: string;
  baseAmount: number;
  bonusAmount: number;
  discount: string;
  price: number;
  originalPrice: number;
  bonusPercent: string;
  image: string;
}

export const robuxPackages: RobuxPackage[] = [
  {
    id: "400robux",
    baseAmount: 2835,
    bonusAmount: 1400,
    discount: "-22%",
    price: 2450,
    originalPrice: 3140,
    bonusPercent: "10%",
    image: robuxIcon
  },
  {
    id: "800robux",
    baseAmount: 5670,
    bonusAmount: 2800,
    discount: "-28%",
    price: 4950,
    originalPrice: 6875,
    bonusPercent: "10%",
    image: robuxIcon
  },
  {
    id: "1700robux",
    baseAmount: 8505,
    bonusAmount: 4200,
    discount: "-32%",
    price: 7950,
    originalPrice: 11690,
    bonusPercent: "10%",
    image: robuxIcon
  },
  {
    id: "2200robux",
    baseAmount: 11340,
    bonusAmount: 5600,
    discount: "-38%",
    price: 11450,
    originalPrice: 18470,
    bonusPercent: "10%",
    image: robuxIcon
  },
  {
    id: "4500robux",
    baseAmount: 17010,
    bonusAmount: 8400,
    discount: "-42%",
    price: 15450,
    originalPrice: 26640,
    bonusPercent: "10%",
    image: robuxIcon
  },
  {
    id: "10000robux",
    baseAmount: 28350,
    bonusAmount: 14000,
    discount: "-48%",
    price: 22450,
    originalPrice: 43170,
    bonusPercent: "10%",
    image: robuxIcon
  },
  {
    id: "22500robux",
    baseAmount: 56700,
    bonusAmount: 28000,
    discount: "-52%",
    price: 38450,
    originalPrice: 80100,
    bonusPercent: "10%",
    image: robuxIcon
  },
  {
    id: "50000robux",
    baseAmount: 113400,
    bonusAmount: 56000,
    discount: "-58%",
    price: 68450,
    originalPrice: 162980,
    bonusPercent: "10%",
    image: robuxIcon
  }
];

export const getRobuxPackageById = (id: string): RobuxPackage | undefined => {
  return robuxPackages.find(pkg => pkg.id === id);
};
