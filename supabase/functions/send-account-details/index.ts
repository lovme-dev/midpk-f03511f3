import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { Resend } from "npm:resend@4.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AccountDetailsRequest {
  order_id: string;
  buyer_email: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { order_id, buyer_email }: AccountDetailsRequest = await req.json();

    // Create Supabase client with service role key to access account details
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get order details with account information
    const { data: orderData, error: orderError } = await supabaseService
      .from('pubg_account_orders')
      .select(`
        *,
        pubg_accounts (
          title,
          login_email,
          login_password,
          recovery_info
        )
      `)
      .eq('id', order_id)
      .eq('status', 'completed')
      .single();

    if (orderError || !orderData) {
      throw new Error('Order not found or not completed');
    }

    const account = orderData.pubg_accounts;
    if (!account) {
      throw new Error('Account details not found');
    }

    // Mark account as sold
    await supabaseService
      .from('pubg_accounts')
      .update({ status: 'sold' })
      .eq('id', orderData.account_id);

    // Send email with account details
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0099FF, #0062FF); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Your PUBG Account Details</h1>
        </div>
        
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello!</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Congratulations on your purchase! Here are your PUBG account login details for <strong>${account.title}</strong>:
          </p>
          
          <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Account Login Details</h3>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Email/Username:</strong><br>
              <code style="background: #f1f3f4; padding: 4px 8px; border-radius: 4px;">${account.login_email || 'Not provided'}</code>
            </div>
            
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Password:</strong><br>
              <code style="background: #f1f3f4; padding: 4px 8px; border-radius: 4px;">${account.login_password || 'Not provided'}</code>
            </div>
            
            ${account.recovery_info ? `
            <div style="margin-bottom: 15px;">
              <strong style="color: #333;">Recovery Information:</strong><br>
              <code style="background: #f1f3f4; padding: 4px 8px; border-radius: 4px;">${account.recovery_info}</code>
            </div>
            ` : ''}
          </div>
          
          <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
            <h4 style="color: #856404; margin-top: 0;">⚠️ Important Security Instructions</h4>
            <ul style="color: #856404; margin: 0;">
              <li>Change the password immediately after logging in for security</li>
              <li>Update recovery information to your own details</li>
              <li>Enable two-factor authentication if available</li>
              <li>Keep these details confidential and secure</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any issues accessing the account or need support, please contact our customer service team.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            Thank you for your purchase and enjoy your new PUBG account!
          </p>
          
          <div style="text-align: center; margin-top: 30px;">
            <p style="color: #999; font-size: 14px;">
              Best regards,<br>
              <strong>MidasBuy Team</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: "MidasBuy <no-reply@midasbuy.com>",
      to: [buyer_email],
      subject: "Your Purchased PUBG Account Details",
      html: emailContent,
    });

    console.log("Account details email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Account details sent successfully",
        email_id: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-account-details function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send account details" 
      }),
      {
        status: 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
});