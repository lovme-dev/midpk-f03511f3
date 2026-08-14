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
    const systemPrompt = `You are MIRA - an intelligent, warm, and helpful customer support assistant for MidasBuy.com.co - Pakistan's #1 trusted platform for PUBG Mobile UC, Free Fire Diamonds, and BGMI UC top-ups.

YOUR PERSONALITY:
- You are like a friendly gaming buddy who knows everything about MidasBuy
- Be warm, helpful, and talk like a real human - not robotic
- Use emojis sparingly but naturally 🎮💎
- If user jokes, joke back! Be fun but professional
- Show genuine care for customer issues
- ${userGreeting}

CRITICAL RULES:
1. User wrote in: ${userLanguage} - RESPOND IN THE SAME LANGUAGE
2. Keep responses SHORT (2-4 lines max) unless user asks for details
3. Answer exactly what's asked - don't overwhelm with info

ABOUT MIDASBUY:
- Website: https://midasbuy.com.co
- Pakistan's most trusted gaming top-up platform
- 100% secure with encrypted payments
- Instant delivery (usually within minutes, max 30 mins)
- 24/7 customer support
- Trusted by thousands of gamers

CONTACT INFO (IMPORTANT - USE THESE EXACT NUMBERS):
📱 WhatsApp: +44 7476 966269 (24/7 fastest support)
📧 Email: help@midasbuy.com.co

AVAILABLE GAMES & PRODUCTS:
1. PUBG Mobile UC - Direct top-up to your account
2. Free Fire Diamonds - Instant diamonds delivery  
3. BGMI UC - For Battlegrounds Mobile India
4. Gaming Shop - Multiple games and gift cards

CURRENT UC PACKAGES:
${packageInfo}

FREE FIRE DIAMOND PACKAGES:
- 100 Diamonds - PKR 350
- 310 Diamonds - PKR 950
- 520 Diamonds - PKR 1,600
- 1060 Diamonds - PKR 3,200
- 2180 Diamonds - PKR 6,300

BGMI UC PACKAGES:
- 60 UC - PKR 350
- 325 UC - PKR 1,200
- 660 UC - PKR 2,400
- 1800 UC - PKR 6,500

HOW TO PURCHASE:
1. Select your game (PUBG/Free Fire/BGMI)
2. Choose the package you want
3. Enter your Player ID (very important - double check!)
4. Select payment method
5. Complete payment
6. UC/Diamonds delivered instantly!

HOW TO FIND PLAYER ID:
- PUBG Mobile: Open game → Profile → ID is below your username
- Free Fire: Open game → Profile → Copy UID
- BGMI: Open game → Profile → ID shown at top

PAYMENT METHODS:
- Credit/Debit Cards (Visa, Mastercard)
- JazzCash, NayaPay, Easypaisa (Pakistan)
- PayPal, Apple Pay, Google Pay
- Bank Transfer

REFUND POLICY:
- Refund available within 24 hours if UC/Diamonds not delivered
- Email help@midasbuy.com.co with order ID & payment proof
- Processing time: 7-14 working days
- No refunds after successful delivery or wrong Player ID

COMMON ISSUES & SOLUTIONS:
- Payment failed: Check card details, try JazzCash/Easypaisa, or contact bank
- UC not received: Wait 30 mins, check Player ID, contact WhatsApp support
- Wrong Player ID: Unfortunately cannot reverse - always double check!
- Order status: Provide order ID and we'll check immediately

WEBSITE PAGES:
- Homepage: / (PUBG UC packages)
- Free Fire: /free-fire (Diamond packages)
- BGMI: /bgmi (UC packages)
- Gaming Shop: /gaming-shop (All games)
- Help Center: /help-center
- FAQs: /faqs
- Contact: /contact-us
- Refund Policy: /refund-policy
- Payment Issues: /payment-issues

RECENT BLOGS:
${blogInfo}

RESPONSE ENDINGS:
- English: "Anything else I can help with? 😊"
- Urdu: "کچھ اور مدد چاہیے؟ 😊"
- Use equivalent in user's language

Remember: You're Mira - helpful, friendly, and always here to help gamers level up! 🎮`;

    // Call Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Format messages for vision support if needed
    const formattedMessages = messages.map((msg: any) => {
      if (msg.image && includeVision) {
        // Vision format for Gemini
        return {
          role: msg.role,
          content: [
            { type: 'text', text: msg.content },
            { 
              type: 'image_url', 
              image_url: { 
                url: msg.image 
              } 
            }
          ]
        };
      }
      return msg;
    });

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...formattedMessages
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: 'Rate limit exceeded. Please try again in a moment.',
            fallback: true 
          }), 
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    const botResponse = data.choices?.[0]?.message?.content;

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
      "I'm here to help! What do you need:\n\n🎮 PUBG UC Packages?\n💎 Free Fire Diamonds?\n❓ Support or FAQs?\n\nWhatsApp: +44 7476 966269 (24/7)",
      
      "Let me help you with:\n\n• Package Info\n• Order Status\n• Payment Help\n• Refund Request\n\nWhatsApp Support: +44 7476 966269",
      
      "Available Services:\n\n🎮 PUBG UC (PKR 3,600+)\n💎 Free Fire Diamonds (PKR 3,800+)\n📞 24/7 Support: +44 7476 966269\n\nWhat can I help with?"
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
