import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayProPaymentRequest {
  amount: number;
  item_name: string;
  email_address: string;
  player_id: string;
  username: string;
  package_id: string;
  user_id: string;
  product_type?: string;
  product_name?: string;
  product_amount?: string;
  return_base_url?: string;
  currency?: string;
  currency_amount?: number;
  is_converted?: boolean;
  customer_name?: string;
}

// Sanitize customer name - PayPro only accepts alphabets and spaces
function sanitizeCustomerName(name: string): string {
  const sanitized = name.replace(/[^a-zA-Z ]/g, "").trim();
  return sanitized.length > 0 ? sanitized : "Midas Customer";
}

// Helper function to format date as dd/MM/yyyy per PayPro API v2 spec
function formatDateDDMMYYYY(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// PayPro API v2 Production URL
const PAYPRO_BASE_URL = "https://api.paypro.com.pk";

// Authenticate with PayPro API v2 - PRODUCTION
// Per official docs: POST to /v2/ppro/auth with { clientid, clientsecret }
// Token is returned in response HEADERS (not body)
async function authenticatePayPro(clientId: string, clientSecret: string): Promise<{ success: boolean; token?: string; error?: string }> {
  console.log("=== PayPro Auth: Starting authentication ===");
  console.log(`Endpoint: ${PAYPRO_BASE_URL}/v2/ppro/auth`);
  console.log(`ClientID: ${clientId.substring(0, 4)}... (len: ${clientId.trim().length})`);
  console.log(`ClientSecret: ${clientSecret.substring(0, 4)}... (len: ${clientSecret.trim().length})`);
  
  try {
    const authBody = {
      clientid: clientId.trim(),
      clientsecret: clientSecret.trim(),
    };
    
    console.log("Auth request body:", JSON.stringify({ clientid: authBody.clientid.substring(0, 4) + "...", clientsecret: "***" }));
    
    const response = await fetch(`${PAYPRO_BASE_URL}/v2/ppro/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(authBody),
    });
    
    console.log(`Auth response status: ${response.status}`);
    
    // Per PayPro docs: Token is in response HEADERS
    const tokenFromHeader = response.headers.get("Token") || response.headers.get("token");
    const tokenExpiry = response.headers.get("TokenExpiry") || response.headers.get("tokenexpiry");
    
    // Log all response headers for debugging
    const headerEntries: string[] = [];
    response.headers.forEach((value, key) => {
      headerEntries.push(`${key}: ${value.substring(0, 50)}...`);
    });
    console.log("Response headers:", headerEntries.join(" | "));
    
    if (tokenFromHeader) {
      console.log(`SUCCESS: Token received from headers (expiry: ${tokenExpiry || 'unknown'})`);
      return { success: true, token: tokenFromHeader };
    }
    
    // Fallback: check response body
    const responseText = await response.text();
    console.log(`Auth response body (first 200): ${responseText.substring(0, 200)}`);
    
    if (!response.ok) {
      return { 
        success: false, 
        error: `Auth failed with status ${response.status}: ${responseText.substring(0, 100)}` 
      };
    }
    
    // Try to parse body for token (some implementations)
    try {
      const authData = JSON.parse(responseText);
      const token = authData.Token || authData.token || authData.access_token;
      if (token) {
        console.log("SUCCESS: Token received from response body");
        return { success: true, token };
      }
    } catch {
      // Not JSON, continue
    }
    
    return { success: false, error: "No token received from PayPro auth" };
  } catch (error: any) {
    console.error("Auth exception:", error.message);
    return { success: false, error: error.message };
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      amount,
      item_name,
      email_address,
      player_id,
      username,
      package_id,
      user_id,
      product_type = "pubg_uc",
      product_name,
      product_amount,
      return_base_url = "https://www.middasbuy.com",
      currency,
      currency_amount,
      is_converted,
      customer_name,
    }: PayProPaymentRequest = await req.json();

    // Fetch user's real name from profiles table if user_id is provided
    let realCustomerName = customer_name || username;
    
    if (user_id && user_id !== 'guest') {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabaseClient = createClient(supabaseUrl, supabaseKey);
        
        const { data: profileData } = await supabaseClient
          .from("profiles")
          .select("full_name")
          .eq("user_id", user_id)
          .maybeSingle();
        
        if (profileData?.full_name && profileData.full_name.trim()) {
          realCustomerName = profileData.full_name.trim();
          console.log(`Using profile name: "${realCustomerName}" for user ${user_id}`);
        }
      } catch (profileError) {
        console.error("Error fetching profile:", profileError);
      }
    }

    console.log("PayPro Payment Request:", {
      amount,
      item_name,
      email_address,
      player_id,
      package_id,
      product_type,
      return_base_url,
      currency,
      currency_amount,
      is_converted,
    });

    // Get PayPro credentials from environment
    const clientId = Deno.env.get("PAYPRO_CLIENT_ID");
    const clientSecret = Deno.env.get("PAYPRO_CLIENT_SECRET");
    const merchantId = Deno.env.get("PAYPRO_MERCHANT_ID");

    if (!clientId || !clientSecret || !merchantId) {
      console.error("Missing PayPro credentials");
      return new Response(
        JSON.stringify({
          success: false,
          error: "PayPro configuration error - missing credentials",
          step: "config",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 1: Authenticate with PayPro PRODUCTION API
    console.log("Step 1: Authenticating with PayPro PRODUCTION API...");
    const authResult = await authenticatePayPro(clientId, clientSecret);
    
    if (!authResult.success || !authResult.token) {
      console.error("PayPro auth failed:", authResult.error);
      return new Response(
        JSON.stringify({
          success: false,
          error: "PayPro authentication failed",
          step: "auth",
          details: authResult.error,
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const authToken = authResult.token;
    console.log("Step 1 SUCCESS: Authenticated with PayPro");

    // Generate unique order ID
    const orderId = `MIDAS-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Step 2: Create order with PayPro per API v2 spec
    console.log("Step 2: Creating PayPro order...");

    const now = new Date();
    const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

    // Format dates as dd/MM/yyyy per PayPro API v2
    const issueDateFormatted = formatDateDDMMYYYY(now);
    const dueDateFormatted = formatDateDDMMYYYY(dueDate);

    // Build success/failure URLs from the passed base URL
    const successUrl = `${return_base_url}/payment/paypro-return?order=${orderId}&status=success`;
    const failureUrl = `${return_base_url}/payment/paypro-return?order=${orderId}&status=failed`;

    // Sanitize customer name - PayPro only accepts alphabets
    const cleanCustomerName = sanitizeCustomerName(realCustomerName || "Customer");
    console.log(`Sanitized customer name: "${realCustomerName}" -> "${cleanCustomerName}"`);

    const normalizedCurrency = (currency || "").toUpperCase();
    const isUsdOrder = normalizedCurrency === "USD" || is_converted === true;
    const effectiveCurrencyAmount = currency_amount ?? amount;

    if (!Number.isFinite(amount) || amount <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid amount",
          step: "validate_amount",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!Number.isFinite(effectiveCurrencyAmount) || effectiveCurrencyAmount <= 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid currency_amount",
          step: "validate_currency_amount",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const amountStr = amount.toFixed(2);
    const currencyAmountStr = effectiveCurrencyAmount.toFixed(2);

    // PayPro API v2 order payload format (per official documentation):
    // Array with 2 objects: [{ MerchantId }, { OrderDetails }]
    const orderDetails: Record<string, string> = {
      OrderNumber: orderId,
      OrderDueDate: dueDateFormatted,
      OrderType: "Service",
      IssueDate: issueDateFormatted,
      OrderExpireAfterSeconds: "0",
      CustomerName: cleanCustomerName,
      CustomerMobile: "",
      CustomerEmail: email_address,
      CustomerAddress: "",
      Description: item_name,
      SuccessURL: successUrl,
      FailureURL: failureUrl,
    };

    if (isUsdOrder) {
      orderDetails.CurrencyAmount = currencyAmountStr;
      orderDetails.Currency = "USD";
      orderDetails.IsConverted = "true";
    } else {
      orderDetails.OrderAmount = amountStr;
    }

    // PayPro API v2 format: Array with MerchantId object first, then order details
    const orderPayload = [
      {
        MerchantId: merchantId.trim(),
      },
      orderDetails,
    ];

    console.log("Order payload:", JSON.stringify({
      isUsdOrder,
      normalizedCurrency,
      amount: amountStr,
      currencyAmount: currencyAmountStr,
      merchantId: merchantId.substring(0, 4) + "...",
      orderDetails: { ...orderDetails, CustomerEmail: "***" },
    }, null, 2));

    const orderResponse = await fetch(`${PAYPRO_BASE_URL}/v2/ppro/co`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Token": authToken,
      },
      body: JSON.stringify(orderPayload),
    });

    const orderResponseText = await orderResponse.text();
    console.log(`Create order response status: ${orderResponse.status}`);
    console.log(`Create order response body: ${orderResponseText.substring(0, 500)}`);

    if (!orderResponse.ok) {
      console.error("PayPro order creation failed:", orderResponse.status, orderResponseText);
      return new Response(
        JSON.stringify({
          success: false,
          error: `PayPro order creation failed`,
          step: "create_order",
          paypro_status: orderResponse.status,
          paypro_body: orderResponseText.substring(0, 300),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let orderData;
    try {
      orderData = JSON.parse(orderResponseText);
    } catch {
      console.error("Failed to parse PayPro order response as JSON");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid response from PayPro",
          step: "parse_order",
          paypro_body: orderResponseText.substring(0, 300),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("PayPro order response:", JSON.stringify(orderData));

    // PayPro returns array with Status in first object and Click2Pay URL in second
    // Per docs: Response has "Click2Pay" field with checkout URL
    let checkoutUrl: string | null = null;
    let orderResult: any = null;
    
    const urlFields = ["Click2Pay", "click2pay", "CheckoutUrl", "checkoutUrl", "PaymentUrl", "short_Click2Pay"];
    
    // Function to extract checkout URL from an object
    const extractCheckoutUrl = (obj: any): string | null => {
      if (!obj || typeof obj !== 'object') return null;
      for (const field of urlFields) {
        if (obj[field] && typeof obj[field] === 'string') {
          return obj[field];
        }
      }
      return null;
    };
    
    if (Array.isArray(orderData)) {
      // Scan all elements in the array for checkout URL
      for (const element of orderData) {
        const url = extractCheckoutUrl(element);
        if (url) {
          checkoutUrl = url;
          orderResult = element;
          break;
        }
        // Also check for error status
        if (element.Status && element.Status !== "00" && element.Description) {
          console.error("PayPro returned error status:", element);
          return new Response(
            JSON.stringify({
              success: false,
              error: `PayPro error: ${element.Description}`,
              step: "paypro_error",
              paypro_status: element.Status,
            }),
            {
              status: 500,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }
      }
      // If no URL found, use last element as orderResult for error reporting
      if (!orderResult) {
        orderResult = orderData[orderData.length - 1] || orderData[0];
      }
    } else {
      checkoutUrl = extractCheckoutUrl(orderData);
      orderResult = orderData;
    }
    
    console.log("Extracted order result:", JSON.stringify(orderResult).substring(0, 300));
    console.log("Found checkout URL:", checkoutUrl ? "Yes" : "No");
    
    if (!checkoutUrl) {
      console.error("PayPro order missing checkout URL. Full response:", JSON.stringify(orderData));
      return new Response(
        JSON.stringify({
          success: false,
          error: "PayPro order creation failed - no checkout URL returned",
          step: "missing_checkout_url",
          paypro_response: JSON.stringify(orderData).substring(0, 500),
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Step 3: Create order in database with pending status
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store the user's currency - PayPro accepts USD and PKR
    const storedCurrency = isUsdOrder ? "USD" : "PKR";
    
    const { error: dbError } = await supabase.from("orders").insert({
      user_id: user_id,
      player_id: player_id,
      package_id: package_id,
      price: isUsdOrder ? effectiveCurrencyAmount : amount, // Store amount in user's currency
      currency_code: storedCurrency,
      payment_method: "paypro",
      transaction_id: orderResult.OrderNumber || orderId,
      status: "pending",
      product_type: product_type,
      product_name: product_name || item_name,
      product_amount: product_amount,
    });

    if (dbError) {
      console.error("Database error:", dbError);
      // Don't fail the payment, just log the error
    }

    console.log("PayPro payment initiated successfully:", {
      orderId: orderResult.OrderNumber || orderId,
      checkoutUrl: checkoutUrl,
      connectPayId: orderResult.ConnectPayId || orderResult.PayProId,
    });

    return new Response(
      JSON.stringify({
        success: true,
        checkout_url: checkoutUrl,
        order_number: orderResult.OrderNumber || orderId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("PayPro payment error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Payment initialization failed",
        step: "exception",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
