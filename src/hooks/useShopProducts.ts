import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  shopProducts as fallbackShopProducts,
  staticShopImages,
  setLiveShopProducts,
  type ShopProduct,
} from "@/data/shopProducts";

export interface ShopProductRow {
  id: string;
  name: string;
  short_title: string;
  price: number;
  original_price: number | null;
  price_prefix: string | null;
  image_url: string | null;
  category: string;
  discount: string | null;
  badge: string | null;
  badge_color: string | null;
  sort_order: number;
  is_active: boolean;
}

export const mapRowToShopProduct = (row: ShopProductRow): ShopProduct => ({
  id: row.id,
  name: row.name,
  shortTitle: row.short_title,
  price: Number(row.price) || 0,
  originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
  pricePrefix: row.price_prefix || undefined,
  // Admin-uploaded image always wins; bundled asset is only a fallback for
  // products that have never been given a custom image.
  image: row.image_url || staticShopImages[row.id] || "",
  category: row.category,
  discount: row.discount || undefined,
  badge: row.badge || undefined,
  badgeColor: row.badge_color || undefined,
});

/**
 * Live shop catalog. Reads from the database (admin-managed) and stays in sync
 * in real time, falling back to the bundled catalog only until the first load.
 */
export const useShopProducts = () => {
  const [products, setProducts] = useState<ShopProduct[]>(fallbackShopProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { data, error } = await supabase
        .from("shop_products")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (cancelled) return;
      if (!error && data) {
        const mapped = (data as unknown as ShopProductRow[]).map(mapRowToShopProduct);
        setProducts(mapped);
        setLiveShopProducts(mapped);
      }
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel("shop-products-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "shop_products" },
        () => load()
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, loading };
};
