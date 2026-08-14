// Retired game catalogues (Free Fire, Roblox, Valorant, PUBG car skins).
// The store now sells PUBG Mobile UC only; these empty stubs keep historical
// order lookups working without re-introducing the removed products.
export interface LegacyPackage {
  id: string;
  name?: string;
  amount?: number;
  baseAmount?: number;
  bonusAmount?: number;
  price?: number;
  image?: string;
  [key: string]: unknown;
}

export const legacyPackages: LegacyPackage[] = [];
export const getLegacyPackageById = (_id: string | number): LegacyPackage | undefined => undefined;
