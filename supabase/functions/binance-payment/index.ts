import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, orderId, productName, currency = 'USD' } = await req.json();

    console.log('Binance Payment Request:', { amount, orderId, productName, currency });

    const binanceApiKey = Deno.env.get('BINANCE_API_KEY');
    const binanceSecret = Deno.env.get('BINANCE_SECRET');

    if (!binanceApiKey || !binanceSecret) {
      throw new Error('Binance credentials not configured');
    }

    // Create Binance payment order
    const timestamp = Date.now();
    // Generate 32-character nonce with a-z and A-Z only (Binance requirement)
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nonce = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    const params = {
      env: {
        terminalType: 'WEB'
      },
      merchantTradeNo: orderId,
      orderAmount: amount.toFixed(2),
      currency: currency,
      goods: {
        goodsType: '01', // Virtual goods
        goodsCategory: 'Z000', // Gaming
        referenceGoodsId: orderId,
        goodsName: productName
      }
    };

    // Create signature - payload format: timestamp + "\n" + nonce + "\n" + body + "\n"
    const body = JSON.stringify(params);
    const payload = timestamp + '\n' + nonce + '\n' + body + '\n';
    
    console.log('Signature Payload Info:', {
      timestamp,
      nonce,
      bodyLength: body.length,
      payloadLength: payload.length
    });
    
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const secretData = encoder.encode(binanceSecret);
    
    const key = await crypto.subtle.importKey(
      'raw',
      secretData,
      { name: 'HMAC', hash: 'SHA-512' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', key, data);
    const signatureHex = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    console.log('Request Headers:', {
      timestamp: timestamp.toString(),
      nonce: nonce,
      apiKey: binanceApiKey?.substring(0, 10) + '...',
      signatureLength: signatureHex.length
    });

    // Call Binance Pay API
    const response = await fetch('https://bpay.binanceapi.com/binancepay/openapi/v2/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'BinancePay-Timestamp': timestamp.toString(),
        'BinancePay-Nonce': nonce,
        'BinancePay-Certificate-SN': binanceApiKey,
        'BinancePay-Signature': signatureHex.toUpperCase(),
      },
      body: body,
    });

    const result = await response.json();
    console.log('Binance API Response:', result);

    if (result.status === 'SUCCESS') {
      return new Response(
        JSON.stringify({
          success: true,
          checkoutUrl: result.data.checkoutUrl,
          qrcodeLink: result.data.qrcodeLink,
          orderId: result.data.prepayId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error(result.message || 'Binance payment failed');
    }

  } catch (error) {
    console.error('Error in binance-payment function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
