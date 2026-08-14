import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';
import type { OrderDetails, EmailCustomizations } from './emails.server';

export const sendOrderEmail = createServerFn({ method: 'POST' })
  .inputValidator((input: {
    userId: string;
    orderId?: string;
    emailType: 'confirmation' | 'refund';
    orderDetails: OrderDetails;
    customizations?: EmailCustomizations;
  }) => input)
  .handler(async ({ data }) => {
    const { userId, orderId, emailType, orderDetails, customizations } = data;
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { getEmailTranslation, getLanguageFromCountry } = await import('./email-translations-server');
    const { Resend } = await import('resend');
    const resend = new Resend(process.env['RESEND_API_KEY']);

    try {
      const translation = getEmailTranslation(orderDetails.countryCode);
      const languageCode = getLanguageFromCountry(orderDetails.countryCode);

      const { data: orderRecord } = orderId
        ? await supabaseAdmin
            .from('orders')
            .select('customer_email, customer_name')
            .eq('id', orderId)
            .maybeSingle()
        : { data: null } as any;

      let userEmail = orderRecord?.customer_email as string | undefined;
      let userName = orderRecord?.customer_name as string | undefined;

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('email, full_name')
        .eq('user_id', userId)
        .maybeSingle();

      if (!userEmail) userEmail = profile?.email as string | undefined;
      if (!userName) userName = (profile?.full_name) as string | undefined;

      if (!userEmail || !userName) {
        const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(userId);
        if (!userEmail) userEmail = authUser?.user?.email ?? undefined;
        if (!userName) {
          const meta: any = authUser?.user?.user_metadata || {};
          userName = meta.full_name || meta.name || (userEmail ? userEmail.split('@')[0] : undefined);
        }
      }

      if (!userEmail) {
        console.error('User email not found for userId:', userId);
        return { error: 'User email not found' };
      }

      userName = userName || 'Valued Customer';

      const productType = detectProductType(orderDetails);
      const config = PRODUCT_CONFIG[productType] || PRODUCT_CONFIG['default'];

      let subject: string;
      let html: string;

      if (emailType === 'confirmation') {
        const subjectTail = productType === 'pubg_shop'
          ? (orderDetails.productName || config.name)
          : `${config.name} ${config.currencyLabel}`;
        subject = customizations?.customSubject || `${translation.confirmTitle} - ${subjectTail} | Midasbuy`;
        html = await getConfirmationEmailHtml(orderDetails, userName, customizations);
      } else {
        subject = customizations?.customSubject || `${translation.refundTitle} - ${config.name} | Midasbuy`;
        html = await getRefundEmailHtml(orderDetails, userName, customizations);
      }

      const emailResponse = await resend.emails.send({
        from: 'Midasbuy <noreply@midasbuy.com.pk>',
        replyTo: 'help@midasbuy.com.pk',
        to: [userEmail],
        subject,
        html,
      });

      if (orderId) {
        const { error: updateError } = await supabaseAdmin
          .from('orders')
          .update({ email_sent_at: new Date().toISOString() })
          .eq('id', orderId);
        if (updateError) console.error('Failed to update email_sent_at:', updateError);
      }

      return { success: true, emailId: emailResponse.data?.id, language: languageCode };
    } catch (error: any) {
      console.error('Error sending order email:', error);
      return { error: error?.message || 'Failed to send order email' };
    }
  });

export const sendOrderStatusNotification = createServerFn({ method: 'POST' })
  .inputValidator((input: {
    user_id: string;
    order_id: string;
    new_status: string;
    order_details?: { packageName?: string };
  }) => input)
  .handler(async ({ data }) => {
    const { user_id, order_id, new_status, order_details } = data;
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { sendWebPush } = await import('./notifications.server');

    if (!user_id || !new_status) {
      return { error: 'user_id and new_status are required' };
    }

    try {
      const vapidPublicKey = process.env['VAPID_PUBLIC_KEY']!;
      const vapidPrivateKey = process.env['VAPID_PRIVATE_KEY']!;

      const { data: subscriptions, error: subError } = await supabaseAdmin
        .from('push_subscriptions')
        .select('*')
        .eq('user_id', user_id);

      if (subError) {
        console.error('[OrderStatusNotification] Error fetching subscriptions:', subError);
        return { error: 'Failed to fetch subscriptions' };
      }

      if (!subscriptions || subscriptions.length === 0) {
        return { success: true, sent: 0, message: 'No push subscriptions' };
      }

      const notificationContent = getStatusNotificationContent(new_status, {
        packageName: order_details?.packageName,
        orderId: order_id,
      });

      const payload = JSON.stringify({
        title: notificationContent.title,
        body: notificationContent.body,
        icon: notificationContent.icon,
        url: '/profile',
        tag: `order-${order_id}`,
      });

      let successCount = 0;
      const expiredSubscriptions: string[] = [];

      for (const sub of subscriptions) {
        try {
          const response = await sendWebPush(sub.endpoint, sub.p256dh ?? '', sub.auth ?? '', payload, vapidPublicKey, vapidPrivateKey);
          if (response.status === 201) {
            successCount++;
          } else if (response.status === 404 || response.status === 410 || response.status === 403) {
            expiredSubscriptions.push(sub.id);
          }
        } catch (pushError) {
          console.error('[OrderStatusNotification] Push error:', pushError);
        }
      }

      if (expiredSubscriptions.length > 0) {
        await supabaseAdmin.from('push_subscriptions').delete().in('id', expiredSubscriptions);
      }

      return { success: true, sent: successCount, total: subscriptions.length };
    } catch (error: any) {
      console.error('[OrderStatusNotification] Error:', error);
      return { error: error?.message || 'Failed to send notification' };
    }
  });

export const sendInquiryReply = createServerFn({ method: 'POST' })
  .inputValidator((input: {
    customerEmail: string;
    customerName: string;
    subject: string;
    emailContent: string;
    orderId?: string;
    templateType: string;
  }) => input)
  .handler(async ({ data }) => {
    const { customerEmail, customerName, subject, emailContent, orderId } = data;
    const { getCallerAuth } = await import('./support.server');
    const { Resend } = await import('resend');
    const resend = new Resend(process.env['RESEND_API_KEY']);

    const request = getRequest();
    const authHeader = request?.headers?.get('authorization') ?? null;
    const auth = await getCallerAuth(authHeader);
    if (!auth.userId) return { error: 'Unauthorized' };
    if (!auth.isAdmin) return { error: 'Admin access required' };

    if (!customerEmail || !subject || !emailContent) {
      return { error: 'Missing required fields: customerEmail, subject, or emailContent' };
    }

    try {
      const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #0a1628;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0f1a2e 0%, #1a2744 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.5);">
    <div style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">Midasbuy Support</h1>
      <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px;">Customer Support Response</p>
    </div>
    <div style="padding: 30px;">
      <p style="color: white; margin: 0 0 20px 0; font-size: 16px;">
        Dear <strong style="color: #60a5fa;">${customerName || 'Valued Customer'}</strong>,
      </p>
      ${orderId ? `
      <div style="background: rgba(59, 130, 246, 0.1); border-radius: 8px; padding: 15px; margin-bottom: 20px; border: 1px solid rgba(59, 130, 246, 0.3);">
        <span style="color: #94a3b8; font-size: 13px;">Order Reference:</span>
        <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 14px; font-family: monospace;">${orderId}</p>
      </div>
      ` : ''}
      <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 25px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,0.1);">
        <div style="color: #e2e8f0; font-size: 15px; line-height: 1.8; white-space: pre-wrap;">${emailContent}</div>
      </div>
      <div style="background: rgba(34, 197, 94, 0.1); border-radius: 12px; padding: 20px; text-align: center; border: 1px solid rgba(34, 197, 94, 0.3);">
        <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">Need further assistance?</p>
        <a href="mailto:help@midasbuy.com.pk" style="color: #22c55e; text-decoration: none; font-size: 16px; font-weight: 600;">help@midasbuy.com.pk</a>
      </div>
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
        <p style="color: #e2e8f0; margin: 0; font-size: 15px;">Best Regards,</p>
        <p style="color: #60a5fa; margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">Midasbuy Support Team</p>
      </div>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 20px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.1);">
      <p style="color: #64748b; margin: 0 0 8px 0; font-size: 12px;">© 2026 Midasbuy. All rights reserved.</p>
      <p style="color: #475569; margin: 0; font-size: 11px;">This email was sent by Midasbuy Customer Support</p>
    </div>
  </div>
</body>
</html>
`;

      const emailResponse = await resend.emails.send({
        from: 'Midasbuy Support <noreply@midasbuy.com.pk>',
        replyTo: 'help@midasbuy.com.pk',
        to: [customerEmail],
        subject: subject,
        html: emailHtml,
      });

      return { success: true, message: 'Email sent successfully', emailId: emailResponse.data?.id };
    } catch (error: any) {
      console.error('Error sending inquiry reply email:', error);
      return { error: error?.message || 'Failed to send inquiry reply' };
    }
  });

export const sendTestEmail = createServerFn({ method: 'POST' })
  .inputValidator((input: { to: string; subject?: string; message?: string }) => input)
  .handler(async ({ data }) => {
    const { to, subject, message } = data;
    const { getCallerAuth } = await import('./support.server');
    const { Resend } = await import('resend');
    const resend = new Resend(process.env['RESEND_API_KEY']);

    const request = getRequest();
    const authHeader = request?.headers?.get('authorization') ?? null;
    const auth = await getCallerAuth(authHeader);
    if (!auth.userId) return { success: false, error: 'Unauthorized' };
    if (!auth.isAdmin) return { success: false, error: 'Admin access required' };

    if (!to) return { success: false, error: "Missing 'to'" };

    try {
      const html = `<!DOCTYPE html><html><body style="font-family:Arial,sans-serif;background:#0a1628;padding:24px;">
      <div style="max-width:600px;margin:0 auto;background:linear-gradient(135deg,#0f1a2e,#1a2744);border-radius:16px;padding:32px;color:#e2e8f0;">
        <h1 style="color:#60a5fa;margin:0 0 16px 0;">✅ Midasbuy Test Email</h1>
        <p style="line-height:1.7;font-size:15px;">${message || 'This is a test email from Midasbuy Admin Panel. If you received this, your email delivery is working correctly.'}</p>
        <p style="margin-top:24px;color:#94a3b8;font-size:13px;">Sent at ${new Date().toISOString()}</p>
      </div></body></html>`;

      const { data: sendData, error } = await resend.emails.send({
        from: 'Midasbuy <noreply@midasbuy.com.pk>',
        replyTo: 'help@midasbuy.com.pk',
        to: [to],
        subject: subject || 'Midasbuy Test Email',
        html,
      });

      if (error) {
        console.error('Resend error:', error);
        return { success: false, error };
      }

      return { success: true, data: sendData };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send test email' };
    }
  });

