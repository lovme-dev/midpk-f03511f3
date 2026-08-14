import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { requireAdmin } from "../_shared/adminAuth.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const denied = await requireAdmin(req, corsHeaders);
  if (denied) return denied;

  try {
    const { to, subject, message } = await req.json();
    if (!to) throw new Error("Missing 'to'");

    const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#0a1628;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0f1a2e,#1a2744);border-radius:16px;padding:32px;color:#e2e8f0;">
        <h1 style="color:#60a5fa;margin:0 0 16px 0;">✅ Midasbuy Test Email</h1>
        <p style="line-height:1.7;font-size:15px;">${message || "This is a test email from Midasbuy Admin Panel. If you received this, your email delivery is working correctly."}</p>
        <p style="margin-top:24px;color:#94a3b8;font-size:13px;">Sent at ${new Date().toISOString()}</p>
      </div></body></html>`;

    const { data, error } = await resend.emails.send({
      from: "Midasbuy <noreply@midasbuy.com.pk>",
      reply_to: "help@midasbuy.com.pk",
      to: [to],
      subject: subject || "Midasbuy Test Email",
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return new Response(JSON.stringify({ success: false, error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ success: false, error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
