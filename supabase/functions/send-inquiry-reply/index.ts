import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InquiryReplyRequest {
  customerEmail: string;
  customerName: string;
  subject: string;
  emailContent: string;
  orderId?: string;
  templateType: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { customerEmail, customerName, subject, emailContent, orderId, templateType }: InquiryReplyRequest = await req.json();

    if (!customerEmail || !subject || !emailContent) {
      throw new Error("Missing required fields: customerEmail, subject, or emailContent");
    }

    console.log(`Sending inquiry reply to: ${customerEmail}, template: ${templateType}`);

    // Build email HTML with Midasbuy branding
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a1628;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f1a2e 0%, #1a2744 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Midasbuy Support</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px;">Customer Support Response</p>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <!-- Greeting -->
      <p style="color: white; margin: 0 0 20px 0; font-size: 16px;">
        Dear <strong style="color: #60a5fa;">${customerName || 'Valued Customer'}</strong>,
      </p>
      
      ${orderId ? `
      <!-- Order Reference -->
      <div style="background: rgba(59, 130, 246, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(59, 130, 246, 0.3);">
        <span style="color: #94a3b8; font-size: 13px;">Order Reference:</span>
        <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${orderId}</p>
      </div>
      ` : ''}
      
      <!-- Main Message -->
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="color: #e2e8f0; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${emailContent}</div>
      </div>
      
      <!-- Contact Info -->
      <div style="background: rgba(34, 197, 94, 0.1); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(34, 197, 94, 0.3);">
        <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">Need further assistance?</p>
        <a href="mailto:help@midasbuy.com.co" style="color: #22c55e; text-decoration: none; font-size: 16px; font-weight: 600;">help@midasbuy.com.co</a>
      </div>
      
      <!-- Sign Off -->
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="color: #e2e8f0; margin: 0; font-size: 15px;">Best Regards,</p>
        <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">Midasbuy Support Team</p>
      </div>
    </div>
    
    <!-- Footer -->
    <div style="background: rgba(0,0,0,0.3); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #64748b; margin: 0 0 8px 0; font-size: 12px;">© 2026 Midasbuy. All rights reserved.</p>
      <p style="color: #475569; margin: 0; font-size: 11px;">This email was sent by Midasbuy Customer Support</p>
    </div>
  </div>
</body>
</html>
`;

    const emailResponse = await resend.emails.send({
      from: "Midasbuy Support <noreply@midasbuy.com.co>",
      to: [customerEmail],
      subject: subject,
      html: emailHtml,
    });

    console.log("Inquiry reply email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", emailId: emailResponse.data?.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending inquiry reply email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
