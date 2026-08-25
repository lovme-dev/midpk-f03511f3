import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type OrderRow = {
  id: string;
  user_id: string;
  package_id: string | null;
  price: number | null;
  status: string | null;
  payment_method: string | null;
  transaction_id: string | null;
  player_id: string | null;
  username?: string | null;
  currency_code: string | null;
  email_sent_at: string | null;
  product_type: string | null;
  product_name: string | null;
  product_code: string | null;
  product_amount: string | null;
  pkr_amount?: number | null;
  exchange_rate?: number | null;
  payment_screenshot_url?: string | null;
  customer_email?: string | null;
  customer_name?: string | null;
  created_at: string;
  updated_at: string;
};

const toArchiveRows = (orders: OrderRow[], reason: string) => orders.map((order) => ({
  original_id: order.id,
  user_id: order.user_id,
  package_id: order.package_id,
  price: order.price,
  status: order.status,
  payment_method: order.payment_method,
  transaction_id: order.transaction_id,
  player_id: order.player_id,
  username: order.username ?? null,
  currency_code: order.currency_code,
  email_sent_at: order.email_sent_at,
  product_type: order.product_type,
  product_name: order.product_name,
  product_code: order.product_code,
  product_amount: order.product_amount,
  pkr_amount: order.pkr_amount ?? null,
  exchange_rate: order.exchange_rate ?? null,
  payment_screenshot_url: order.payment_screenshot_url ?? null,
  customer_email: order.customer_email ?? null,
  customer_name: order.customer_name ?? null,
  original_created_at: order.created_at,
  original_updated_at: order.updated_at,
  archived_reason: reason,
}));

async function notifyAdminCancelled(order: OrderRow) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/notify-admin-new-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({
        event_type: "order_cancelled",
        order_details: {
          order_id: order.id,
          package_name: order.product_name || "Package",
          price: order.price || 0,
          player_id: order.player_id || "N/A",
          currency_code: order.currency_code || "PKR",
        },
      }),
    });

    if (!response.ok) {
      console.error("Admin cancel push failed:", response.status, await response.text());
    }
  } catch (error) {
    console.error("Admin cancel push error:", error);
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const now = new Date().toISOString();
    const refundReviewCutoff = new Date(Date.now() - 30 * 1000).toISOString();
    // Pending orders stay visible in the admin panel for 24h. A card charge that
    // succeeds at the gateway but never reaches our thank-you page must never be
    // silently deleted after 30 minutes.
    const pendingCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const failedCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { data: pendingTestOrders, error: pendingTestError } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending")
      .eq("payment_method", "test_payment");

    if (pendingTestError) throw pendingTestError;

    if (pendingTestOrders?.length) {
      const ids = pendingTestOrders.map((order: OrderRow) => order.id);
      const { error } = await supabase
        .from("orders")
        .update({ status: "cancelled", updated_at: now })
        .in("id", ids);
      if (error) throw error;

      await Promise.allSettled((pendingTestOrders as OrderRow[]).map(notifyAdminCancelled));
    }

    const { data: refundReviewOrders, error: refundReviewSelectError } = await supabase
      .from("orders")
      .select("id")
      .eq("status", "cancelled")
      .lt("updated_at", refundReviewCutoff);

    if (refundReviewSelectError) throw refundReviewSelectError;

    const refundReviewIds = refundReviewOrders?.map((order: { id: string }) => order.id) ?? [];
    if (refundReviewIds.length) {
      const { error } = await supabase
        .from("orders")
        .update({ status: "refund_review", updated_at: now })
        .in("id", refundReviewIds);
      if (error) throw error;
    }

    const { data: expiredPending, error: pendingSelectError } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "pending")
      .lt("created_at", pendingCutoff);

    if (pendingSelectError) throw pendingSelectError;

    if (expiredPending?.length) {
      const archiveRows = toArchiveRows(expiredPending as OrderRow[], "pending_timeout");
      const { error: archiveError } = await supabase.from("orders_archive").insert(archiveRows);
      if (archiveError) throw archiveError;

      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .in("id", expiredPending.map((order: OrderRow) => order.id));
      if (deleteError) throw deleteError;
    }

    const { data: expiredFailed, error: failedSelectError } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "failed")
      .lt("created_at", failedCutoff);

    if (failedSelectError) throw failedSelectError;

    if (expiredFailed?.length) {
      const archiveRows = toArchiveRows(expiredFailed as OrderRow[], "failed_timeout");
      const { error: archiveError } = await supabase.from("orders_archive").insert(archiveRows);
      if (archiveError) throw archiveError;

      const { error: deleteError } = await supabase
        .from("orders")
        .delete()
        .in("id", expiredFailed.map((order: OrderRow) => order.id));
      if (deleteError) throw deleteError;
    }

    return new Response(JSON.stringify({
      success: true,
      testOrdersCancelled: pendingTestOrders?.length ?? 0,
      movedToRefundReview: refundReviewIds.length,
      pendingArchived: expiredPending?.length ?? 0,
      failedArchived: expiredFailed?.length ?? 0,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Cleanup failed";
    console.error("cleanup-pending-orders failed:", message);
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
