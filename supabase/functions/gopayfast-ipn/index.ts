import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    let payload: any = {};

    if (contentType.includes('application/json')) {
      payload = await req.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData();
      form.forEach((v, k) => (payload[k] = v));
    } else if (req.method === 'GET') {
      const url = new URL(req.url);
      url.searchParams.forEach((v, k) => (payload[k] = v));
    } else {
      const text = await req.text();
      try { new URLSearchParams(text).forEach((v, k) => (payload[k] = v)); } catch (_) {}
    }

    console.log('GoPayFast IPN received:', payload);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get transaction details from payload
    const basketId = payload?.BASKET_ID || payload?.basket_id || payload?.m_payment_id || '';
    const errCode = payload?.err_code || payload?.ERR_CODE || '';
    const paymentStatus = payload?.payment_status || payload?.status || '';
    
    // Determine order status based on response
    let orderStatus = 'pending';
    if (errCode === '000' || paymentStatus?.toLowerCase() === 'success' || paymentStatus?.toLowerCase() === 'completed') {
      orderStatus = 'completed';
    } else if (errCode && errCode !== '000') {
      orderStatus = 'failed';
    }

    console.log('Processing order update:', { basketId, errCode, orderStatus });

    // Update order status if we have a basket_id
    if (basketId) {
      const { data: orderData, error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: orderStatus,
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', basketId)
        .select()
        .single();

      if (updateError) {
        console.error('Failed to update order:', updateError);
      } else {
        console.log('Order updated successfully:', orderData?.id, orderStatus);
        
        // Only notify admins for failed orders (not pending or completed)
        // Completed orders don't need notification, pending orders are just waiting
        // Cancelled orders are handled by PaymentSuccessPage
        if (orderData && orderStatus === 'failed') {
          try {
            await supabase.functions.invoke('notify-admin-new-order', {
              body: {
                event_type: 'order_failed',
                order_details: {
                  order_id: orderData.id,
                  package_name: orderData.product_name || 'Package',
                  price: orderData.price,
                  player_id: orderData.player_id,
                  payment_method: orderData.payment_method || 'gopayfast',
                  currency_code: orderData.currency_code || 'PKR',
                  status: orderStatus,
                },
              },
            });
            console.log('Admin notification sent for order_failed:', orderData.id);
          } catch (notifyError) {
            console.error('Failed to notify admins:', notifyError);
          }
        }
        
        // Send confirmation email if payment successful
        if (orderStatus === 'completed' && orderData?.user_id) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('email, full_name')
              .eq('user_id', orderData.user_id)
              .maybeSingle();

            if (profile?.email) {
              await supabase.functions.invoke('send-order-email', {
                body: {
                  userId: orderData.user_id,
                  orderId: orderData.id,
                  emailType: 'confirmation',
                  orderDetails: {
                    packageName: orderData.product_name || 'UC Package',
                    ucAmount: 0,
                    price: orderData.price,
                    paymentMethod: 'GoPayFast',
                    playerId: orderData.player_id,
                    transactionId: basketId,
                  },
                },
              });
              console.log('Confirmation email triggered for order:', orderData.id);
            }
          } catch (emailError) {
            console.error('Failed to send confirmation email:', emailError);
          }
        }
      }
    }

    // Log IPN for debugging
    await supabase.from('payment_logs').insert({
      payment_id: basketId || `ipn_${Date.now()}`,
      status: orderStatus,
      gateway: 'gopayfast',
      gateway_response: payload,
    }).catch(e => console.error('IPN log failed', e));

    return new Response('OK', { status: 200, headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
  } catch (e) {
    console.error('gopayfast-ipn error:', e);
    return new Response('ERR', { status: 500, headers: { ...corsHeaders, 'Content-Type': 'text/plain' } });
  }
});
