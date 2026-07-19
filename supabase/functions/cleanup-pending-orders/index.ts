import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();

  const { data: expired, error: selErr } = await supabase
    .from("orders")
    .select("id, order_id")
    .eq("status", "pending")
    .lt("created_at", cutoff);

  if (selErr) {
    return new Response(JSON.stringify({ error: selErr.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const count = expired?.length ?? 0;
  if (count > 0) {
    const ids = expired!.map((o) => o.id);
    const { error: delErr } = await supabase.from("orders").delete().in("id", ids);
    if (delErr) {
      return new Response(JSON.stringify({ error: delErr.message }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  console.log(`Cleaned up ${count} pending orders older than 20 minutes`);
  return new Response(JSON.stringify({ success: true, deleted: count }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
