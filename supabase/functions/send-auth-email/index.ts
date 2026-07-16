import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AuthEmailRequest {
  to: string;
  type: 'welcome' | 'verification' | 'reset' | 'otp';
  data: {
    name?: string;
    otp?: string;
    resetLink?: string;
    verificationLink?: string;
  };
}

const getEmailWrapper = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #060d1b; font-family: 'Segoe UI', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #060d1b; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
          <!-- Logo Header -->
          <tr>
            <td align="center" style="padding: 30px 0 20px;">
              <div style="font-size: 28px; font-weight: 800; letter-spacing: 1px;">
                <span style="color: #00c6ff;">Midas</span><span style="color: #0072ff;">buy</span>
              </div>
            </td>
          </tr>
          <!-- Main Card -->
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0c1a2e 0%, #0a1629 100%); border: 1px solid rgba(0, 198, 255, 0.15); border-radius: 16px; overflow: hidden;">
                <!-- Gradient Top Bar -->
                <tr>
                  <td style="height: 4px; background: linear-gradient(90deg, #00c6ff, #0072ff);"></td>
                </tr>
                <!-- Content -->
                <tr>
                  <td style="padding: 40px 35px;">
                    ${content}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 25px 0; text-align: center;">
              <p style="color: #4a5568; font-size: 12px; margin: 0 0 8px;">
                © ${new Date().getFullYear()} Midasbuy. All rights reserved.
              </p>
              <p style="color: #4a5568; font-size: 11px; margin: 0;">
                This is an automated email. Please do not reply.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, type, data }: AuthEmailRequest = await req.json();

    let subject = '';
    let content = '';

    switch (type) {
      case 'welcome':
        subject = '🎮 Welcome to Midasbuy!';
        content = `
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="width: 64px; height: 64px; margin: 0 auto 15px; border-radius: 50%; background: linear-gradient(135deg, #00c6ff, #0072ff); display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 30px;">🎉</span>
            </div>
            <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px; font-weight: 700;">Welcome to Midasbuy!</h1>
            <p style="color: #8899aa; font-size: 14px; margin: 0;">Your gaming journey starts here</p>
          </div>
          <p style="color: #c0cdd8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Hi <strong style="color: #fff;">${data.name || 'Gamer'}</strong>,
          </p>
          <p style="color: #c0cdd8; font-size: 15px; line-height: 1.6; margin: 0 0 25px;">
            Your account has been created successfully! You can now purchase UC for PUBG Mobile and other gaming items at the best prices.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://www.middasbuy.com" style="display: inline-block; background: linear-gradient(135deg, #00c6ff, #0072ff); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px;">Start Shopping</a>
          </div>
        `;
        break;
      
      case 'verification':
        subject = '✉️ Verify your email — Midasbuy';
        content = `
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="width: 64px; height: 64px; margin: 0 auto 15px; border-radius: 50%; background: linear-gradient(135deg, #00c6ff, #0072ff); display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 30px;">✉️</span>
            </div>
            <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px; font-weight: 700;">Verify Your Email</h1>
          </div>
          <p style="color: #c0cdd8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Hi <strong style="color: #fff;">${data.name || 'there'}</strong>,
          </p>
          <p style="color: #c0cdd8; font-size: 15px; line-height: 1.6; margin: 0 0 25px;">
            Please verify your email address by clicking the button below:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.verificationLink}" style="display: inline-block; background: linear-gradient(135deg, #00c6ff, #0072ff); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px;">Verify Email</a>
          </div>
          <p style="color: #6b7a8a; font-size: 13px; text-align: center; margin: 20px 0 0;">
            If you didn't create an account, you can safely ignore this email.
          </p>
        `;
        break;
      
      case 'reset':
        subject = '🔐 Password Reset — Midasbuy';
        content = `
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="width: 64px; height: 64px; margin: 0 auto 15px; border-radius: 50%; background: linear-gradient(135deg, #00c6ff, #0072ff); display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 30px;">🔐</span>
            </div>
            <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px; font-weight: 700;">Reset Your Password</h1>
            <p style="color: #8899aa; font-size: 14px; margin: 0;">We received a password reset request</p>
          </div>
          <p style="color: #c0cdd8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Hi <strong style="color: #fff;">${data.name || 'there'}</strong>,
          </p>
          <p style="color: #c0cdd8; font-size: 15px; line-height: 1.6; margin: 0 0 25px;">
            You recently requested to reset your password. Click the button below to create a new password:
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${data.resetLink}" style="display: inline-block; background: linear-gradient(135deg, #00c6ff, #0072ff); color: #ffffff; padding: 14px 40px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; letter-spacing: 0.5px;">Reset Password</a>
          </div>
          <div style="background: rgba(0, 198, 255, 0.05); border: 1px solid rgba(0, 198, 255, 0.1); border-radius: 10px; padding: 15px; margin: 20px 0;">
            <p style="color: #8899aa; font-size: 13px; margin: 0; text-align: center;">
              ⏳ This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
          </div>
        `;
        break;
      
      case 'otp':
        subject = '🔑 Your Verification Code — Midasbuy';
        content = `
          <div style="text-align: center; margin-bottom: 25px;">
            <div style="width: 64px; height: 64px; margin: 0 auto 15px; border-radius: 50%; background: linear-gradient(135deg, #00c6ff, #0072ff); display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 30px;">🔑</span>
            </div>
            <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 8px; font-weight: 700;">Verification Code</h1>
          </div>
          <p style="color: #c0cdd8; font-size: 15px; line-height: 1.6; margin: 0 0 20px;">
            Hi <strong style="color: #fff;">${data.name || 'there'}</strong>,
          </p>
          <p style="color: #c0cdd8; font-size: 15px; line-height: 1.6; margin: 0 0 25px;">
            Your verification code is:
          </p>
          <div style="text-align: center; margin: 25px 0;">
            <div style="display: inline-block; background: rgba(0, 198, 255, 0.08); border: 2px solid rgba(0, 198, 255, 0.3); border-radius: 12px; padding: 20px 40px;">
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 10px; color: #00c6ff; font-family: 'Courier New', monospace;">${data.otp}</span>
            </div>
          </div>
          <div style="background: rgba(0, 198, 255, 0.05); border: 1px solid rgba(0, 198, 255, 0.1); border-radius: 10px; padding: 15px; margin: 20px 0;">
            <p style="color: #8899aa; font-size: 13px; margin: 0; text-align: center;">
              ⏳ This code will expire in 10 minutes. Do not share it with anyone.
            </p>
          </div>
        `;
        break;
    }

    const html = getEmailWrapper(content);

    const emailResponse = await resend.emails.send({
      from: "Midasbuy <midassbuy@outlook.com>",
      to: [to],
      subject,
      html,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-auth-email function:", error);
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
