import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function toFixedAmount(amount: unknown): string {
  const num = typeof amount === 'number' ? amount : parseFloat(String(amount));
  return num.toFixed(2);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { 
      status: 405, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let body: any = {};
    
    if (contentType.includes("application/json")) {
      body = await req.json();
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      formData.forEach((v, k) => (body[k] = v));
    } else {
      const text = await req.text();
      try {
        const params = new URLSearchParams(text);
        params.forEach((v, k) => (body[k] = v));
      } catch (_) {}
    }

    const amount = body.amount;
    const order_id = body.order_id || body.m_payment_id;
    const product_name = body.product_name || body.item_name || "PUBG UC";
    const email_address = body.email || body.email_address || "customer@example.com";

    if (!amount || !order_id) {
      return new Response(JSON.stringify({ error: "Missing required fields: amount, order_id" }), { 
        status: 400, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // Get credentials from environment
    const merchant_id = Deno.env.get('GOPAYFAST_MERCHANT_ID');
    const merchant_key = Deno.env.get('GOPAYFAST_MERCHANT_KEY');
    const base_url = 'https://ipg1.apps.net.pk';

    console.log('GoPayFast credentials check:', {
      merchant_id: merchant_id ? `present (${merchant_id})` : 'missing',
      merchant_key: merchant_key ? `present (${merchant_key.substring(0, 5)}***)` : 'missing',
      base_url,
      all_env_vars: Object.keys(Deno.env.toObject()).filter(k => k.includes('GOPAYFAST'))
    });

    if (!merchant_id || !merchant_key) {
      console.error('GoPayFast credentials missing', {
        merchant_id_exists: !!merchant_id,
        merchant_key_exists: !!merchant_key,
        available_env_vars: Object.keys(Deno.env.toObject()).filter(k => k.includes('GOPAYFAST'))
      });
      return new Response(
        JSON.stringify({ 
          error: 'Server misconfiguration: GoPayFast credentials missing',
          debug: {
            merchant_id_exists: !!merchant_id,
            merchant_key_exists: !!merchant_key,
            available_gopayfast_vars: Object.keys(Deno.env.toObject()).filter(k => k.includes('GOPAYFAST'))
          }
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const origin = req.headers.get('origin') || new URL(req.url).origin;
    const return_url = body.return_url || `${origin}/payment-success`;
    const cancel_url = body.cancel_url || `${origin}/payment-canceled`;
    const notify_url = body.notify_url || `https://xphijmjxpgkwhtysmcxb.supabase.co/functions/v1/gopayfast-ipn`;

// Step 1: Get Access Token
const tokenEndpoint = `${base_url}/Ecommerce/api/Transaction/GetAccessToken`;

console.log('Getting access token from:', tokenEndpoint);
console.log('Using credentials:', { merchant_id, merchant_key: merchant_key ? 'present' : 'missing' });

let accessToken: string | null = null;
let lastTokenResponse: any = null;

// Try different formats based on GoPayFast API documentation
const attempts = [
  // Format 1: Direct JSON with exact field names
  {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ MerchantId: merchant_id, MerchantKey: merchant_key })
  },
  // Format 2: Try with different field casing
  {
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ merchantId: merchant_id, merchantKey: merchant_key })
  },
  // Format 3: Form URL encoded
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: new URLSearchParams({ MerchantId: merchant_id, MerchantKey: merchant_key }).toString()
  },
  // Format 4: Form with lowercase
  {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json' },
    body: new URLSearchParams({ merchantId: merchant_id, merchantKey: merchant_key }).toString()
  }
];

for (let i = 0; i < attempts.length; i++) {
  const attempt = attempts[i];
  console.log(`Token attempt ${i + 1}:`, { headers: attempt.headers, bodyType: typeof attempt.body });
  
  try {
    const tokenRes = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: attempt.headers,
      body: attempt.body
    });

    const tokenText = await tokenRes.text();
    console.log(`Token response ${i + 1}:`, {
      status: tokenRes.status,
      statusText: tokenRes.statusText,
      responsePreview: tokenText.slice(0, 200)
    });

    if (tokenRes.status === 200) {
      try {
        lastTokenResponse = JSON.parse(tokenText);
        accessToken = lastTokenResponse?.access_token || lastTokenResponse?.AccessToken || 
                     lastTokenResponse?.Token || lastTokenResponse?.token ||
                     lastTokenResponse?.data?.access_token || lastTokenResponse?.data?.AccessToken;
        
        if (accessToken) {
          console.log(`Access token obtained on attempt ${i + 1}`);
          break;
        }
      } catch (parseError) {
        console.log(`Parse error on attempt ${i + 1}:`, parseError);
      }
    }
    
    lastTokenResponse = tokenText;
  } catch (fetchError) {
    console.log(`Fetch error on attempt ${i + 1}:`, fetchError);
  }
}

if (!accessToken) {
  console.error('Failed to get access token after all attempts', { 
    lastTokenResponse, 
    credentialsCheck: { 
      merchant_id: merchant_id ? 'present' : 'missing', 
      merchant_key: merchant_key ? 'present' : 'missing' 
    }
  });
  return new Response(
    JSON.stringify({ 
      error: 'Failed to get access token from GoPayFast', 
      details: lastTokenResponse,
      endpoint: tokenEndpoint,
      merchant_id_check: merchant_id ? 'present' : 'missing'
    }),
    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

    // Step 2: Post Transaction
    const transactionEndpoint = `${base_url}/Ecommerce/api/Transaction/PostTransaction`;
    
    const transactionPayload = {
      Amount: toFixedAmount(amount),
      BasketId: String(order_id),
      OrderDate: new Date().toISOString(),
      CustomerMobileNo: "03001234567",
      CustomerEmailAddress: email_address,
      CustomerName: "Customer",
      CurrencyCode: "PKR",
      MerchantId: merchant_id,
      OrderType: "Service",
      ReturnUrl: return_url,
      CancelUrl: cancel_url,
      CallbackUrl: notify_url,
      Description: product_name
    };

    console.log('Posting transaction to:', transactionEndpoint);

    const transactionRes = await fetch(transactionEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(transactionPayload)
    });

    const transactionText = await transactionRes.text();
    console.log('Transaction response:', {
      status: transactionRes.status,
      statusText: transactionRes.statusText,
      responsePreview: transactionText.slice(0, 300)
    });

    let transactionData: any = null;
    try {
      transactionData = JSON.parse(transactionText);
    } catch (e) {
      console.error('Transaction response parse error:', e);
    }

    // Log payment attempt
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );
      
      await supabase.from('payment_logs').insert({
        payment_id: order_id,
        amount: Number(amount),
        email: email_address,
        item_name: product_name,
        status: transactionData ? 'initiated' : 'error',
        gateway: 'gopayfast',
        gateway_response: transactionData || transactionText || null,
      });
    } catch (e) {
      console.error('Payment logging failed:', e);
    }

// Extract redirect URL
let redirectUrl =
  transactionData?.PaymentUrl || transactionData?.PaymentURL ||
  transactionData?.RedirectUrl || transactionData?.RedirectURL ||
  transactionData?.CheckoutUrl || transactionData?.checkout_url ||
  transactionData?.payment_url || transactionData?.redirect_url ||
  transactionData?.data?.PaymentUrl || transactionData?.data?.RedirectUrl ||
  transactionData?.Data?.PaymentUrl || transactionData?.Data?.RedirectUrl;

if (!redirectUrl && transactionText) {
  // Try to find URL in response text
  const urlMatch = transactionText.match(/https?:\/\/[^\s"'<>]+/);
  if (urlMatch) redirectUrl = urlMatch[0];
}

    if (!redirectUrl) {
      console.error('No redirect URL found in response:', transactionData || transactionText);
      return new Response(
        JSON.stringify({
          error: 'Unable to get payment URL from GoPayFast',
          status: transactionRes.status,
          payment_id: String(order_id),
          amount: String(amount),
          details: transactionData || transactionText || null
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment URL obtained:', redirectUrl);

    return new Response(JSON.stringify({ 
      success: true, 
      redirect_url: redirectUrl 
    }), { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });

  } catch (e) {
    console.error('GoPayFast integration error:', e);
    return new Response(JSON.stringify({ error: e.message || 'Internal error' }), { 
      status: 500, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});