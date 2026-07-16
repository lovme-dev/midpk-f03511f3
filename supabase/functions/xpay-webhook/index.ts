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
    
    if (receivedSignature) {
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
    } else {
      console.log('No signature header found - processing anyway for staging');
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

    // Extract payment details from webhook
    const orderId = payload.order_id || payload.metadata?.order_id;
    const paymentStatus = payload.status?.toLowerCase();
    const paymentIntentId = payload.id || payload.payment_intent_id;

    console.log('Processing payment:', { orderId, paymentStatus, paymentIntentId });

    if (!orderId) {
      console.error('No order_id in webhook payload');
      return new Response(
        JSON.stringify({ error: 'Missing order_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Map XPay status to our status
    let orderStatus = 'pending';
    if (paymentStatus === 'succeeded' || paymentStatus === 'completed' || paymentStatus === 'paid') {
      orderStatus = 'completed';
    } else if (paymentStatus === 'failed' || paymentStatus === 'canceled' || paymentStatus === 'cancelled') {
      orderStatus = 'failed';
    } else if (paymentStatus === 'processing') {
      orderStatus = 'processing';
    }

    // Update order in database
    const { data: orderData, error: updateError } = await supabase
      .from('orders')
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('transaction_id', orderId)
      .select()
      .single();

    if (updateError) {
      console.error('Failed to update order:', updateError);
      // Try to find order by alternative methods
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('*')
        .eq('transaction_id', orderId)
        .single();
      
      if (!existingOrder) {
        console.error('Order not found for transaction_id:', orderId);
      }
    } else {
      console.log('Order updated successfully:', orderData?.id, 'Status:', orderStatus);
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

    // If payment completed, trigger admin notification
    if (orderStatus === 'completed' && orderData) {
      try {
        await supabase.functions.invoke('notify-admin-new-order', {
          body: {
            event_type: 'new_order',
            order_details: {
              order_id: orderData.id,
              package_name: orderData.product_name,
              price: orderData.price,
              player_id: orderData.player_id,
              currency_code: orderData.currency_code || 'PKR',
            }
          }
        });
        console.log('Admin notification sent');
      } catch (e) {
        console.error('Failed to send admin notification:', e);
      }

      // Send confirmation email
      try {
        await supabase.functions.invoke('send-order-email', {
          body: {
            orderId: orderData.id,
            email: payload.customer?.email,
            packageName: orderData.product_name,
            amount: orderData.price,
          }
        });
        console.log('Confirmation email sent');
      } catch (e) {
        console.error('Failed to send confirmation email:', e);
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
