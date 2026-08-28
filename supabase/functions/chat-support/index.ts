import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, includeVision, userName } = await req.json();
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch all relevant data from database
    const [
      { data: packages },
      { data: blogs },
    ] = await Promise.all([
      supabase.from('uc_packages').select('*').order('price'),
      supabase.from('blogs').select('title, excerpt, slug').eq('published', true).limit(10),
    ]);

    // Build comprehensive package data context
    const packageInfo = packages?.map(p => 
      `${p.name}: ${p.uc_amount} UC - PKR ${p.price}${p.popular ? ' (POPULAR)' : ''}${p.discount_percentage ? ` (${p.discount_percentage}% OFF)` : ''}`
    ).join('\n') || 'No packages available';

    const blogInfo = blogs?.map(b => 
      `${b.title} - ${b.excerpt}`
    ).join('\n') || 'No blogs available';

    // Detect user language
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const detectLanguage = (text: string) => {
      if (/[\u0600-\u06FF]/.test(text)) return 'urdu';
      if (/[\u4e00-\u9fff]/.test(text)) return 'chinese';
      if (/[\u3040-\u309f\u30a0-\u30ff]/.test(text)) return 'japanese';
      if (/[\uac00-\ud7af]/.test(text)) return 'korean';
      if (/[\u0400-\u04FF]/.test(text)) return 'russian';
      if (/[ñáéíóúü]/i.test(text)) return 'spanish';
      if (/[àâäçéèêëïîôöùûüÿ]/i.test(text)) return 'french';
      if (/[äöüß]/i.test(text)) return 'german';
      return 'english';
    };

    const userLanguage = detectLanguage(lastUserMessage);
    
    // User greeting based on logged in status
    const userGreeting = userName ? `The user's name is "${userName}". Use their name naturally in conversation to make it personal and friendly.` : 'The user is not logged in.';

    // Build dynamic system prompt with fresh data
    const PRICE_TABLE = [
      "1107 UC + 921 bonus (2028 total) — PKR 3,420 (was PKR 3,800, -10%)",
      "2250 UC + 1558 bonus (3808 total) — PKR 7,980 (was PKR 9,068, -12%)",
      "3600 UC + 2302 bonus (5902 total) — PKR 11,732 (was PKR 13,642, -14%)",
      "5760 UC + 2734 bonus (8494 total) — PKR 15,390 (was PKR 18,321, -16%)",
      "7488 UC + 3129 bonus (10617 total) — PKR 17,812 (was PKR 21,722, -18%)",
      "9216 UC + 3525 bonus (12741 total) — PKR 20,995 (was PKR 26,244, -20%)",
      "10944 UC + 3920 bonus (14864 total) — PKR 24,462 (was PKR 31,362, -22%)",
      "12672 UC + 4311 bonus (16983 total) — PKR 27,312 (was PKR 35,470, -23%)",
      "14400 UC + 4706 bonus (19106 total) — PKR 31,208 (was PKR 41,611, -25%)",
      "16128 UC + 5101 bonus (21229 total) — PKR 34,105 (was PKR 46,088, -26%)",
      "17856 UC + 5496 bonus (23352 total) — PKR 37,762 (was PKR 52,447, -28%)",
      "19584 UC + 5892 bonus (25476 total) — PKR 41,325 (was PKR 58,204, -29%)",
      "21312 UC + 6282 bonus (27594 total) — PKR 44,888 (was PKR 64,126, -30%)",
      "23040 UC + 6677 bonus (29717 total) — PKR 48,450 (was PKR 70,217, -31%)",
      "24768 UC + 7073 bonus (31841 total) — PKR 52,012 (was PKR 76,488, -32%)",
      "26496 UC + 7468 bonus (33964 total) — PKR 55,575 (was PKR 82,948, -33%)",
      "28224 UC + 7863 bonus (36087 total) — PKR 59,138 (was PKR 89,603, -34%)",
      "29952 UC + 8254 bonus (38206 total) — PKR 62,700 (was PKR 96,462, -35%)",
    ].join("\n");

    const systemPrompt = `You are MIRA - the intelligent, warm and helpful customer support assistant for Midasbuy Pakistan (https://www.midasbuy.com.pk) - Pakistan's trusted platform for PUBG Mobile UC top-ups.

YOUR PERSONALITY:
- Friendly gaming buddy who knows everything about Midasbuy
- Warm, human, never robotic. Emojis sparingly 🎮
- ${userGreeting}

CRITICAL RULES:
1. User wrote in: ${userLanguage} - RESPOND IN THE SAME LANGUAGE
2. Keep responses SHORT (2-4 lines max) unless the user asks for details
3. Answer exactly what's asked
4. NEVER mention or link any other domain. The ONLY website is https://www.midasbuy.com.pk (old domains like midasbuy.com.co / midasbuy.com are NOT ours - never share them)
5. NEVER invent packages or prices. Use ONLY the price list below (or the live list provided). If unsure, say you will check and offer WhatsApp support.
6. We sell PUBG Mobile UC ONLY. We no longer sell Free Fire, BGMI, Roblox, Valorant or Honor of Kings - if asked, politely say only PUBG Mobile UC is available.

ABOUT MIDASBUY PAKISTAN:
- Website: https://www.midasbuy.com.pk
- Secure encrypted payments, instant delivery (usually minutes, max 30 mins)
- 24/7 support

CONTACT INFO (USE EXACTLY THESE):
📱 WhatsApp: +1 450 232 4500 (24/7)
📧 Email: help@midasbuy.com.pk

SITE SECTIONS (each has its own URL, country code = us, pk, in, etc.):
- UC packages (main page): /midasbuy/{country}/buy/pubgm
- WOW vouchers: /midasbuy/{country}/buy/pubgm/wow
- Redeem code: /midasbuy/{country}/buy/pubgm/redeem
- Shop (passes, crates, bundles): /midasbuy/{country}/buy/pubgm/shop
- Events & offers: /midasbuy/{country}/buy/pubgm/events
Example for Pakistan: https://www.midasbuy.com.pk/midasbuy/pk/buy/pubgm/wow

UC vs WOW:
- UC section = standard PUBG Mobile UC top-up packages.
- WOW section = the same UC amounts sold as WOW vouchers with WOW branding. Prices/values are managed separately, but currently they match the list below. When the customer asks about WOW, always call it "WOW" (never "UC packages") and send them to the /wow URL.

OFFICIAL PACKAGE & PRICE LIST (PKR, base prices; other countries are converted automatically):
${PRICE_TABLE}

LIVE PACKAGES FROM DATABASE (if any, these override the list above):
${packageInfo}

HOW TO PURCHASE:
1. Open the UC or WOW section
2. Choose a package
3. Enter your PUBG Player ID (double-check it!)
4. Choose a payment method and pay
5. UC is delivered instantly

HOW TO FIND PLAYER ID: Open PUBG Mobile → Profile → ID is shown below your username.

PAYMENT METHODS: Credit/Debit cards (Visa, Mastercard), JazzCash, Easypaisa, NayaPay, bank transfer, and other enabled local channels.

REFUND POLICY:
- Refund available within 24 hours if UC is not delivered
- Email help@midasbuy.com.pk with order ID and payment proof
- Processing time 7-14 working days
- No refunds after successful delivery or a wrong Player ID

COMMON ISSUES:
- Payment failed: check card details, try JazzCash/Easypaisa, or contact the bank
- UC not received: wait 30 mins, verify Player ID, contact WhatsApp support
- Wrong Player ID: cannot be reversed - always double check
- Order status: ask for the order ID

OTHER PAGES: /help-center, /faqs, /contact-us, /refund-policy, /payment-issues, /order-center

RECENT BLOGS:
${blogInfo}

RESPONSE ENDINGS:
- English: "Anything else I can help with? 😊"
- Urdu: "کچھ اور مدد چاہیے؟ 😊"

Remember: You're Mira - helpful, friendly, and always here to help gamers level up! 🎮`;

    // Call Google Gemini API (AI Studio key)
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const primaryModel = Deno.env.get('GEMINI_MODEL') || 'gemini-3.6-flash';
    const modelCandidates = [primaryModel, 'gemini-3.1-flash-lite', 'gemini-flash-latest']
      .filter((m, i, arr) => arr.indexOf(m) === i);

    // Convert chat messages to Gemini "contents" format
    const contents = messages.map((msg: any) => {
      const parts: any[] = [];
      if (msg.content) parts.push({ text: String(msg.content) });

      if (msg.image && includeVision) {
        const raw = String(msg.image);
        const match = raw.match(/^data:([^;]+);base64,(.*)$/);
        if (match) {
          parts.push({ inline_data: { mime_type: match[1], data: match[2] } });
        }
      }

      return {
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: parts.length ? parts : [{ text: '' }],
      };
    });

    const requestBody = JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: {
        maxOutputTokens: 1200,
        temperature: 0.7,
      },
    });

    let aiResponse: Response | null = null;
    for (const model of modelCandidates) {
      aiResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: 'POST',
          headers: {
            'X-goog-api-key': GEMINI_API_KEY,
            'Content-Type': 'application/json',
          },
          body: requestBody,
        }
      );

      if (aiResponse.ok) break;
      // 503 = model overloaded, 404 = model retired -> try the next candidate
      if (aiResponse.status !== 503 && aiResponse.status !== 404) break;
      console.warn(`Gemini model ${model} unavailable (${aiResponse.status}), trying next`);
    }

    if (!aiResponse || !aiResponse.ok) {
      if (!aiResponse) throw new Error('Gemini API request failed');
      const errorText = await aiResponse.text();
      console.error('Gemini API error:', aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in a moment.',
            fallback: true 
          }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Gemini API error: ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    const botResponse = data.candidates?.[0]?.content?.parts
      ?.map((p: any) => p.text)
      .filter(Boolean)
      .join('\n')
      .trim();

    if (!botResponse) {
      throw new Error('No response from AI');
    }

    return new Response(
      JSON.stringify({ response: botResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Chat support error:', error);
    
    // Smart fallback responses
    const fallbackResponses = [
      "I'm here to help! What do you need:\n\n🎮 PUBG UC Packages?\n✨ WOW Vouchers?\n❓ Support or FAQs?\n\nWhatsApp: +1 450 232 4500 (24/7)",
      
      "Let me help you with:\n\n• Package Info\n• Order Status\n• Payment Help\n• Refund Request\n\nWhatsApp Support: +1 450 232 4500",
      
      "Available Services:\n\n🎮 PUBG UC (from PKR 3,420)\n✨ WOW Vouchers\n📞 24/7 Support: +1 450 232 4500\n\nWhat can I help with?"
    ];
    
    const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
    
    return new Response(
      JSON.stringify({ 
        response: fallback,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
