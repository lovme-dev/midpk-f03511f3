// Retired game catalogues (Free Fire, Roblox, Valorant, PUBG car skins).
// The store now sells PUBG Mobile UC only; these empty stubs keep historical
// order lookups working without re-introducing the removed products.
export interface LegacyPackage {
  id: string;
  name?: string;
  amount?: number;
  price?: number;
  image?: string;
}

export const legacyPackages: LegacyPackage[] = [];
export const getLegacyPackageById = (_id: string): LegacyPackage | undefined => undefined;
