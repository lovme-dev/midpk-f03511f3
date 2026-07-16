import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supported cryptocurrencies with their networks
const SUPPORTED_CRYPTOS = [
  { symbol: 'USDT', name: 'Tether USDT', networks: ['TRC20', 'ERC20', 'BEP20'], icon: '💵' },
  { symbol: 'BTC', name: 'Bitcoin', networks: ['BTC'], icon: '₿' },
  { symbol: 'ETH', name: 'Ethereum', networks: ['ETH', 'ERC20'], icon: 'Ξ' },
  { symbol: 'BNB', name: 'Binance Coin', networks: ['BEP20', 'BNB'], icon: '🔶' },
  { symbol: 'LTC', name: 'Litecoin', networks: ['LTC'], icon: 'Ł' },
  { symbol: 'XRP', name: 'XRP', networks: ['XRP'], icon: '✕' },
  { symbol: 'DOGE', name: 'Dogecoin', networks: ['DOGE'], icon: '🐕' },
  { symbol: 'TRX', name: 'TRON', networks: ['TRC20'], icon: '⟁' },
  { symbol: 'SOL', name: 'Solana', networks: ['SOL'], icon: '◎' },
  { symbol: 'ADA', name: 'Cardano', networks: ['ADA'], icon: '₳' },
  { symbol: 'LINK', name: 'Chainlink', networks: ['ERC20'], icon: '🔗' },
  { symbol: 'NEO', name: 'NEO', networks: ['NEO'], icon: '🟢' },
];

async function createSignature(queryString: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(queryString);
  const secretData = encoder.encode(secret);
  
  const key = await crypto.subtle.importKey(
    'raw',
    secretData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, data);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, coin, network, orderId, amount } = await req.json();

    // Sanitize API credentials - remove ALL whitespace (spaces, newlines, tabs)
    const rawApiKey = Deno.env.get('BINANCE_API_KEY') || '';
    const rawSecret = Deno.env.get('BINANCE_SECRET') || '';
    
    // Remove all whitespace characters and surrounding quotes
    const binanceApiKey = rawApiKey.replace(/[\s'"]+/g, '');
    const binanceSecret = rawSecret.replace(/[\s'"]+/g, '');

    // Diagnostic info (safe - no actual values exposed)
    const keyDiagnostics = {
      rawLength: rawApiKey.length,
      sanitizedLength: binanceApiKey.length,
      hasInternalWhitespace: /\s/.test(rawApiKey),
      hasQuotes: /['"]/.test(rawApiKey),
      keyPrefix: binanceApiKey.slice(0, 6),
      keySuffix: binanceApiKey.slice(-4),
      expectedLength: 64, // Binance API keys are typically 64 chars
      isValidLength: binanceApiKey.length === 64
    };

    const secretDiagnostics = {
      rawLength: rawSecret.length,
      sanitizedLength: binanceSecret.length,
      hasInternalWhitespace: /\s/.test(rawSecret),
      hasQuotes: /['"]/.test(rawSecret),
      expectedLength: 64,
      isValidLength: binanceSecret.length === 64
    };

    console.log('API Key Diagnostics:', keyDiagnostics);
    console.log('Secret Diagnostics:', secretDiagnostics);

    if (!binanceApiKey || !binanceSecret) {
      throw new Error('Binance credentials not configured');
    }

    // Action: Diagnose credentials (returns safe info only)
    if (action === 'diagnose') {
      return new Response(
        JSON.stringify({
          success: true,
          diagnostics: {
            apiKey: keyDiagnostics,
            secret: secretDiagnostics,
            recommendations: [
              !keyDiagnostics.isValidLength ? `API Key length is ${keyDiagnostics.sanitizedLength}, expected 64` : null,
              !secretDiagnostics.isValidLength ? `Secret length is ${secretDiagnostics.sanitizedLength}, expected 64` : null,
              keyDiagnostics.hasInternalWhitespace ? 'API Key contains whitespace - this was auto-removed' : null,
              secretDiagnostics.hasInternalWhitespace ? 'Secret contains whitespace - this was auto-removed' : null,
            ].filter(Boolean)
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Get supported cryptocurrencies
    if (action === 'get_cryptos') {
      return new Response(
        JSON.stringify({
          success: true,
          cryptos: SUPPORTED_CRYPTOS
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Get current price for a cryptocurrency
    if (action === 'get_price') {
      const symbol = coin === 'USDT' ? 'BTCUSDT' : `${coin}USDT`;
      
      try {
        const priceResponse = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        const priceData = await priceResponse.json();
        
        let priceInUsdt = 1; // Default for USDT
        if (coin !== 'USDT') {
          priceInUsdt = parseFloat(priceData.price);
        }
        
        return new Response(
          JSON.stringify({
            success: true,
            coin,
            priceInUsdt,
            timestamp: Date.now()
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Price fetch error:', error);
        throw new Error(`Failed to fetch price for ${coin}`);
      }
    }

    // Action: Generate deposit address
    if (action === 'get_deposit_address') {
      if (!coin || !network) {
        throw new Error('Coin and network are required');
      }

      const timestamp = Date.now();
      const recvWindow = 5000;

      const coinNormalized = String(coin).trim().toUpperCase();
      const networkNormalized = String(network).trim().toUpperCase().replace(/\s+/g, "");

      // Binance expects chain codes (e.g. TRX/ETH/BSC) rather than UI labels (TRC20/ERC20/BEP20)
      const networkAliases: Record<string, string> = {
        TRC20: "TRX",
        ERC20: "ETH",
        BEP20: "BSC",
        BEP2: "BNB",
      };
      const networkForBinance = networkAliases[networkNormalized] || networkNormalized;

      // Build query parameters
      const params = new URLSearchParams({
        coin: coinNormalized,
        network: networkForBinance,
        timestamp: timestamp.toString(),
        recvWindow: recvWindow.toString(),
      });

      const queryString = params.toString();
      const signature = await createSignature(queryString, binanceSecret);

      console.log("Requesting deposit address:", {
        coin: coinNormalized,
        network: networkNormalized,
        networkForBinance,
        timestamp,
      });

      const response = await fetch(
        `https://api.binance.com/sapi/v1/capital/deposit/address?${queryString}&signature=${signature}`,
        {
          method: "GET",
          headers: {
            "X-MBX-APIKEY": binanceApiKey,
          },
        }
      );

      const result = await response.json();
      console.log("Binance deposit address response:", result);

      if (result.code && result.code !== 200) {
        // Enhanced error message for common Binance errors
        let userFriendlyError = result.msg || "Failed to get deposit address";
        if (result.code === -4018) {
          userFriendlyError = `Binance says this coin/network is not available. Try another network. (coin=${coinNormalized}, network=${networkNormalized} → ${networkForBinance})`;
        } else if (result.code === -2008) {
          userFriendlyError = `Invalid API Key. Key length: ${binanceApiKey.length} (expected 64). Please verify your Binance API key is copied correctly without spaces or line breaks.`;
        } else if (result.code === -2015) {
          userFriendlyError = "Invalid API key, IP, or permissions. Check your Binance API settings.";
        } else if (result.code === -1022) {
          userFriendlyError = "Signature error. Secret key may be incorrect or contain extra characters.";
        }
        throw new Error(userFriendlyError);
      }

      // Generate QR code URL (using a QR code API)
      const qrContent = result.address;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrContent)}`;

      return new Response(
        JSON.stringify({
          success: true,
          address: result.address,
          tag: result.tag || "",
          coin: result.coin,
          network: result.network || networkForBinance,
          qrCodeUrl,
          orderId,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action: Check deposit status
    if (action === 'check_deposit') {
      if (!coin || !amount || !orderId) {
        throw new Error('Coin, amount, and orderId are required');
      }

      const timestamp = Date.now();
      const startTime = timestamp - (60 * 60 * 1000); // Last hour
      const recvWindow = 5000;

      const params = new URLSearchParams({
        coin: coin,
        status: '1', // 1 = success
        startTime: startTime.toString(),
        endTime: timestamp.toString(),
        limit: '50',
        timestamp: timestamp.toString(),
        recvWindow: recvWindow.toString()
      });

      const queryString = params.toString();
      const signature = await createSignature(queryString, binanceSecret);

      const response = await fetch(
        `https://api.binance.com/sapi/v1/capital/deposit/hisrec?${queryString}&signature=${signature}`,
        {
          method: 'GET',
          headers: {
            'X-MBX-APIKEY': binanceApiKey,
          }
        }
      );

      const deposits = await response.json();
      console.log('Deposit history response:', deposits);

      if (Array.isArray(deposits)) {
        // Look for matching deposit (within 5% tolerance for amount)
        const expectedAmount = parseFloat(amount);
        const tolerance = expectedAmount * 0.05;
        
        const matchingDeposit = deposits.find((deposit: any) => {
          const depositAmount = parseFloat(deposit.amount);
          return (
            deposit.coin === coin &&
            Math.abs(depositAmount - expectedAmount) <= tolerance
          );
        });

        if (matchingDeposit) {
          return new Response(
            JSON.stringify({
              success: true,
              confirmed: true,
              deposit: {
                txId: matchingDeposit.txId,
                amount: matchingDeposit.amount,
                coin: matchingDeposit.coin,
                network: matchingDeposit.network,
                confirmTime: matchingDeposit.insertTime
              }
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          confirmed: false,
          message: 'No matching deposit found yet'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in binance-crypto-deposit function:', error);
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
