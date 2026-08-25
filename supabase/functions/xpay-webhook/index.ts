import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-xpay-signature',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle GET request for testing
  if (req.method === 'GET') {
    return new Response(
      JSON.stringify({ status: 'active', message: 'XPay webhook endpoint is active' }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const XPAY_WEBHOOK_SIGNATURE_SECRET = Deno.env.get('XPAY_WEBHOOK_SIGNATURE_SECRET');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!XPAY_WEBHOOK_SIGNATURE_SECRET) {
      console.error('Missing webhook signature secret');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get raw body for signature verification
    const rawBody = await req.text();
    console.log('Webhook received:', rawBody);

    // Verify webhook signature
    const receivedSignature = req.headers.get('x-xpay-signature') || req.headers.get('X-XPay-Signature');
    
    if (!receivedSignature) {
      console.error('Missing webhook signature header');
      return new Response(
        JSON.stringify({ error: 'Missing signature' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    {
      const hmac = createHmac('sha256', XPAY_WEBHOOK_SIGNATURE_SECRET);
      hmac.update(rawBody);
      const expectedSignature = hmac.digest('hex');

      if (receivedSignature !== expectedSignature) {
        console.error('Webhook signature mismatch');
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.log('Webhook signature verified');
    }

    // Parse webhook payload
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (e) {
      console.error('Failed to parse webhook payload:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid JSON payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Webhook payload:', JSON.stringify(payload, null, 2));

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Extract payment details from webhook.
    // XPay echoes our internal order id inside metadata (internal_order_id).
    const orderId =
      payload.metadata?.internal_order_id ||
      payload.data?.metadata?.internal_order_id ||
      payload.order_id ||
      payload.metadata?.order_id;
    const paymentStatus = (payload.status || payload.data?.status || payload.event || '')
      .toString()
      .toLowerCase();
    const paymentIntentId = payload.id || payload.payment_intent_id;

    console.log('Processing payment:', { orderId, paymentStatus, paymentIntentId });

    if (!orderId) {
      console.error('No order_id in webhook payload');
      return new Response(
        JSON.stringify({ error: 'Missing order_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map XPay status to our status.
    // A successful charge is NOT fulfilled here: business flow is
    // charge -> cancelled -> (30s) refund_review, with a refund email to the customer.
    let orderStatus = 'pending';
    if (paymentStatus.includes('succeed') || paymentStatus.includes('complete') || paymentStatus.includes('paid')) {
      orderStatus = 'cancelled';
    } else if (paymentStatus.includes('fail') || paymentStatus.includes('cancel') || paymentStatus.includes('declin')) {
      orderStatus = 'failed';
    } else if (paymentStatus.includes('processing')) {
      orderStatus = 'processing';
    }

    // Find the order by our internal transaction id (18-char order id) or by row id
    let existingOrder: any = null;
    {
      const { data: byTxn } = await supabase
        .from('orders')
        .select('*')
        .eq('transaction_id', orderId)
        .maybeSingle();
      existingOrder = byTxn;

      if (!existingOrder && /^[0-9a-f-]{36}$/i.test(String(orderId))) {
        const { data: byId } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .maybeSingle();
        existingOrder = byId;
      }
    }

    let orderData: any = null;
    if (!existingOrder) {
      console.error('Order not found for order id:', orderId);
    } else if (existingOrder.status !== 'pending') {
      // Already processed by the thank-you page or a previous webhook delivery
      console.log('Order already processed:', existingOrder.id, existingOrder.status);
      orderStatus = existingOrder.status;
    } else {
      const { data: updated, error: updateError } = await supabase
        .from('orders')
        .update({ status: orderStatus, updated_at: new Date().toISOString() })
        .eq('id', existingOrder.id)
        .eq('status', 'pending')
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Failed to update order:', updateError);
      } else {
        orderData = updated;
        console.log('Order updated successfully:', updated?.id, 'Status:', orderStatus);
      }
    }

    // Log webhook to payment_logs table if it exists
    try {
      await supabase
        .from('payment_logs')
        .insert({
          gateway: 'xpay',
          transaction_id: orderId,
          payload: payload,
          status: orderStatus,
        });
    } catch (e) {
      // payment_logs table might not exist, ignore
      console.log('Could not log to payment_logs:', e);
    }

    // Charge succeeded -> admin push + refund email to the customer
    if (orderStatus === 'cancelled' && orderData) {
      try {
        await supabase.functions.invoke('notify-admin-new-order', {
          body: {
            event_type: 'order_cancelled',
            order_details: {
              order_id: orderData.id,
              package_name: orderData.product_name || 'Package',
              price: orderData.price || 0,
              player_id: orderData.player_id || 'N/A',
              currency_code: orderData.currency_code || 'PKR',
            }
          }
        });
        console.log('Admin notification sent');
      } catch (e) {
        console.error('Failed to send admin notification:', e);
      }

      try {
        const primaryAmount = parseInt(String(orderData.product_amount || '0').split('+')[0], 10) || 0;
        await supabase.functions.invoke('send-order-email', {
          body: {
            userId: orderData.user_id,
            orderId: orderData.id,
            emailType: 'refund',
            orderDetails: {
              packageName: orderData.product_name || 'Package',
              productName: orderData.product_name || 'Package',
              productAmount: orderData.product_amount,
              productType: orderData.product_type || 'pubg_uc',
              ucAmount: primaryAmount,
              price: orderData.price || 0,
              currencyCode: orderData.currency_code || 'PKR',
              playerId: orderData.player_id || '',
              transactionId: orderData.transaction_id,
              paymentMethod: orderData.payment_method || 'card',
              customerEmail: orderData.customer_email,
            },
          }
        });
        console.log('Refund email sent');
      } catch (e) {
        console.error('Failed to send refund email:', e);
      }
    }

    return new Response(
      JSON.stringify({ success: true, status: orderStatus }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
