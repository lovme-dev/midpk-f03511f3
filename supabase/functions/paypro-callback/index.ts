import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PayProCallback {
  username: string;
  password: string;
  csvinvoiceids: string;
}

interface PayProCallbackResponseItem {
  StatusCode: string;
  InvoiceID: string | null;
  Description: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle GET requests for testing/verification
  if (req.method === "GET") {
    return new Response(
      JSON.stringify([{ 
        StatusCode: "00", 
        InvoiceID: null,
        Description: "PayPro callback endpoint is active and ready to receive payment notifications" 
      }]),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    // Get request body text first
    const bodyText = await req.text();
    
    console.log("PayPro callback raw body:", bodyText);
    
    if (!bodyText || bodyText.trim() === "") {
      console.log("Empty request body received");
      return new Response(
        JSON.stringify([{ 
          StatusCode: "02", 
          InvoiceID: null,
          Description: "Empty request body" 
        }]),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let callbackData: PayProCallback;
    try {
      callbackData = JSON.parse(bodyText);
    } catch {
      console.error("Failed to parse callback body as JSON");
      return new Response(
        JSON.stringify([{ 
          StatusCode: "02", 
          InvoiceID: null,
          Description: "Invalid JSON format" 
        }]),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    
    console.log("PayPro callback received:", {
      username: callbackData.username,
      csvinvoiceids: callbackData.csvinvoiceids,
      hasPassword: !!callbackData.password,
    });

    // Validate callback credentials
    const expectedUsername = Deno.env.get("PAYPRO_CALLBACK_USERNAME");
    const expectedPassword = Deno.env.get("PAYPRO_CALLBACK_PASSWORD");

    if (!expectedUsername || !expectedPassword) {
      console.error("Missing PayPro callback credentials in environment");
      return new Response(
        JSON.stringify([{ 
          StatusCode: "99", 
          InvoiceID: null,
          Description: "Configuration error" 
        }]),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate username and password per PayPro API v2 spec
    if (callbackData.username !== expectedUsername || callbackData.password !== expectedPassword) {
      console.error("Invalid PayPro callback credentials");
      // Per PayPro docs: StatusCode "01" = Invalid credentials
      return new Response(
        JSON.stringify([{ 
          StatusCode: "01", 
          InvoiceID: null,
          Description: "Invalid Data. Username or password is invalid" 
        }]),
        {
          status: 200, // PayPro expects 200 even for credential errors
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Extract order IDs from CSV
    const orderIds = callbackData.csvinvoiceids.split(",").map(id => id.trim()).filter(id => id);
    
    if (orderIds.length === 0) {
      console.error("No order IDs provided in callback");
      return new Response(
        JSON.stringify([{ 
          StatusCode: "02", 
          InvoiceID: null,
          Description: "No order IDs provided" 
        }]),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Processing order IDs:", orderIds);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Process each order and build response array per PayPro API v2 spec
    const responseItems: PayProCallbackResponseItem[] = [];

    for (const orderId of orderIds) {
      console.log(`Processing order: ${orderId}`);
      
      // Find order by transaction_id
      const { data: orderData, error: fetchError } = await supabase
        .from("orders")
        .select("*")
        .eq("transaction_id", orderId)
        .maybeSingle();

      if (fetchError) {
        console.error(`Error fetching order ${orderId}:`, fetchError);
        responseItems.push({
          StatusCode: "99",
          InvoiceID: orderId,
          Description: "Database error while fetching order"
        });
        continue;
      }

      if (!orderData) {
        console.error(`Order not found: ${orderId}`);
        // Per PayPro docs: StatusCode "03" = No records found
        responseItems.push({
          StatusCode: "03",
          InvoiceID: orderId,
          Description: "No records found for this invoice"
        });
        continue;
      }

      // Check if already completed
      if (orderData.status === "completed") {
        console.log(`Order ${orderId} already completed`);
        responseItems.push({
          StatusCode: "00",
          InvoiceID: orderId,
          Description: "Invoice already marked as paid"
        });
        continue;
      }

      // Update order status to completed
      const { error: updateError } = await supabase
        .from("orders")
        .update({ 
          status: "completed",
          updated_at: new Date().toISOString()
        })
        .eq("transaction_id", orderId);

      if (updateError) {
        console.error(`Failed to update order ${orderId}:`, updateError);
        responseItems.push({
          StatusCode: "99",
          InvoiceID: orderId,
          Description: "Failed to update order status"
        });
        continue;
      }

      console.log(`Order ${orderId} marked as completed`);
      
      // Per PayPro docs: StatusCode "00" = Success
      responseItems.push({
        StatusCode: "00",
        InvoiceID: orderId,
        Description: "Invoice successfully marked as paid"
      });

      // Send admin notification (non-blocking)
      try {
        const notifyResponse = await fetch(
          `${supabaseUrl}/functions/v1/notify-admin-new-order`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${supabaseKey}`,
            },
            body: JSON.stringify({
              event_type: "new_order",
              order_details: {
                order_id: orderData.id,
                package_name: orderData.product_name || "PUBG UC Package",
                price: orderData.price,
                player_id: orderData.player_id,
                currency_code: orderData.currency_code || 'USD',
              },
            }),
          }
        );

        if (!notifyResponse.ok) {
          console.error("Failed to send admin notification:", await notifyResponse.text());
        } else {
          console.log("Admin notification sent for order:", orderId);
        }
      } catch (notifyError) {
        console.error("Error sending admin notification:", notifyError);
        // Don't fail the callback for notification errors
      }
    }

    const successCount = responseItems.filter(r => r.StatusCode === "00").length;
    const failCount = responseItems.filter(r => r.StatusCode !== "00").length;
    
    console.log(`PayPro callback processed: ${successCount} success, ${failCount} failed`);
    console.log("Response items:", JSON.stringify(responseItems));

    // Return array response per PayPro API v2 spec
    return new Response(
      JSON.stringify(responseItems),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("PayPro callback error:", error);
    return new Response(
      JSON.stringify([{ 
        StatusCode: "99", 
        InvoiceID: null,
        Description: error.message || "Internal server error" 
      }]),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
