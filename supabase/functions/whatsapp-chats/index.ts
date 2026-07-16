import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'get-conversations':
        // Get all WhatsApp conversations with latest messages
        const { data: conversations, error: conversationsError } = await supabase
          .from('whatsapp_conversations')
          .select(`
            *,
            whatsapp_messages!whatsapp_messages_conversation_id_fkey(
              id,
              message_text,
              timestamp,
              is_outgoing
            )
          `)
          .eq('is_active', true)
          .order('last_message_at', { ascending: false });

        if (conversationsError) {
          throw conversationsError;
        }

        // Transform data for frontend
        const transformedConversations = conversations?.map(conv => ({
          id: conv.id,
          name: conv.contact_name || conv.phone_number,
          phone: conv.phone_number,
          lastMessage: conv.whatsapp_messages?.[0]?.message_text || '',
          timestamp: new Date(conv.last_message_at).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          unreadCount: 0, // Can be calculated based on read status
          avatar: conv.profile_pic_url,
          isOnline: false,
          lastSeen: 'recently'
        })) || [];

        return new Response(JSON.stringify({ conversations: transformedConversations }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      case 'get-messages':
        const conversationId = url.searchParams.get('conversationId');
        if (!conversationId) {
          throw new Error('Conversation ID is required');
        }

        const { data: messages, error: messagesError } = await supabase
          .from('whatsapp_messages')
          .select('*')
          .eq('conversation_id', conversationId)
          .order('timestamp', { ascending: true });

        if (messagesError) {
          throw messagesError;
        }

        // Transform messages for frontend
        const transformedMessages = messages?.map(msg => ({
          id: msg.id,
          text: msg.message_text,
          timestamp: new Date(msg.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
          }),
          isOutgoing: msg.is_outgoing,
          status: msg.status,
          type: msg.message_type
        })) || [];

        return new Response(JSON.stringify({ messages: transformedMessages }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

      default:
        return new Response(JSON.stringify({ error: 'Invalid action' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

  } catch (error) {
    console.error('WhatsApp chats error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});