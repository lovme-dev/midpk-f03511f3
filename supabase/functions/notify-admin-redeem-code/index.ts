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

  const publicKeyBytes = base64UrlToUint8Array(vapidPublicKey);
  
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

async function hkdf(
  salt: Uint8Array,
  ikm: Uint8Array,
  info: Uint8Array,
  length: number
): Promise<Uint8Array> {
  const saltKeyBytes = salt.length > 0 ? salt : new Uint8Array(32);
  const saltKey = await crypto.subtle.importKey(
    'raw',
    saltKeyBytes.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const prk = new Uint8Array(await crypto.subtle.sign('HMAC', saltKey, ikm.buffer as ArrayBuffer));

  const prkKey = await crypto.subtle.importKey(
    'raw',
    prk.buffer as ArrayBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const hashLen = 32;
  const n = Math.ceil(length / hashLen);
  let t = new Uint8Array(0);
  const okm = new Uint8Array(n * hashLen);

  for (let i = 0; i < n; i++) {
    const input = new Uint8Array(t.length + info.length + 1);
    input.set(t, 0);
    input.set(info, t.length);
    input[input.length - 1] = i + 1;

    t = new Uint8Array(await crypto.subtle.sign('HMAC', prkKey, input.buffer as ArrayBuffer));
    okm.set(t, i * hashLen);
  }

  return okm.slice(0, length);
}

async function encryptPayload(
  payload: string,
  subscriberPublicKey: Uint8Array,
  subscriberAuth: Uint8Array
): Promise<{ encrypted: Uint8Array; salt: Uint8Array; serverPublicKey: Uint8Array }> {
  const serverKeyPair = await crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveBits']
  );

  const serverPublicKeyRaw = await crypto.subtle.exportKey('raw', serverKeyPair.publicKey);
  const serverPublicKey = new Uint8Array(serverPublicKeyRaw);

  const subscriberKey = await crypto.subtle.importKey(
    'raw',
    subscriberPublicKey.buffer as ArrayBuffer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    []
  );

  const sharedSecret = new Uint8Array(
    await crypto.subtle.deriveBits({ name: 'ECDH', public: subscriberKey }, serverKeyPair.privateKey, 256)
  );

  const salt = crypto.getRandomValues(new Uint8Array(16));

  const enc = new TextEncoder();
  const webPushInfo = enc.encode('WebPush: info\0');
  const keyInfo = new Uint8Array(webPushInfo.length + subscriberPublicKey.length + serverPublicKey.length);
  keyInfo.set(webPushInfo, 0);
  keyInfo.set(subscriberPublicKey, webPushInfo.length);
  keyInfo.set(serverPublicKey, webPushInfo.length + subscriberPublicKey.length);

  const ikm = await hkdf(subscriberAuth, sharedSecret, keyInfo, 32);

  const cekInfo = enc.encode('Content-Encoding: aes128gcm\0');
  const contentEncryptionKey = await hkdf(salt, ikm, cekInfo, 16);

  const nonceInfo = enc.encode('Content-Encoding: nonce\0');
  const nonce = await hkdf(salt, ikm, nonceInfo, 12);

  const payloadBytes = enc.encode(payload);
  const paddedPayload = new Uint8Array(payloadBytes.length + 1);
  paddedPayload.set(payloadBytes);
  paddedPayload[payloadBytes.length] = 2;

  const aesKey = await crypto.subtle.importKey(
    'raw',
    contentEncryptionKey.buffer as ArrayBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt']
  );

  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce.buffer as ArrayBuffer }, aesKey, paddedPayload.buffer as ArrayBuffer)
  );

  const recordSize = 4096;
  const encrypted = new Uint8Array(16 + 4 + 1 + serverPublicKey.length + ciphertext.length);
  let offset = 0;

  encrypted.set(salt, offset);
  offset += 16;

  encrypted[offset++] = (recordSize >>> 24) & 0xff;
  encrypted[offset++] = (recordSize >>> 16) & 0xff;
  encrypted[offset++] = (recordSize >>> 8) & 0xff;
  encrypted[offset++] = recordSize & 0xff;

  encrypted[offset++] = serverPublicKey.length;
  encrypted.set(serverPublicKey, offset);
  offset += serverPublicKey.length;

  encrypted.set(ciphertext, offset);

  return { encrypted, salt, serverPublicKey };
}

// ============ Main handler ============
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { redeem_code, player_id, username } = await req.json();
    
    console.log('[NotifyAdminRedeemCode] Request:', { redeem_code, player_id, username });

    if (!redeem_code || !player_id) {
      return new Response(JSON.stringify({ error: 'redeem_code and player_id are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')!;
    const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if this exact code already has a notification sent (duplicate prevention)
    const trimmedCode = redeem_code.trim();
    const { data: existingCodes, error: existingError } = await supabase
      .from('redeem_codes')
      .select('id, created_at')
      .eq('redeem_code', trimmedCode)
      .order('created_at', { ascending: true });

    if (existingError) {
      console.error('[NotifyAdminRedeemCode] Error checking existing codes:', existingError);
    }

    // If more than one record exists for this code, it's a duplicate - skip notification
    if (existingCodes && existingCodes.length > 1) {
      console.log('[NotifyAdminRedeemCode] Duplicate code detected, skipping notification for:', trimmedCode);
      return new Response(JSON.stringify({ 
        success: true, 
        sent: 0, 
        message: 'Duplicate code - notification already sent for this code',
        duplicate: true
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get all admin user IDs
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin');

    if (rolesError) {
      console.error('[NotifyAdminRedeemCode] Error fetching admin roles:', rolesError);
      return new Response(JSON.stringify({ error: 'Failed to fetch admins' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!adminRoles || adminRoles.length === 0) {
      console.log('[NotifyAdminRedeemCode] No admins found');
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No admins found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminUserIds = adminRoles.map(r => r.user_id);
    console.log('[NotifyAdminRedeemCode] Admin user IDs:', adminUserIds);

    // Fetch push subscriptions for all admin users
    const { data: subscriptions, error: subError } = await supabase
      .from('push_subscriptions')
      .select('*')
      .in('user_id', adminUserIds);

    if (subError) {
      console.error('[NotifyAdminRedeemCode] Error fetching subscriptions:', subError);
      return new Response(JSON.stringify({ error: 'Failed to fetch subscriptions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log('[NotifyAdminRedeemCode] No push subscriptions for admins');
      return new Response(JSON.stringify({ success: true, sent: 0, message: 'No admin push subscriptions' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // De-duplicate subscriptions by endpoint (not by user!)
    // An admin may have multiple devices (Android + iOS + Desktop) - send to ALL of them
    const endpointMap = new Map<string, typeof subscriptions[0]>();
    for (const sub of subscriptions) {
      const existing = endpointMap.get(sub.endpoint);
      if (!existing || new Date(sub.created_at) > new Date(existing.created_at)) {
        endpointMap.set(sub.endpoint, sub);
      }
    }
    const uniqueSubscriptions = Array.from(endpointMap.values());
    console.log('[NotifyAdminRedeemCode] Unique endpoints:', uniqueSubscriptions.length, 'from total:', subscriptions.length);

    // Build professional notification content
    const title = '🎁 1 Code Received!';
    const body = `Code: ${redeem_code} | Player ID: ${player_id}${username ? ` | ${username}` : ''}`;

    const payload = JSON.stringify({
      title,
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      url: '/admin/redeem-codes',
      tag: `admin-redeem-${Date.now()}`,
    });

    let successCount = 0;
    const expiredSubscriptions: string[] = [];

    for (const sub of uniqueSubscriptions) {
      try {
        const p256dhBytes = base64UrlToUint8Array(sub.p256dh);
        const authBytes = base64UrlToUint8Array(sub.auth);
        const { encrypted } = await encryptPayload(payload, p256dhBytes, authBytes);

        const jwt = await generateVapidJWT(sub.endpoint, vapidPrivateKey, vapidPublicKey);

        const body = encrypted.buffer.slice(
          encrypted.byteOffset,
          encrypted.byteOffset + encrypted.byteLength
        ) as ArrayBuffer;

        const response = await fetch(sub.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Encoding': 'aes128gcm',
            'Content-Length': encrypted.length.toString(),
            'TTL': '86400',
            'Authorization': `vapid t=${jwt}, k=${vapidPublicKey}`,
          },
          body,
        });

        console.log('[NotifyAdminRedeemCode] Push response:', response.status, 'for admin:', sub.user_id);

        if (response.status === 201 || response.status === 200) {
          successCount++;
        } else if (response.status === 404 || response.status === 410 || response.status === 403) {
          console.log('[NotifyAdminRedeemCode] Subscription expired/invalid, marking for deletion');
          expiredSubscriptions.push(sub.id);
        } else {
          const responseText = await response.text();
          console.error('[NotifyAdminRedeemCode] Push failed:', response.status, responseText);
        }
      } catch (pushError) {
        console.error('[NotifyAdminRedeemCode] Push error:', pushError);
      }
    }

    // Clean up expired subscriptions
    if (expiredSubscriptions.length > 0) {
      await supabase
        .from('push_subscriptions')
        .delete()
        .in('id', expiredSubscriptions);
      console.log('[NotifyAdminRedeemCode] Cleaned up expired subscriptions:', expiredSubscriptions.length);
    }

    console.log('[NotifyAdminRedeemCode] Sent successfully to', successCount, 'admin devices');

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successCount, 
      total: uniqueSubscriptions.length,
      admins: adminUserIds.length,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[NotifyAdminRedeemCode] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
