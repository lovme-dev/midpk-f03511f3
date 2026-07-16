import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.177.0/node/crypto.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentRequest {
  amount: number;
  currency: string;
  originalAmount?: number;      // User's original amount in their currency
  originalCurrency?: string;    // User's original currency (USD, RUB, EUR etc.)
  orderId: string;
  customerEmail: string;
  customerName?: string;
  customerPhone?: string;
  productName: string;
  productType: string;
  productAmount?: string;       // Base+bonus amount format (e.g., "10+5")
  playerId?: string;
  packageId?: string;
  successUrl: string;
  cancelUrl: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const XPAY_SECRET_KEY = Deno.env.get("XPAY_SECRET_KEY");
    const XPAY_ACCOUNT_ID = Deno.env.get("XPAY_ACCOUNT_ID");
    const XPAY_API_SIGNATURE_SECRET = Deno.env.get("XPAY_API_SIGNATURE_SECRET");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!XPAY_SECRET_KEY || !XPAY_ACCOUNT_ID || !XPAY_API_SIGNATURE_SECRET) {
      console.error("Missing XPay configuration");
      return new Response(JSON.stringify({ success: false, error: "Payment service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body: PaymentRequest = await req.json();
    console.log("Payment request received:", {
      orderId: body.orderId,
      amount: body.amount,
      currency: body.currency,
      productName: body.productName,
    });

    // Validate required fields
    if (!body.amount || !body.currency || !body.orderId || !body.customerEmail) {
      return new Response(JSON.stringify({ success: false, error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // XPay API base URL (LIVE production)
    const XPAY_API_BASE = "https://xstak-pay.xstak.com";

    // Use a default phone if not provided (XPay requires non-empty phone)
    const customerPhone = body.customerPhone && body.customerPhone.length >= 10 ? body.customerPhone : "03001234567";

    // XPay/Meezan Bank ONLY supports PKR for card processing
    // Convert all currencies to PKR before sending to XPay
    
    // Fallback exchange rates (50+ currencies) - used if API fails
    const fallbackRates: Record<string, number> = {
      PKR: 1,
      // Major currencies
      USD: 280.50, EUR: 305.00, GBP: 355.00, JPY: 1.85, CHF: 315.00,
      // Middle East
      AED: 76.40, SAR: 74.80, KWD: 912.00, QAR: 77.00, OMR: 729.00, BHD: 744.00, JOD: 396.00,
      // South Asia
      INR: 3.35, BDT: 2.55, NPR: 2.10, LKR: 0.87, AFN: 4.05, MVR: 18.20,
      // Southeast Asia
      IDR: 0.018, MYR: 63.00, PHP: 4.90, THB: 8.20, VND: 0.011, SGD: 208.00, MMK: 0.13, KHR: 0.069, LAK: 0.013,
      // East Asia
      CNY: 38.50, HKD: 36.00, TWD: 8.70, KRW: 0.21,
      // Central Asia
      KZT: 0.56, UZS: 0.022, KGS: 3.22, TJS: 25.80,
      // Europe
      RUB: 3.05, TRY: 8.20, PLN: 69.00, CZK: 12.00, HUF: 0.75, RON: 61.00, BGN: 156.00, UAH: 6.80, GEL: 103.00,
      // Africa
      EGP: 5.70, NGN: 0.18, KES: 2.18, ZAR: 15.30, GHS: 17.50, TZS: 0.11, UGX: 0.076, MAD: 28.00, DZD: 2.08, TND: 90.00,
      // Americas
      BRL: 47.50, MXN: 14.00, CAD: 197.00, AUD: 178.00, NZD: 163.00, CLP: 0.29, COP: 0.068, ARS: 0.27, PEN: 75.00, VES: 7.60,
      // Caribbean
      JMD: 1.80, TTD: 41.50, BBD: 140.00, BSD: 280.50, DOP: 4.70, HTG: 2.13,
      // Others
      ILS: 78.00, NOK: 25.50, SEK: 26.00, DKK: 41.00, ISK: 2.05, XOF: 0.47, XAF: 0.47,
    };

    const currency = body.currency.toUpperCase();
    let rate = fallbackRates[currency] || 280.50; // Default to USD rate

    // Try to get live exchange rates from free API (Frankfurter)
    try {
      if (currency !== 'PKR') {
        console.log(`Fetching live exchange rate for ${currency} to PKR...`);
        const liveRateResponse = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=PKR`
        );
        
        if (liveRateResponse.ok) {
          const liveRateData = await liveRateResponse.json();
          if (liveRateData.rates?.PKR) {
            rate = liveRateData.rates.PKR;
            console.log(`Live rate fetched: 1 ${currency} = ${rate} PKR`);
          }
        } else {
          console.log(`Live rate API failed, using fallback rate: ${rate}`);
        }
      }
    } catch (apiError) {
      console.log(`Exchange rate API error, using fallback rate: ${rate}`, apiError);
    }

    const amountInPKR = Math.round(body.amount * rate);

    console.log(`Currency conversion: ${body.amount} ${currency} -> ${amountInPKR} PKR (rate: ${rate})`);

    // Create payment intent payload - XPay only accepts PKR
    const paymentPayload = {
      amount: amountInPKR,
      currency: "PKR", // Always PKR for XPay/Meezan Bank
      customer: {
        email: body.customerEmail,
        name: body.customerName || "Customer",
        phone: customerPhone,
      },
      metadata: {
        product_name: body.productName,
        product_type: body.productType,
        player_id: body.playerId || "",
        package_id: body.packageId || "",
        internal_order_id: body.orderId,
        original_currency: currency,
        original_amount: body.amount,
      },
      success_url: body.successUrl,
    };

    // Create HMAC signature
    const payloadString = JSON.stringify(paymentPayload);
    const hmac = createHmac("sha256", XPAY_API_SIGNATURE_SECRET);
    hmac.update(payloadString);
    const signature = hmac.digest("hex");

    console.log("Creating XPay payment intent...");

    // Call XPay API to create payment intent
    const xpayResponse = await fetch(`${XPAY_API_BASE}/public/v1/payment/intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": XPAY_SECRET_KEY,
        "x-account-id": XPAY_ACCOUNT_ID,
        "x-signature": signature,
      },
      body: payloadString,
    });

    const xpayData = await xpayResponse.json();
    console.log("XPay response:", { status: xpayResponse.status, data: xpayData });

    if (!xpayResponse.ok) {
      console.error("XPay API error:", xpayData);
      return new Response(
        JSON.stringify({
          success: false,
          error: xpayData.message || "Failed to create payment intent",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Initialize Supabase client to store order
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Get user from auth header if available
    const authHeader = req.headers.get("Authorization");
    let userId = null;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: userData } = await supabase.auth.getUser(token);
      userId = userData?.user?.id;
    }

    // Create order in database - store ORIGINAL user currency for Admin Panel display
    // Use originalAmount/originalCurrency if provided, otherwise fallback to request values
    const userOriginalAmount = body.originalAmount || body.amount;
    const userOriginalCurrency = body.originalCurrency || currency;

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId || "00000000-0000-0000-0000-000000000000",
        transaction_id: body.orderId,
        payment_method: "xpay_card",
        status: "pending",
        price: userOriginalAmount,           // Original user amount (e.g., 50 RUB)
        currency_code: userOriginalCurrency, // Original user currency (e.g., "RUB")
        pkr_amount: amountInPKR,             // Actual PKR charged
        exchange_rate: rate,                 // Exchange rate used
        product_name: body.productName,
        product_type: body.productType,
        product_amount: body.productAmount,  // Base+bonus format (e.g., "10+5")
        player_id: body.playerId,
        package_id: body.packageId,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Failed to create order:", orderError);
      // Continue anyway - payment intent was created
    } else {
      console.log("Order created:", orderData?.id);
    }

    // XPay response is nested: { success, data: { pi_client_secret, encryptionKey, ... } }
    const intentData = xpayData.data || xpayData;

    return new Response(
      JSON.stringify({
        success: true,
        clientSecret: intentData.pi_client_secret,
        encryptionKey: intentData.encryptionKey,
        paymentIntentId: intentData._id,
        orderId: body.orderId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("Payment creation error:", error);
    return new Response(JSON.stringify({ success: false, error: error.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
