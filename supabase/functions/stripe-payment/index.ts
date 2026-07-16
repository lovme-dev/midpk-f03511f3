import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, item_name, email_address, player_id, username, payment_id, account_type } = await req.json();

    // Initialize Stripe with secret from Supabase secrets
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('Stripe secret key not configured');
    }
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
    });

    console.log('Processing Stripe payment:', { amount, item_name, email_address });

    // Determine the correct price ID based on amount and type
    let priceId = '';
    
    if (account_type === 'pubg_account') {
      // For PUBG accounts, create a one-time price under the same product
      const price = await stripe.prices.create({
        unit_amount: Math.round(amount * 100), // Convert to cents/paisa
        currency: 'pkr',
        product: 'prod_SsY77c3FlNQAmU',
      });

      priceId = price.id;
    } else {
      // For UC packages, always create a one-time price under the provided product
      const price = await stripe.prices.create({
        unit_amount: Math.round(amount * 100), // Convert to paisa (cents)
        currency: 'pkr',
        product: 'prod_SsY77c3FlNQAmU',
      });
      priceId = price.id;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email_address,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin') || 'https://middasbuy.com'}/thankyou?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin') || 'https://middasbuy.com'}/payment/failed?reason=payment_cancelled`,
      metadata: {
        payment_id: payment_id,
        player_id: player_id || '',
        username: username || '',
        item_name: item_name,
      },
    });

    console.log('Stripe session created:', session.id);

    // Store order information in Supabase (optional)
    try {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
        { auth: { persistSession: false } }
      );

      await supabase.from('orders').insert({
        transaction_id: session.id,
        amount: Math.round(amount),
        price: amount,
        status: 'pending',
        payment_method: 'stripe',
        player_id: player_id || null,
        server_name: username || null,
        user_id: null, // Will be updated when we have user auth
      });
    } catch (dbError) {
      console.error('Database insert error:', dbError);
      // Don't fail the payment if DB insert fails
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkout_url: session.url,
        session_id: session.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Stripe payment error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Payment processing failed',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});