import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type TrackOrderRequest = {
  query?: string;
};

const SELECT_COLUMNS = [
  "id",
  "transaction_id",
  "status",
  "package_id",
  "product_type",
  "product_name",
  "product_amount",
  "price",
  "currency_code",
  "created_at",
  "payment_method",
  "player_id",
].join(",");

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body: TrackOrderRequest = await req.json();
    const raw = (body.query ?? "").toString();
    const query = raw.trim().replace(/\s+/g, "");

    if (!query) {
      return new Response(JSON.stringify({ success: false, error: "Missing query" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (query.length > 200) {
      return new Response(JSON.stringify({ success: false, error: "Query too long" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    let order: Record<string, unknown> | null = null;

    // 1) UUID (database id)
    if (isUuid(query)) {
      const { data, error } = await supabase
        .from("orders")
        .select(SELECT_COLUMNS)
        .eq("id", query)
        .maybeSingle();
      if (error) throw error;
      order = data;
    }

    // 2) Exact transaction_id
    if (!order) {
      const { data, error } = await supabase
        .from("orders")
        .select(SELECT_COLUMNS)
        .eq("transaction_id", query)
        .maybeSingle();
      if (error) throw error;
      order = data;
    }

    // 3) Partial transaction_id prefix (e.g., user pasted a truncated "ORD-..." string)
    if (!order && query.toUpperCase().startsWith("ORD-")) {
      const { data, error } = await supabase
        .from("orders")
        .select(SELECT_COLUMNS)
        .ilike("transaction_id", `${query}%`)
        .order("created_at", { ascending: false })
        .limit(2);
      if (error) throw error;
      if (data && data.length === 1) order = data[0];
    }

    // 4) Short code (last segment) e.g. "KTE8K508F"
    if (!order) {
      const short = query.replace(/[^a-zA-Z0-9]/g, "");
      if (short.length >= 6 && short.length <= 20) {
        const { data, error } = await supabase
          .from("orders")
          .select(SELECT_COLUMNS)
          .ilike("transaction_id", `%-${short}`)
          .order("created_at", { ascending: false })
          .limit(2);
        if (error) throw error;
        if (data && data.length === 1) order = data[0];
      }
    }

    return new Response(JSON.stringify({ success: true, order }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("track-order error:", err);
    return new Response(JSON.stringify({ success: false, error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
