import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { transactionId, reason } = await req.json();
    if (!transactionId) {
      return new Response(JSON.stringify({ success: false, error: "transactionId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order, error: fetchError } = await supabase
      .from("orders")
      .select("*")
      .eq("transaction_id", transactionId)
      .maybeSingle();

    if (fetchError) throw fetchError;
    if (!order) {
      return new Response(JSON.stringify({ success: false, error: "Order not found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order.status !== "pending") {
      return new Response(JSON.stringify({ success: true, alreadyProcessed: true, status: order.status }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", order.id);
    if (updateError) throw updateError;

    // Fire-and-wait: admin push notification (cancelled)
    try {
      await supabase.functions.invoke("notify-admin-new-order", {
        body: {
          event_type: "order_cancelled",
          order_details: {
            order_id: order.id,
            package_name: order.product_name || "Package",
            price: order.price || 0,
            player_id: order.player_id || "N/A",
            currency_code: order.currency_code || "PKR",
          },
        },
      });
    } catch (e) {
      console.error("notify-admin failed:", e);
    }

    // Customer refund email
    try {
      await supabase.functions.invoke("send-order-email", {
        body: {
          userId: order.user_id,
          orderId: order.id,
          emailType: "refund",
          orderDetails: {
            packageName: order.product_name || "Package",
            productName: order.product_name || "Package",
            productAmount: order.product_amount,
            productType: order.product_type || "pubg_uc",
            ucAmount: order.product_amount ? parseInt(order.product_amount) : 0,
            price: order.price || 0,
            currencyCode: order.currency_code || "PKR",
            playerId: order.player_id || "",
            transactionId: order.transaction_id || "",
            paymentMethod: order.payment_method || "card",
            customerEmail: order.customer_email,
          },
        },
      });
    } catch (e) {
      console.error("refund email failed:", e);
    }

    return new Response(JSON.stringify({ success: true, status: "cancelled", reason }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    console.error("mark-order-cancelled error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
