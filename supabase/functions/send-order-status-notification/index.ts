import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============ Crypto helpers ============
function base64UrlToUint8Array(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = (4 - (base64.length % 4)) % 4;
  const padded = base64 + '='.repeat(pad);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function uint8ArrayToBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateVapidJWT(endpoint: string, vapidPrivateKey: string, vapidPublicKey: string): Promise<string> {
  const origin = new URL(endpoint).origin;
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 12 * 60 * 60;

  const header = { alg: 'ES256', typ: 'JWT' };
  const payload = { aud: origin, exp, sub: 'mailto:support@midasbuy.com' };

  const enc = new TextEncoder();
  const headerB64 = uint8ArrayToBase64Url(enc.encode(JSON.stringify(header)));
  const payloadB64 = uint8ArrayToBase64Url(enc.encode(JSON.stringify(payload)));
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Parse public key to get x and y coordinates
  const publicKeyBytes = base64UrlToUint8Array(vapidPublicKey);
  
  // Import key using JWK format (more compatible)
  const key = await crypto.subtle.importKey(
    'jwk',
    {
      kty: 'EC',
      crv: 'P-256',
      d: vapidPrivateKey,
      x: uint8ArrayToBase64Url(publicKeyBytes.slice(1, 33)),
      y: uint8ArrayToBase64Url(publicKeyBytes.slice(33, 65)),
    },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );

  const sig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(unsignedToken));

  const r = new Uint8Array(sig).slice(0, 32);
  const s = new Uint8Array(sig).slice(32, 64);
  const sigBytes = new Uint8Array([...r, ...s]);
  return `${unsignedToken}.${uint8ArrayToBase64Url(sigBytes)}`;
}

async function hkdf(salt: Uint8Array, ikm: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', ikm, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const prk = new Uint8Array(await crypto.subtle.sign('HMAC', key, salt.length ? salt : new Uint8Array(32)));
  const prkKey = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);

  let t = new Uint8Array(0);
  let okm = new Uint8Array(0);
  for (let i = 1; okm.length < length; i++) {
    const input = new Uint8Array([...t, ...info, i]);
    t = new Uint8Array(await crypto.subtle.sign('HMAC', prkKey, input));
    okm = new Uint8Array([...okm, ...t]);
  }
  return okm.slice(0, length);
}

async function encryptPayload(
  payload: string,
  subscriberPublicKey: Uint8Array,
  subscriberAuth: Uint8Array
): Promise<{ encrypted: Uint8Array; salt: Uint8Array; serverPublicKey: Uint8Array }> {
  const serverKeyPair = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, true, ['deriveBits']);
  const serverPublicKeyRaw = new Uint8Array(await crypto.subtle.exportKey('raw', serverKeyPair.publicKey));

  const clientPubKey = await crypto.subtle.importKey('raw', subscriberPublicKey, { name: 'ECDH', namedCurve: 'P-256' }, false, []);
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: clientPubKey }, serverKeyPair.privateKey, 256));

  const enc = new TextEncoder();
  const authInfo = new Uint8Array([...enc.encode('WebPush: info\0'), ...subscriberPublicKey, ...serverPublicKeyRaw]);
  const ikm = await hkdf(subscriberAuth, sharedSecret, authInfo, 32);

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyInfo = enc.encode('Content-Encoding: aes128gcm\0');
  const nonceInfo = enc.encode('Content-Encoding: nonce\0');
  const contentKey = await hkdf(salt, ikm, keyInfo, 16);
  const nonce = await hkdf(salt, ikm, nonceInfo, 12);

  const aesKey = await crypto.subtle.importKey('raw', contentKey, 'AES-GCM', false, ['encrypt']);
  const payloadBytes = enc.encode(payload);
  const padded = new Uint8Array([...payloadBytes, 2]);

  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce }, aesKey, padded));

  const recordSize = new Uint8Array(4);
  new DataView(recordSize.buffer).setUint32(0, padded.length + 16, false);

  const header = new Uint8Array([...salt, ...recordSize, 65, ...serverPublicKeyRaw]);
  return { encrypted: new Uint8Array([...header, ...ciphertext]), salt, serverPublicKey: serverPublicKeyRaw };
}

// ============ Status message helpers ============
function getStatusNotificationContent(status: string, orderDetails: any): { title: string; body: string; icon: string } {
  const packageName = orderDetails.packageName || 'Your order';
  const orderId = orderDetails.orderId?.slice(0, 8) || '';
  
  switch (status) {
    case 'completed':
      return {
        title: '✅ Order Completed!',
        body: `${packageName} has been delivered to your account. Order #${orderId}`,
        icon: '/icons/icon-192x192.png'
      };
    case 'paid':
      return {
        title: '💳 Payment Received!',
        body: `Payment confirmed for ${packageName}. Processing your order... #${orderId}`,
        icon: '/icons/icon-192x192.png'
      };
    case 'pending':
      return {
        title: '⏳ Order Pending',
        body: `${packageName} is awaiting payment. Complete your purchase! #${orderId}`,
        icon: '/icons/icon-192x192.png'
      };
    case 'failed':
      return {
        title: '❌ Payment Failed',
        body: `Payment for ${packageName} was not completed. Please try again. #${orderId}`,
        icon: '/icons/icon-192x192.png'
      };
    case 'cancelled':
      return {
        title: '🚫 Order Cancelled',
        body: `Your order for ${packageName} has been cancelled. #${orderId}`,
        icon: '/icons/icon-192x192.png'
      };
    case 'refunded':
      return {
        title: '💰 Refund Processed',
        body: `Refund for ${packageName} has been initiated. #${orderId}`,
        icon: '/icons/icon-192x192.png'
      };
    default:
      return {
        title: '📦 Order Update',
        body: `Your order ${packageName} status: ${status}. #${orderId}`,
        icon: '/icons/icon-192x192.png'
      };
  }
}

// ============ Main handler ============
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { user_id, order_id, new_status, order_details } = await req.json();
    
    console.log('[OrderStatusNotification] Request:', { user_id, order_id, new_status });

    if (!user_id || !new_status) {
      return new Response(JSON.stringify({ error: 'user_id and new_status are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!;
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch user's push subscriptions
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', user_id);

    if (subError) {
      console.error('[OrderStatusNotification] Error fetching subscriptions:', subError);
      return new Response(JSON.stringify({ error: 'Failed to fetch subscriptions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[OrderStatusNotification] No push subscriptions for user:', user_id);
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No push subscriptions' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const notificationContent = getStatusNotificationContent(new_status, {
      packageName: order_details?.packageName,
      orderId: order_id,
    });

    const payload = JSON.stringify({
      title: notificationContent.title,
      body: notificationContent.body,
      icon: notificationContent.icon,
      url: '/profile', // Navigate to profile/orders when clicked
      tag: `order-${order_id}`,
    });

    let successCount = 0;
    const expiredSubscriptions: string[] = [];

    for (const sub of subscriptions) {
      try {
        const p256dhBytes = base64UrlToUint8Array(sub.p256dh);
        const authBytes = base64UrlToUint8Array(sub.auth);
        const { encrypted } = await encryptPayload(payload, p256dhBytes, authBytes);

        const jwt = await generateVapidJWT(sub.endpoint, vapidPrivateKey, vapidPublicKey);

        const response = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Encoding': 'aes128gcm',
            'TTL': '86400',
            'Authorization': `vapid t=${jwt}, k=${vapidPublicKey}`,
          },
          body: encrypted,
        });

        console.log('[OrderStatusNotification] Push response:', response.status);

        if (response.status === 201) {
          successCount++;
        } else if (response.status === 404 || response.status === 410 || response.status === 403) {
          console.log('[OrderStatusNotification] Subscription expired/invalid, marking for deletion');
          expiredSubscriptions.push(sub.id);
        }
      } catch (pushError) {
        console.error('[OrderStatusNotification] Push error:', pushError);
      }
    }

    // Clean up expired subscriptions
    if (expiredSubscriptions.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('id', expiredSubscriptions);
      console.log('[OrderStatusNotification] Cleaned up expired subscriptions:', expiredSubscriptions.length);
    }

    console.log('[OrderStatusNotification] Sent successfully:', successCount);

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successCount, 
      total: subscriptions.length 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[OrderStatusNotification] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
