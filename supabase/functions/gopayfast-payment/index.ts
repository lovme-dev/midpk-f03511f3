import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface PaymentRequest {
  amount: number;
  item_name: string;
  email_address: string;
  player_id: string;
  username: string;
  package_id: string;
  user_id: string;
  // Additional fields for non-UUID package scenarios
  product_type?: string;  // e.g. "pubg_uc", "freefire_diamonds", "roblox_robux"
  product_name?: string;  // e.g. "PUBG UC 2000+250"
  product_code?: string;  // e.g. "2250uc", "diamond-001"
  product_amount?: string; // e.g. "2000+250"
}

// Helper to check if a string is a valid UUID
function isValidUUID(str: string): boolean {
  if (!str) return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

// Helper to derive product type from item name
function deriveProductType(itemName: string): string {
  const lowerName = itemName.toLowerCase();
  if (lowerName.includes('pubg') || lowerName.includes('uc')) return 'pubg_uc';
  if (lowerName.includes('free fire') || lowerName.includes('diamond')) return 'freefire_diamonds';
  if (lowerName.includes('roblox') || lowerName.includes('robux')) return 'roblox_robux';
  if (lowerName.includes('valorant') || lowerName.includes('vp')) return 'valorant_vp';
  if (lowerName.includes('car')) return 'pubg_car';
  return 'game_currency';
}

// Helper to derive product amount from item name
function deriveProductAmount(itemName: string): string {
  // Try to extract numbers from the item name
  const matches = itemName.match(/\d+/g);
  if (matches && matches.length >= 1) {
    if (matches.length >= 2) {
      return `${matches[0]}+${matches[1]}`;
    }
    return matches[0];
  }
  return '';
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const merchantId = Deno.env.get("GOPAYFAST_MERCHANT_ID");
    const securedKey = Deno.env.get("GOPAYFAST_SECURED_KEY");

    if (!merchantId || !securedKey) {
      console.error("Missing GoPayFast credentials");
      return new Response(
        JSON.stringify({ success: false, error: "Payment gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: PaymentRequest = await req.json();
    const { 
      amount, 
      item_name, 
      email_address, 
      player_id, 
      username, 
      package_id, 
      user_id,
      product_type,
      product_name,
      product_code,
      product_amount
    } = body;

    console.log("GoPayFast Payment Request:", { 
      amount, 
      item_name, 
      player_id, 
      package_id, 
      user_id,
      product_type,
      product_name 
    });

    // Validate required fields
    if (!amount || amount <= 0) {
      console.error("Invalid amount:", amount);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid payment amount" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!player_id || player_id.trim().length === 0) {
      console.error("Missing player_id");
      return new Response(
        JSON.stringify({ success: false, error: "Player ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!email_address || !email_address.includes('@')) {
      console.error("Invalid email:", email_address);
      return new Response(
        JSON.stringify({ success: false, error: "Valid email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!user_id || user_id.trim().length === 0) {
      console.error("Missing user_id");
      return new Response(
        JSON.stringify({ success: false, error: "User ID is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate unique basket ID
    const basketId = `MIDAS-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const transAmount = String(amount);
    const currencyCode = "PKR";

    // Step 1 (IPG1): Get Access Token
    const tokenApiUrl = "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/GetAccessToken";
    const tokenParams = new URLSearchParams({
      MERCHANT_ID: merchantId,
      SECURED_KEY: securedKey,
      BASKET_ID: basketId,
      TXNAMT: transAmount,
      CURRENCY_CODE: currencyCode,
    });

    console.log("Requesting access token from:", tokenApiUrl);

    const tokenResponse = await fetch(tokenApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Midasbuy/1.0",
      },
      body: tokenParams.toString(),
    });

    const tokenText = await tokenResponse.text();
    console.log("Token API raw response:", tokenText);

    let tokenData;
    try {
      tokenData = JSON.parse(tokenText);
    } catch (e) {
      console.error("Failed to parse token response:", e);
      return new Response(
        JSON.stringify({ success: false, error: "Invalid response from payment gateway" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const accessToken = tokenData.ACCESS_TOKEN;

    if (!accessToken) {
      console.error("No access token in response:", tokenData);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to get payment token", details: tokenData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Access token obtained successfully");

    // Step 2 (IPG2): Build form data for POST transaction
    // The frontend will submit this form to GoPayFast checkout page
    const postTransactionUrl = "https://ipg1.apps.net.pk/Ecommerce/api/Transaction/PostTransaction";
    
    const orderDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const successUrl = "https://www.middasbuy.com/payment/success";
    const failureUrl = "https://www.middasbuy.com/payment/failed";
    const checkoutUrl = "https://www.middasbuy.com/checkout";

    // Return form data for frontend to submit
    const formData = {
      CURRENCY_CODE: currencyCode,
      MERCHANT_ID: merchantId,
      MERCHANT_NAME: "Midasbuy",
      TOKEN: accessToken,
      BASKET_ID: basketId,
      TXNAMT: transAmount,
      ORDER_DATE: orderDate,
      SUCCESS_URL: successUrl,
      FAILURE_URL: failureUrl,
      CHECKOUT_URL: checkoutUrl,
      CUSTOMER_EMAIL_ADDRESS: email_address,
      CUSTOMER_MOBILE_NO: "",
      SIGNATURE: `MIDAS-${Date.now()}`,
      VERSION: "MIDASBUY-1.0",
      TXNDESC: `${item_name} - Player: ${player_id} (${username})`,
      PROCCODE: "00",
      TRAN_TYPE: "ECOMM_PURCHASE",
      MERCHANT_USERAGENT: "Mozilla/5.0 (compatible; Midasbuy/1.0)",
      "ITEMS[0][SKU]": package_id,
      "ITEMS[0][NAME]": item_name,
      "ITEMS[0][PRICE]": transAmount,
      "ITEMS[0][QTY]": "1",
    };

    console.log("Payment form data prepared:", { basketId, amount: transAmount });

    // Create order in database with pending status
    // Always create order - user_id is now required
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // Determine if package_id is a valid UUID
      const packageIdForDb = isValidUUID(package_id) ? package_id : null;
      
      // Derive product info from parameters or item_name
      const finalProductType = product_type || deriveProductType(item_name);
      const finalProductName = product_name || item_name;
      const finalProductCode = product_code || package_id;
      const finalProductAmount = product_amount || deriveProductAmount(item_name);

      console.log('Creating order with:', {
        user_id,
        package_id: packageIdForDb,
        product_type: finalProductType,
        product_name: finalProductName,
        product_code: finalProductCode,
      });

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user_id,
          package_id: packageIdForDb,
          price: parseFloat(transAmount),
          currency_code: 'PKR', // GoPayFast is PKR only
          player_id: player_id,
          status: 'pending',
          payment_method: 'gopayfast',
          transaction_id: basketId,
          product_type: finalProductType,
          product_name: finalProductName,
          product_code: finalProductCode,
          product_amount: finalProductAmount,
        })
        .select()
        .single();

      if (orderError) {
        console.error('Failed to create order:', orderError);
        // Don't fail the payment - continue even if order creation fails
        // The IPN will still update based on transaction_id
      } else {
        console.log('Order created successfully:', orderData?.id);
        // Don't send push notification for new/pending orders
        // Admins will only be notified when order is cancelled or payment fails
      }
    } catch (e) {
      console.error('Error creating order:', e);
      // Continue with payment even if order creation fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        post_url: postTransactionUrl,
        form_data: formData,
        basket_id: basketId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("GoPayFast payment error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Payment initialization failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
