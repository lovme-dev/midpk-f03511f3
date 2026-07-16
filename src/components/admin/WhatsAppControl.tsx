import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { QrCode, Send, RefreshCw, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
// Removed socket.io-client import since we're using native WebSockets

interface WhatsAppMessage {
  id: string;
  sender: string;
  recipient?: string;
  message: string;
  type: 'incoming' | 'outgoing';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

interface ConnectionStatus {
  connected: boolean;
  phoneNumber?: string;
  lastSeen?: string;
}

export function WhatsAppControl() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ connected: false });
  const [qrCode, setQrCode] = useState<string>('');
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [sendRecipient, setSendRecipient] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  // Initialize WebSocket connection
  useEffect(() => {
    // Get the correct Supabase WebSocket URL
    const SUPABASE_URL = window.location.origin.includes('localhost') 
      ? 'ws://127.0.0.1:54321/functions/v1/whatsapp-control'
      : 'wss://xphijmjxpgkwhtysmcxb.supabase.co/functions/v1/whatsapp-control';

    console.log('Connecting to WebSocket:', SUPABASE_URL);

    const newSocket = new WebSocket(SUPABASE_URL);

    newSocket.onopen = () => {
      console.log('Connected to WhatsApp Control server');
      toast({ title: 'Connected to WhatsApp server' });
    };

    newSocket.onclose = () => {
      console.log('Disconnected from WhatsApp Control server');
      toast({ title: 'Disconnected from WhatsApp server', variant: 'destructive' });
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received message:', data);

        switch (data.type) {
          case 'qr-code':
            console.log('Received QR code');
            setQrCode(data.qrCode);
            setIsConnecting(true);
            break;

          case 'connection-status':
            console.log('Connection status updated:', data);
            setConnectionStatus({
              connected: data.connected,
              phoneNumber: data.phoneNumber,
              lastSeen: data.lastSeen
            });
            setIsConnecting(false);
            if (data.connected) {
              setQrCode('');
              toast({ 
                title: 'WhatsApp Connected!', 
                description: `Connected as ${data.phoneNumber}` 
              });
            }
            break;

          case 'message-received':
            console.log('New message received:', data);
            const newMessage: WhatsAppMessage = {
              id: data.id,
              sender: data.sender,
              message: data.message,
              type: data.type || 'incoming',
              timestamp: data.timestamp
            };
            setMessages(prev => [newMessage, ...prev]);
            toast({ 
              title: 'New WhatsApp message', 
              description: `From ${data.sender}: ${data.message.substring(0, 50)}...` 
            });
            break;

          case 'message-status':
            setMessages(prev => prev.map(msg => 
              msg.id === data.id 
                ? { ...msg, status: data.status as any }
                : msg
            ));
            break;

          case 'error':
            console.error('WhatsApp error:', data);
            toast({ 
              title: 'WhatsApp Error', 
              description: data.message, 
              variant: 'destructive' 
            });
            break;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({ 
        title: 'Connection Error', 
        description: 'Failed to connect to WhatsApp server', 
        variant: 'destructive' 
      });
    };

    setSocket(newSocket);

    return () => {
      if (newSocket.readyState === WebSocket.OPEN) {
        newSocket.close();
      }
    };
  }, [toast]);

  // Connect WhatsApp
  const handleConnect = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setIsConnecting(true);
      socket.send(JSON.stringify({ type: 'connect-whatsapp' }));
      toast({ title: 'Initializing WhatsApp connection...' });
    }
  };

  // Disconnect WhatsApp
  const handleDisconnect = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'disconnect-whatsapp' }));
      setConnectionStatus({ connected: false });
      setQrCode('');
      toast({ title: 'WhatsApp disconnected' });
    }
  };

  // Send message
  const handleSendMessage = async () => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !sendRecipient || !sendMessage || !connectionStatus.connected) {
      toast({ 
        title: 'Cannot send message', 
        description: 'Please check connection and fill all fields',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);
    const messageId = Date.now().toString();

    // Add to local messages immediately
    const newMessage: WhatsAppMessage = {
      id: messageId,
      sender: connectionStatus.phoneNumber || 'You',
      recipient: sendRecipient,
      message: sendMessage,
      type: 'outgoing',
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    setMessages(prev => [newMessage, ...prev]);

    // Send via socket
    socket.send(JSON.stringify({
      type: 'send-message',
      id: messageId,
      recipient: sendRecipient,
      message: sendMessage
    }));

    // Clear form
    setSendMessage('');
    setSendRecipient('');
    setIsSending(false);
    
    toast({ title: 'Message sent!' });
  };

  // Refresh messages
  const handleRefreshMessages = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'get-messages' }));
      toast({ title: 'Refreshing messages...' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">WhatsApp Control Center</h1>
        <Button 
          onClick={handleRefreshMessages} 
          variant="outline" 
          size="sm"
          disabled={!connectionStatus.connected}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {connectionStatus.connected ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Connection Status
            </CardTitle>
            <CardDescription>
              Manage WhatsApp Web connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <Badge variant={connectionStatus.connected ? "default" : "destructive"}>
                {connectionStatus.connected ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>
            
            {connectionStatus.connected && connectionStatus.phoneNumber && (
              <div className="flex items-center justify-between">
                <span>Phone:</span>
                <span className="font-mono text-sm">{connectionStatus.phoneNumber}</span>
              </div>
            )}

            {connectionStatus.connected && connectionStatus.lastSeen && (
              <div className="flex items-center justify-between">
                <span>Last Seen:</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(connectionStatus.lastSeen).toLocaleString()}
                </span>
              </div>
            )}

            <div className="flex gap-2">
              {!connectionStatus.connected ? (
                <Button 
                  onClick={handleConnect} 
                  disabled={isConnecting}
                  className="w-full"
                >
                  <QrCode className="h-4 w-4 mr-2" />
                  {isConnecting ? 'Connecting...' : 'Connect WhatsApp'}
                </Button>
              ) : (
                <Button 
                  onClick={handleDisconnect} 
                  variant="destructive"
                  className="w-full"
                >
                  Disconnect WhatsApp
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* QR Code */}
        {qrCode && (
          <Card>
            <CardHeader>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>
                Open WhatsApp on your phone and scan this QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="bg-white p-4 rounded-lg">
                <img 
                  src={qrCode} 
                  alt="WhatsApp QR Code" 
                  className="w-48 h-48 object-contain"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Send Message */}
        {connectionStatus.connected && (
          <Card className={qrCode ? "md:col-span-1" : "md:col-span-2"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Send Message
              </CardTitle>
              <CardDescription>
                Send WhatsApp message to any number
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipient">Recipient Phone Number</Label>
                <Input
                  id="recipient"
                  placeholder="+1234567890"
                  value={sendRecipient}
                  onChange={(e) => setSendRecipient(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Type your message here..."
                  value={sendMessage}
                  onChange={(e) => setSendMessage(e.target.value)}
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleSendMessage}
                disabled={!sendRecipient || !sendMessage || isSending}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSending ? 'Sending...' : 'Send Message'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Messages Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message History
          </CardTitle>
          <CardDescription>
            Recent incoming and outgoing WhatsApp messages
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No messages yet. Connect WhatsApp to start receiving messages.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell>
                        <Badge variant={msg.type === 'incoming' ? 'secondary' : 'default'}>
                          {msg.type === 'incoming' ? 'In' : 'Out'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {msg.type === 'incoming' ? msg.sender : msg.recipient}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {msg.message}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(msg.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {msg.status && (
                          <Badge 
                            variant={
                              msg.status === 'delivered' || msg.status === 'read' 
                                ? 'default' 
                                : msg.status === 'failed' 
                                ? 'destructive' 
                                : 'secondary'
                            }
                          >
                            {msg.status}
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}