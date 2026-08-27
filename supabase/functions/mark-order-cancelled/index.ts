import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { getDisplayOrderId } from "../_shared/orderIdentity.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getCallerAuth, forbidden } from "../_shared/adminAuth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getCountryFromCurrency = (currencyCode: string): string => {
  const currencyToCountry: Record<string, string> = {
    PKR: "PK", USD: "US", EUR: "DE", GBP: "GB", RUB: "RU", INR: "IN",
    AED: "AE", SAR: "SA", BDT: "BD", MYR: "MY", IDR: "ID", PHP: "PH",
    THB: "TH", VND: "VN", TRY: "TR", JPY: "JP", CNY: "CN", KRW: "KR",
    KZT: "KZ", BRL: "BR", MXN: "MX", CAD: "CA", AUD: "AU",
  };
  return currencyToCountry[currencyCode?.toUpperCase()] || "US";
};

const parsePrimaryAmount = (productAmount?: string | null): number => {
  const first = String(productAmount || "").split("+")[0];
  const parsed = parseInt(first, 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { transactionId, paymentIntentId, reason, targetStatus } = await req.json();
    if (!transactionId) {
      return new Response(JSON.stringify({ success: false, error: "transactionId required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Default = failed. Only "cancelled" triggers refund email + admin push.
    const nextStatus: "failed" | "cancelled" =
      targetStatus === "cancelled" ? "cancelled" : "failed";

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

    // The browser can confirm only the payment intent created for this exact
    // order. This also supports guest orders, whose user_id is the zero UUID.
    const auth = await getCallerAuth(req);
    const gatewayProofMatches = Boolean(
      paymentIntentId && order.gateway_payment_id && paymentIntentId === order.gateway_payment_id
    );
    if (!auth.isAdmin && auth.userId !== order.user_id && !gatewayProofMatches) {
      return forbidden(corsHeaders, "Payment confirmation could not be verified");
    }

    const moveToRefundReviewAfterDelay = async (orderId: string) => {
      await delay(30_000);
      const { error } = await supabase
        .from("orders")
        .update({ status: "refund_review", updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .eq("status", "cancelled");

      if (error) console.error("refund_review transition failed:", error.message);
      else console.log("order moved to refund_review:", orderId);
    };

    if (order.status !== "pending") {
      if (order.status === "cancelled") {
        const runtime = (globalThis as any).EdgeRuntime;
        const task = moveToRefundReviewAfterDelay(order.id);
        if (runtime?.waitUntil) runtime.waitUntil(task);
      }

      return new Response(
        JSON.stringify({ success: true, alreadyProcessed: true, status: order.status, order }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: nextStatus, updated_at: new Date().toISOString() })
      .eq("id", order.id);
    if (updateError) throw updateError;

    const updatedOrder = { ...order, status: nextStatus, updated_at: new Date().toISOString() };

    // Only for "cancelled" (real charge, refund owed) fire admin push + refund email.
    if (nextStatus === "cancelled") {
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
              ucAmount: parsePrimaryAmount(order.product_amount),
              price: order.price || 0,
              currencyCode: order.currency_code || "PKR",
              countryCode: getCountryFromCurrency(order.currency_code || "PKR"),
              playerId: order.player_id || "",
              transactionId: getDisplayOrderId(order.id, order.transaction_id),
              paymentMethod: order.payment_method || "card",
              customerEmail: order.customer_email,
            },
          },
        });
      } catch (e) {
        console.error("refund email failed:", e);
      }

      const runtime = (globalThis as any).EdgeRuntime;
      const task = moveToRefundReviewAfterDelay(order.id);
      if (runtime?.waitUntil) runtime.waitUntil(task);
    }

    return new Response(
      JSON.stringify({ success: true, status: nextStatus, reason, order: updatedOrder }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    console.error("mark-order-cancelled error:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
