import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // These are safe to expose to frontend (like Stripe publishable key)
    const publishableKey = Deno.env.get('XPAY_PUBLIC_KEY');
    const accountId = Deno.env.get('XPAY_ACCOUNT_ID');
    const hmacSecret = Deno.env.get('XPAY_API_SIGNATURE_SECRET');

    if (!publishableKey || !accountId || !hmacSecret) {
      console.error('Missing XPay configuration');
      return new Response(
        JSON.stringify({ success: false, error: 'Payment service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('[XPay Config] Returning config for frontend');

    return new Response(
      JSON.stringify({
        success: true,
        publishableKey,
        accountId,
        hmacSecret,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('XPay config error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
