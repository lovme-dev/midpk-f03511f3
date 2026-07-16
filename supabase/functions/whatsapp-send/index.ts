import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SendMessageRequest {
  phoneNumber: string;
  message: string;
  conversationId?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const accessToken = Deno.env.get('WHATSAPP_ACCESS_TOKEN');
  const businessAccountId = Deno.env.get('WHATSAPP_BUSINESS_ACCOUNT_ID');

  if (!accessToken || !businessAccountId) {
    return new Response(JSON.stringify({ error: 'WhatsApp credentials not configured' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { phoneNumber, message, conversationId }: SendMessageRequest = await req.json();

    if (!phoneNumber || !message) {
      return new Response(JSON.stringify({ error: 'Phone number and message are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Sending WhatsApp message:', { phoneNumber, message });

    // Get phone number ID from WhatsApp Business account
    const phoneNumberResponse = await fetch(
      `https://graph.facebook.com/v18.0/${businessAccountId}/phone_numbers`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!phoneNumberResponse.ok) {
      const error = await phoneNumberResponse.text();
      console.error('Error getting phone numbers:', error);
      return new Response(JSON.stringify({ error: 'Failed to get phone numbers' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const phoneNumberData = await phoneNumberResponse.json();
    const phoneNumberId = phoneNumberData.data[0]?.id;

    if (!phoneNumberId) {
      return new Response(JSON.stringify({ error: 'No phone number configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Send message via WhatsApp Business API
    const messageResponse = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: {
            body: message
          }
        })
      }
    );

    if (!messageResponse.ok) {
      const error = await messageResponse.text();
      console.error('Error sending WhatsApp message:', error);
      return new Response(JSON.stringify({ error: 'Failed to send message' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const messageResult = await messageResponse.json();
    const whatsappMessageId = messageResult.messages[0].id;

    console.log('WhatsApp message sent successfully:', messageResult);

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('id', conversationId)
        .single();
      conversation = data;
    } else {
      let { data: existingConversation } = await supabase
        .from('whatsapp_conversations')
        .select('*')
        .eq('phone_number', phoneNumber)
        .single();

      if (!existingConversation) {
        const { data: newConversation, error: createError } = await supabase
          .from('whatsapp_conversations')
          .insert({
            phone_number: phoneNumber,
            contact_name: phoneNumber,
            last_message_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
        } else {
          existingConversation = newConversation;
        }
      }
      conversation = existingConversation;
    }

    // Store the outgoing message in database
    if (conversation) {
      const { error: messageError } = await supabase
        .from('whatsapp_messages')
        .insert({
          conversation_id: conversation.id,
          message_id: whatsappMessageId,
          phone_number: phoneNumber,
          message_text: message,
          message_type: 'text',
          is_outgoing: true,
          status: 'sent',
          timestamp: new Date().toISOString()
        });

      if (messageError) {
        console.error('Error storing outgoing message:', messageError);
      }

      // Update conversation's last message time
      await supabase
        .from('whatsapp_conversations')
        .update({
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversation.id);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: whatsappMessageId,
      conversationId: conversation?.id 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Send message error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});