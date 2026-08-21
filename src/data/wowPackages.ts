import wowStack from "@/assets/wow-uc-stack.png.asset.json";
import { UCPackage } from "./ucPackages";

// WOW section packages — INDEPENDENT from the UC page packages.
// Edits here must not affect src/data/ucPackages.ts.
export const wowPackages: UCPackage[] = [
  {
    id: "3350uc",
    baseAmount: 1107,
    bonusAmount: 921,
    discount: "-10%",
    price: 3420,
    originalPrice: 3800,
    bonusPercent: "83%",
    image: wowStack.url
  },
  {
    id: "6720uc",
    baseAmount: 2250,
    bonusAmount: 1558,
    discount: "-12%",
    price: 7980,
    originalPrice: 9068,
    bonusPercent: "69%",
    image: wowStack.url
  },
  {
    id: "10904uc",
    baseAmount: 3600,
    bonusAmount: 2302,
    discount: "-14%",
    price: 11732,
    originalPrice: 13642,
    bonusPercent: "64%",
    image: wowStack.url
  },
  {
    id: "14668uc",
    baseAmount: 5760,
    bonusAmount: 2734,
    discount: "-16%",
    price: 15390,
    originalPrice: 18321,
    bonusPercent: "47%",
    image: wowStack.url
  },
  {
    id: "18341uc",
    baseAmount: 7488,
    bonusAmount: 3129,
    discount: "-18%",
    price: 17812,
    originalPrice: 21722,
    bonusPercent: "42%",
    image: wowStack.url
  },
  {
    id: "22014uc",
    baseAmount: 9216,
    bonusAmount: 3525,
    discount: "-20%",
    price: 20995,
    originalPrice: 26244,
    bonusPercent: "38%",
    image: wowStack.url
  },
  {
    id: "25687uc",
    baseAmount: 10944,
    bonusAmount: 3920,
    discount: "-22%",
    price: 24462,
    originalPrice: 31362,
    bonusPercent: "36%",
    image: wowStack.url
  },
  {
    id: "29360uc",
    baseAmount: 12672,
    bonusAmount: 4311,
    discount: "-23%",
    price: 27312,
    originalPrice: 35470,
    bonusPercent: "34%",
    image: wowStack.url
  },
  {
    id: "33033uc",
    baseAmount: 14400,
    bonusAmount: 4706,
    discount: "-25%",
    price: 31208,
    originalPrice: 41611,
    bonusPercent: "33%",
    image: wowStack.url
  },
  {
    id: "36706uc",
    baseAmount: 16128,
    bonusAmount: 5101,
    discount: "-26%",
    price: 34105,
    originalPrice: 46088,
    bonusPercent: "32%",
    image: wowStack.url
  },
  {
    id: "40379uc",
    baseAmount: 17856,
    bonusAmount: 5496,
    discount: "-28%",
    price: 37762,
    originalPrice: 52447,
    bonusPercent: "31%",
    image: wowStack.url
  },
  {
    id: "44052uc",
    baseAmount: 19584,
    bonusAmount: 5892,
    discount: "-29%",
    price: 41325,
    originalPrice: 58204,
    bonusPercent: "30%",
    image: wowStack.url
  },
  {
    id: "47725uc",
    baseAmount: 21312,
    bonusAmount: 6282,
    discount: "-30%",
    price: 44888,
    originalPrice: 64126,
    bonusPercent: "29%",
    image: wowStack.url
  },
  {
    id: "51398uc",
    baseAmount: 23040,
    bonusAmount: 6677,
    discount: "-31%",
    price: 48450,
    originalPrice: 70217,
    bonusPercent: "29%",
    image: wowStack.url
  },
  {
    id: "55071uc",
    baseAmount: 24768,
    bonusAmount: 7073,
    discount: "-32%",
    price: 52012,
    originalPrice: 76488,
    bonusPercent: "29%",
    image: wowStack.url
  },
  {
    id: "58744uc",
    baseAmount: 26496,
    bonusAmount: 7468,
    discount: "-33%",
    price: 55575,
    originalPrice: 82948,
    bonusPercent: "28%",
    image: wowStack.url
  },
  {
    id: "62417uc",
    baseAmount: 28224,
    bonusAmount: 7863,
    discount: "-34%",
    price: 59138,
    originalPrice: 89603,
    bonusPercent: "28%",
    image: wowStack.url
  },
  {
    id: "66090uc",
    baseAmount: 29952,
    bonusAmount: 8254,
    discount: "-35%",
    price: 62700,
    originalPrice: 96462,
    bonusPercent: "28%",
    image: wowStack.url
  }
];


export const getWowPackageById = (id: string): UCPackage | undefined =>
  wowPackages.find((pkg) => pkg.id === id);
