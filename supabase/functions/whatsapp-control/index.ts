import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { WhatsAppSocketHandler } from './socket-handler.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400, headers: corsHeaders });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const socketHandler = new WhatsAppSocketHandler();
    
    console.log('New WebSocket connection for WhatsApp Control');
    
    // Handle the WebSocket connection using our socket handler
    socketHandler.handleConnection(socket);

    return response;
  } catch (error) {
    console.error('WebSocket upgrade error:', error);
    return new Response('WebSocket upgrade failed', { status: 500, headers: corsHeaders });
  }
});