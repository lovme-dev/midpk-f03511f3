import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';

// ============ notify-admin-new-order ============
export const notifyAdminNewOrder = createServerFn({ method: 'POST' })
  .inputValidator((input: { event_type: string; order_details?: Record<string, any> }) => input)
  .handler(async ({ data }) => {
    const { event_type, order_details } = data;

    if (!event_type) {
      return { error: 'event_type is required' };
    }

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { sendWebPush, buildCurrencyPriceDisplay } = await import('./notifications.server');

    const vapidPublicKey = process.env['VAPID_PUBLIC_KEY'] ?? null;
    const vapidPrivateKey = process.env['VAPID_PRIVATE_KEY'] ?? null;

    const { data: adminRoles, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError) {
      console.error('[NotifyAdminNewOrder] Error fetching admin roles:', rolesError);
      return { error: 'Failed to fetch admins' };
    }

    if (!adminRoles || adminRoles.length === 0) {
      return { success: true, sent: 0, message: 'No admins found' };
    }

    const adminUserIds = adminRoles.map((r) => r.user_id);

    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .in('user_id', adminUserIds);

    if (subError) {
      console.error('[NotifyAdminNewOrder] Error fetching subscriptions:', subError);
      return { error: 'Failed to fetch subscriptions' };
    }

    if (!subscriptions || subscriptions.length === 0) {
      return { success: true, sent: 0, message: 'No admin push subscriptions' };
    }

    const endpointMap = new Map<string, (typeof subscriptions)[0]>();
    for (const sub of subscriptions) {
      const existing = endpointMap.get(sub.endpoint);
      if (!existing || new Date(sub.created_at as string) > new Date(existing.created_at as string)) {
        endpointMap.set(sub.endpoint, sub);
      }
    }
    const uniqueSubscriptions = Array.from(endpointMap.values());

    let title = '';
    let body = '';
    const packageName = order_details?.package_name || order_details?.item_name || 'Unknown Package';
    const price = order_details?.price || 0;
    const playerId = order_details?.player_id || 'N/A';
    const orderId = order_details?.order_id?.slice(0, 8) || '';
    const currencyCode = order_details?.currency_code || 'PKR';
    const priceDisplay = buildCurrencyPriceDisplay(price, currencyCode);

    switch (event_type) {
      case 'new_order':
        title = '🛒 New Order Received!';
        body = `${packageName} - ${priceDisplay} | Player: ${playerId}`;
        break;
      case 'order_cancelled':
        title = '❌ Order Cancelled';
        body = `Customer cancelled: ${packageName} | ${priceDisplay} | Player: ${playerId}`;
        break;
      case 'order_failed':
        title = '⚠️ Payment Failed';
        body = `Payment failed: ${packageName} | ${priceDisplay} | Player: ${playerId}`;
        break;
      case 'order_completed':
        return { success: true, sent: 0, message: 'Completed orders do not trigger push notifications' };
      default:
        title = '📦 Order Update';
        body = `${packageName} - ${event_type}`;
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.error('[NotifyAdminNewOrder] VAPID keys not configured');
      return { error: 'VAPID keys not configured' };
    }

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      url: '/admin?tab=orders',
      tag: `admin-order-${orderId || Date.now()}`,
    });

    let successCount = 0;
    const expiredSubscriptions: string[] = [];

    for (const sub of uniqueSubscriptions) {
      try {
        const response = await sendWebPush(
          sub.endpoint,
          sub.p256dh ?? '',
          sub.auth ?? '',
          payload,
          vapidPublicKey,
          vapidPrivateKey
        );

        if (response.status === 201 || response.status === 200) {
          successCount++;
        } else if (response.status === 404 || response.status === 410 || response.status === 403) {
          expiredSubscriptions.push(sub.id);
        } else {
          const responseText = await response.text();
          console.error('[NotifyAdminNewOrder] Push failed:', response.status, responseText);
        }
      } catch (pushError) {
        console.error('[NotifyAdminNewOrder] Push error:', pushError);
      }
    }

    if (expiredSubscriptions.length > 0) {
      await supabaseAdmin.from('push_subscriptions').delete().in('id', expiredSubscriptions);
    }

    try {
      await supabaseAdmin.from('admin_notification_history').insert({
        event_type,
        title,
        body,
        order_id: order_details?.order_id || null,
        package_name: packageName,
        price: price || null,
        player_id: playerId !== 'N/A' ? playerId : null,
        sent_to_count: successCount,
        total_admins: adminUserIds.length,
        currency_code: currencyCode,
      });
    } catch (logError) {
      console.error('[NotifyAdminNewOrder] Failed to log notification:', logError);
    }

    return {
      success: true,
      sent: successCount,
      total: uniqueSubscriptions.length,
      admins: adminUserIds.length,
      deduplicatedFrom: subscriptions.length,
    };
  });

// ============ get-vapid-public-key ============
export const getVapidPublicKey = createServerFn({ method: 'GET' }).handler(async () => {
  const vapidPublicKey = process.env['VAPID_PUBLIC_KEY'];

  if (!vapidPublicKey) {
    console.error('[VAPID] VAPID_PUBLIC_KEY not configured');
    return { error: 'VAPID public key not configured' };
  }

  return { vapid_public_key: vapidPublicKey };
});

// ============ send-push-notification ============
export const sendPushNotification = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { user_id: string; payload: { title?: string; body?: string; icon?: string; url?: string } }) => input)
  .handler(async ({ data, context }) => {
    const { user_id, payload } = data;

    const { data: isAdmin } = await context.supabase.rpc('has_role', {
      _user_id: context.userId,
      _role: 'admin',
    });

    if (!isAdmin && user_id !== context.userId) {
      return { error: 'Admin access required' };
    }

    if (!user_id || !payload) {
      return { error: 'user_id and payload are required' };
    }

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { sendWebPush } = await import('./notifications.server');

    const vapidPublicKey = process.env['VAPID_PUBLIC_KEY'] ?? null;
    const vapidPrivateKey = process.env['VAPID_PRIVATE_KEY'] ?? null;

    if (!vapidPublicKey || !vapidPrivateKey) {
      return { error: 'VAPID keys not configured' };
    }

    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user_id);

    if (subError || !subscriptions || subscriptions.length === 0) {
      return { message: 'No subscriptions found', sent: 0 };
    }

    const notificationPayload = JSON.stringify({
      title: payload.title || 'Notification',
      body: payload.body || 'You have a new notification',
      icon: payload.icon || '/icon-192.png',
      badge: '/icon-192.png',
      url: payload.url || '/',
    });

    let successCount = 0;

    for (const subscription of subscriptions) {
      try {
        const response = await sendWebPush(
          subscription.endpoint,
          subscription.p256dh ?? '',
          subscription.auth ?? '',
          notificationPayload,
          vapidPublicKey,
          vapidPrivateKey
        );

        if (response.ok || response.status === 201) {
          successCount++;
        } else if (response.status === 410 || response.status === 404) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('id', subscription.id);
        } else {
          console.error(`[Push] Failed to send to ${subscription.id}: ${response.status}`);
        }
      } catch (error) {
        console.error('[Push] Error sending:', error);
      }
    }

    return { success: true, sent: successCount, total: subscriptions.length };
  });

// ============ broadcast-notification ============
export const broadcastNotification = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: {
    title: string;
    message: string;
    type?: string;
    icon_url?: string | null;
    action_url?: string | null;
    admin_id?: string | null;
  }) => input)
  .handler(async ({ data, context }) => {
    const { data: isAdmin } = await context.supabase.rpc('has_role', {
      _user_id: context.userId,
      _role: 'admin',
    });

    if (!isAdmin) {
      return { error: 'Admin access required' };
    }

    const { title, message, type, icon_url, action_url, admin_id } = data;

    if (!title || !message) {
      return { error: 'title and message are required' };
    }

    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { sendWebPush } = await import('./notifications.server');

    const vapidPublicKey = process.env['VAPID_PUBLIC_KEY'] ?? null;
    const vapidPrivateKey = process.env['VAPID_PRIVATE_KEY'] ?? null;

    if (!vapidPublicKey || !vapidPrivateKey) {
      return { error: 'VAPID keys not configured' };
    }

    const { data: notification, error: notifError } = await supabaseAdmin
      .from('notifications')
      .insert({
        title,
        message,
        type: type || 'announcement',
        icon_url: icon_url || null,
        action_url: action_url || null,
      })
      .select()
      .single();

    if (notifError || !notification) {
      console.error('[Broadcast] Error creating notification:', notifError);
      return { error: 'Failed to create notification: ' + (notifError?.message || 'unknown error') };
    }

    const { data: allProfiles, error: profilesError } = await supabaseAdmin.from('profiles').select('user_id');

    if (profilesError) {
      console.error('[Broadcast] Error fetching profiles:', profilesError);
    }

    if (allProfiles && allProfiles.length > 0) {
      const allUserNotifications = allProfiles
        .filter((profile) => !!profile.user_id)
        .map((profile) => ({
          notification_id: notification.id,
          user_id: profile.user_id as string,
          read: false,
          delivered: false,
        }));

      const { error: userNotifError } = await supabaseAdmin.from('user_notifications').insert(allUserNotifications);

      if (userNotifError) {
        console.error('[Broadcast] Error creating user notifications:', userNotifError);
      }
    }

    const { data: subscriptions, error: subError } = await supabaseAdmin.from('push_subscriptions').select('*');

    if (subError) {
      console.error('[Broadcast] Error fetching subscriptions:', subError);
      return {
        success: true,
        notification_id: notification.id,
        message: 'Notification saved to inbox, but error fetching push subscriptions',
        sent: 0,
        total: 0,
        users_in_inbox: allProfiles?.length || 0,
      };
    }

    const notificationPayload = JSON.stringify({
      title,
      body: message,
      icon: icon_url || '/icon-192.png',
      badge: '/icon-192.png',
      url: action_url || '/',
    });

    let successCount = 0;
    const expiredSubscriptions: string[] = [];

    for (const subscription of subscriptions || []) {
      try {
        const response = await sendWebPush(
          subscription.endpoint,
          subscription.p256dh ?? '',
          subscription.auth ?? '',
          notificationPayload,
          vapidPublicKey,
          vapidPrivateKey
        );

        if (response.ok || response.status === 201) {
          successCount++;
          await supabaseAdmin
            .from('user_notifications')
            .update({ delivered: true })
            .eq('notification_id', notification.id)
            .eq('user_id', subscription.user_id);
        } else if (response.status === 410 || response.status === 404 || response.status === 403) {
          expiredSubscriptions.push(subscription.id);
        } else {
          console.error(`[Broadcast] Failed to send to ${subscription.user_id}: ${response.status}`);
        }
      } catch (error) {
        console.error(`[Broadcast] Error sending to ${subscription.user_id}:`, error);
      }
    }

    if (expiredSubscriptions.length > 0) {
      await supabaseAdmin.from('push_subscriptions').delete().in('id', expiredSubscriptions);
    }

    return {
      success: true,
      notification_id: notification.id,
      sent: successCount,
      total: subscriptions?.length || 0,
      users_notified: allProfiles?.length || 0,
      users_in_inbox: allProfiles?.length || 0,
      expired_removed: expiredSubscriptions.length,
    };
  });
