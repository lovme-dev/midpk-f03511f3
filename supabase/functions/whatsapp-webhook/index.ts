import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  object: string;
  entry: Array<{
    id: string;
    changes: Array<{
      value: {
        messaging_product: string;
        metadata: {
          display_phone_number: string;
          phone_number_id: string;
        };
        messages?: Array<{
          from: string;
          id: string;
          timestamp: string;
          text?: {
            body: string;
          };
          type: string;
        }>;
        statuses?: Array<{
          id: string;
          status: string;
          timestamp: string;
          recipient_id: string;
        }>;
        contacts?: Array<{
          profile: {
            name: string;
          };
          wa_id: string;
        }>;
      };
      field: string;
    }>;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // Webhook verification for WhatsApp
    if (req.method === 'GET') {
      const url = new URL(req.url);
      const mode = url.searchParams.get('hub.mode');
      const token = url.searchParams.get('hub.verify_token');
      const challenge = url.searchParams.get('hub.challenge');

      console.log('Webhook verification:', { mode, token, challenge });

      // Verify the token (you should set this in your WhatsApp app settings)
      if (mode === 'subscribe' && token === 'whatsapp_webhook_token') {
        console.log('Webhook verified successfully');
        return new Response(challenge, {
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        });
      } else {
        console.log('Webhook verification failed');
        return new Response('Forbidden', { status: 403 });
      }
    }

    // Handle incoming webhook data
    if (req.method === 'POST') {
      const body: WhatsAppMessage = await req.json();
      console.log('Received webhook:', JSON.stringify(body, null, 2));

      // Process each entry in the webhook
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          const { value } = change;

          // Handle incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              console.log('Processing message:', message);

              const phoneNumber = message.from;
              const messageText = message.text?.body || '';
              const messageId = message.id;
              const timestamp = new Date(parseInt(message.timestamp) * 1000).toISOString();

              // Get or create conversation
              let { data: conversation, error: conversationError } = await supabase
                .from('whatsapp_conversations')
                .select('*')
                .eq('phone_number', phoneNumber)
                .single();

              if (conversationError && conversationError.code === 'PGRST116') {
                // Conversation doesn't exist, create it
                const contactName = value.contacts?.find(c => c.wa_id === phoneNumber)?.profile?.name || phoneNumber;
                
                const { data: newConversation, error: createError } = await supabase
                  .from('whatsapp_conversations')
                  .insert({
                    phone_number: phoneNumber,
                    contact_name: contactName,
                    last_message_at: timestamp
                  })
                  .select()
                  .single();

                if (createError) {
                  console.error('Error creating conversation:', createError);
                  continue;
                }

                conversation = newConversation;
              } else if (conversationError) {
                console.error('Error fetching conversation:', conversationError);
                continue;
              }

              // Store the incoming message
              const { error: messageError } = await supabase
                .from('whatsapp_messages')
                .insert({
                  conversation_id: conversation.id,
                  message_id: messageId,
                  phone_number: phoneNumber,
                  message_text: messageText,
                  message_type: message.type,
                  is_outgoing: false,
                  status: 'received',
                  timestamp: timestamp
                });

              if (messageError) {
                console.error('Error storing message:', messageError);
                continue;
              }

              // Update conversation's last message time
              await supabase
                .from('whatsapp_conversations')
                .update({
                  last_message_at: timestamp
                })
                .eq('id', conversation.id);

              console.log('Message stored successfully');
            }
          }

          // Handle message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              console.log('Processing status update:', status);

              // Update message status
              const { error: statusError } = await supabase
                .from('whatsapp_messages')
                .update({
                  status: status.status
                })
                .eq('message_id', status.id);

              if (statusError) {
                console.error('Error updating message status:', statusError);
              } else {
                console.log('Message status updated successfully');
              }
            }
          }
        }
      }

      return new Response(JSON.stringify({ status: 'success' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response('Method not allowed', { status: 405 });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});