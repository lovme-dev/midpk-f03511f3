import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

export const chatSupport = createServerFn({ method: 'POST' })
  .inputValidator((input: { messages: any[]; includeVision?: boolean; userName?: string | null }) => input)
  .handler(async ({ data }) => {
    const { messages, includeVision, userName } = data;
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { detectLanguage } = await import('./support.server');

    try {
      const [{ data: packages }, { data: blogs }] = await Promise.all([
        supabaseAdmin.from('uc_packages').select('*').order('price'),
        supabaseAdmin.from('blogs').select('title, excerpt, slug').eq('published', true).limit(10),
      ]);

      const packageInfo = packages?.map((p: any) =>
        `${p.name}: ${p.uc_amount} UC - PKR ${p.price}${p.popular ? ' (POPULAR)' : ''}${p.discount_percentage ? ` (${p.discount_percentage}% OFF)` : ''}`
      ).join('\n') || 'No packages available';

      const blogInfo = blogs?.map((b: any) => `${b.title} - ${b.excerpt}`).join('\n') || 'No blogs available';

      const lastUserMessage = messages[messages.length - 1]?.content || '';
      const userLanguage = detectLanguage(lastUserMessage);

      const userGreeting = userName ? `The user's name is "${userName}". Use their name naturally in conversation to make it personal and friendly.` : 'The user is not logged in.';

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

      const LOVABLE_API_KEY = process.env['LOVABLE_API_KEY'];
      if (!LOVABLE_API_KEY) {
        throw new Error('LOVABLE_API_KEY not configured');
      }

      const formattedMessages = messages.map((msg: any) => {
        if (msg.image && includeVision) {
          return {
            role: msg.role,
            content: [
              { type: 'text', text: msg.content },
              { type: 'image_url', image_url: { url: msg.image } },
            ],
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
          messages: [{ role: 'system', content: systemPrompt }, ...formattedMessages],
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI Gateway error:', aiResponse.status, errorText);
        if (aiResponse.status === 429) {
          return { error: 'Rate limit exceeded. Please try again in a moment.', fallback: true };
        }
        throw new Error(`AI Gateway error: ${aiResponse.status}`);
      }

      const aiData = await aiResponse.json();
      const botResponse = aiData.choices?.[0]?.message?.content;

      if (!botResponse) {
        throw new Error('No response from AI');
      }

      return { response: botResponse };
    } catch (error) {
      console.error('Chat support error:', error);

      const fallbackResponses = [
        "I'm here to help! What do you need:\n\n🎮 PUBG UC Packages?\n💎 Free Fire Diamonds?\n❓ Support or FAQs?\n\nWhatsApp: +44 7476 966269 (24/7)",
        "Let me help you with:\n\n• Package Info\n• Order Status\n• Payment Help\n• Refund Request\n\nWhatsApp Support: +44 7476 966269",
        "Available Services:\n\n🎮 PUBG UC (PKR 3,600+)\n💎 Free Fire Diamonds (PKR 3,800+)\n📞 24/7 Support: +44 7476 966269\n\nWhat can I help with?",
      ];

      const fallback = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

      return {
        response: fallback,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });

export const translateMessage = createServerFn({ method: 'POST' })
  .inputValidator((input: { message: string; targetLanguage?: string }) => input)
  .handler(async ({ data }) => {
    const { message, targetLanguage = 'Urdu' } = data;

    if (!message || typeof message !== 'string') {
      return { error: 'Message is required' };
    }

    const LOVABLE_API_KEY = process.env['LOVABLE_API_KEY'];
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return { error: 'Translation service not configured' };
    }

    try {
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-flash-preview',
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the given text to ${targetLanguage} (Roman script, not native script). 
Only output the translated text, nothing else. 
Keep proper names, email addresses, order IDs, and technical terms unchanged.
If the text is already in ${targetLanguage}, just return it as is.
Make the translation natural and easy to read.`,
            },
            { role: 'user', content: message },
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          return { error: 'Rate limit exceeded, please try again later' };
        }
        if (response.status === 402) {
          return { error: 'AI credits exhausted, please add more credits' };
        }
        const errorText = await response.text();
        console.error('AI gateway error:', response.status, errorText);
        return { error: 'Translation failed' };
      }

      const aiData = await response.json();
      const translatedText = aiData.choices?.[0]?.message?.content?.trim() || message;

      return { translated: translatedText, original: message, language: targetLanguage };
    } catch (error) {
      console.error('Translation error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  });

export const trackOrder = createServerFn({ method: 'POST' })
  .inputValidator((input: { query?: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { SELECT_COLUMNS, isUuid } = await import('./support.server');

    const raw = (data.query ?? '').toString();
    const query = raw.trim().replace(/\s+/g, '');

    if (!query) {
      return { success: false, error: 'Missing query' };
    }

    if (query.length > 200) {
      return { success: false, error: 'Query too long' };
    }

    try {
      let order: any = null;

      // 1) UUID (database id)
      if (isUuid(query)) {
        const { data: found, error } = await supabaseAdmin
          .from('orders')
          .select(SELECT_COLUMNS)
          .eq('id', query)
          .maybeSingle();
        if (error) throw error;
        order = found;
      }

      // 2) Exact transaction_id
      if (!order) {
        const { data: found, error } = await supabaseAdmin
          .from('orders')
          .select(SELECT_COLUMNS)
          .eq('transaction_id', query)
          .maybeSingle();
        if (error) throw error;
        order = found;
      }

      // 3) Partial transaction_id prefix
      if (!order && query.toUpperCase().startsWith('ORD-')) {
        const { data: found, error } = await supabaseAdmin
          .from('orders')
          .select(SELECT_COLUMNS)
          .ilike('transaction_id', `${query}%`)
          .order('created_at', { ascending: false })
          .limit(2);
        if (error) throw error;
        if (found && found.length === 1) order = found[0];
      }

      // 4) Short code (last segment)
      if (!order) {
        const short = query.replace(/[^a-zA-Z0-9]/g, '');
        if (short.length >= 6 && short.length <= 20) {
          const { data: found, error } = await supabaseAdmin
            .from('orders')
            .select(SELECT_COLUMNS)
            .ilike('transaction_id', `%-${short}`)
            .order('created_at', { ascending: false })
            .limit(2);
          if (error) throw error;
          if (found && found.length === 1) order = found[0];
        }
      }

      return { success: true, order };
    } catch (err) {
      console.error('track-order error:', err);
      return { success: false, error: 'Internal error' };
    }
  });

export const createOrGetGuestProfile = createServerFn({ method: 'POST' })
  .inputValidator((input: { email: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');

    const email = data.email?.trim().toLowerCase();
    const password = data.password?.trim();

    if (!email) {
      return { success: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Invalid email format' };
    }

    if (email.length > 255) {
      return { success: false, error: 'Email too long' };
    }

    if (!password) {
      return { success: false, error: 'Password is required' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    try {
      const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (signUpError) {
        if (signUpError.message?.includes('already been registered') || signUpError.message?.includes('already exists')) {
          const { data: existingProfile, error: fetchError } = await supabaseAdmin
            .from('profiles')
            .select('user_id, email')
            .eq('email', email)
            .maybeSingle();

          if (fetchError) {
            console.error('Error fetching existing profile:', fetchError);
            return { success: false, error: 'Failed to verify account' };
          }

          if (existingProfile) {
            return {
              success: true,
              user_id: existingProfile.user_id,
              email: existingProfile.email,
              is_existing: true,
            };
          }

          return { success: false, error: 'Account exists. Please login instead.' };
        }

        console.error('Error creating user:', signUpError);
        return { success: false, error: signUpError.message || 'Failed to create account' };
      }

      const userId = signUpData.user?.id;

      if (!userId) {
        return { success: false, error: 'Failed to create user account' };
      }

      // Wait a moment for the trigger to create profile
      await new Promise((resolve) => setTimeout(resolve, 500));

      return { success: true, user_id: userId, email, is_existing: false };
    } catch (error: any) {
      console.error('create-or-get-guest-profile error:', error);
      return { success: false, error: error?.message || 'Internal server error' };
    }
  });

export const markOrderCancelled = createServerFn({ method: 'POST' })
  .inputValidator((input: { transactionId: string; reason?: string; targetStatus?: string }) => input)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const { getCountryFromCurrency, parsePrimaryAmount, getDisplayOrderId, getCallerAuth, delay } = await import('./support.server');

    const { transactionId, reason, targetStatus } = data;
    if (!transactionId) {
      return { success: false, error: 'transactionId required' };
    }

    const nextStatus: 'failed' | 'cancelled' = targetStatus === 'cancelled' ? 'cancelled' : 'failed';

    try {
      const { data: order, error: fetchError } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('transaction_id', transactionId)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!order) {
        return { success: false, error: 'Order not found' };
      }

      // Only the order's owner (or an admin) may cancel a registered user's order.
      if (order.user_id) {
        const request = getRequest();
        const authHeader = request?.headers?.get('authorization') ?? null;
        const auth = await getCallerAuth(authHeader);
        if (!auth.isAdmin && auth.userId !== order.user_id) {
          return { success: false, error: 'Not allowed to cancel this order' };
        }
      }

      const moveToRefundReviewAfterDelay = async (orderId: string) => {
        await delay(30_000);
        const { error } = await supabaseAdmin
          .from('orders')
          .update({ status: 'refund_review', updated_at: new Date().toISOString() })
          .eq('id', orderId)
          .eq('status', 'cancelled');

        if (error) console.error('refund_review transition failed:', error.message);
        else console.log('order moved to refund_review:', orderId);
      };

      if (order.status !== 'pending') {
        if (order.status === 'cancelled') {
          void moveToRefundReviewAfterDelay(order.id);
        }

        return { success: true, alreadyProcessed: true, status: order.status, order };
      }

      const { error: updateError } = await supabaseAdmin
        .from('orders')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', order.id);
      if (updateError) throw updateError;

      const updatedOrder = { ...order, status: nextStatus, updated_at: new Date().toISOString() };

      // Only for "cancelled" (real charge, refund owed) fire admin push + refund email.
      if (nextStatus === 'cancelled') {
        try {
          const { notifyAdminNewOrder } = await import('./notifications.functions');
          await notifyAdminNewOrder({
            data: {
              event_type: 'order_cancelled',
              order_details: {
                order_id: order.id,
                package_name: order.product_name || 'Package',
                price: order.price || 0,
                player_id: order.player_id || 'N/A',
                currency_code: order.currency_code || 'PKR',
              },
            },
          });
        } catch (e) {
          console.error('notify-admin failed:', e);
        }

        try {
          const { sendOrderEmail } = await import('./emails.functions');
          await sendOrderEmail({
            data: {
              userId: order.user_id,
              orderId: order.id,
              emailType: 'refund',
              orderDetails: {
                packageName: order.product_name || 'Package',
                productName: order.product_name || 'Package',
                productAmount: order.product_amount ?? undefined,
                productType: order.product_type || 'pubg_uc',
                ucAmount: parsePrimaryAmount(order.product_amount),
                price: order.price || 0,
                currencyCode: order.currency_code || 'PKR',
                countryCode: getCountryFromCurrency(order.currency_code || 'PKR'),
                playerId: order.player_id || '',
                transactionId: getDisplayOrderId(order.id, order.transaction_id),
                paymentMethod: order.payment_method || 'card',
                customerEmail: order.customer_email,
              },
            },
          });
        } catch (e) {
          console.error('refund email failed:', e);
        }

        void moveToRefundReviewAfterDelay(order.id);
      }

      return { success: true, status: nextStatus, reason, order: updatedOrder };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed';
      console.error('mark-order-cancelled error:', message);
      return { success: false, error: message };
    }
  });
