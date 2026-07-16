// Socket.io handler for real-time WhatsApp communication
// Dynamic import used to avoid module init crashes in Edge runtime

export interface SocketHandler {
  handleConnection: (socket: WebSocket) => void;
}

export class WhatsAppSocketHandler {
  private whatsappClient: any | null = null;
  private isConnected = false;

  handleConnection(socket: WebSocket) {
    console.log('New admin connection established');

    // Send initial connection status
    this.sendConnectionStatus(socket);

    // Handle incoming messages from admin
    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        await this.handleSocketMessage(socket, data);
      } catch (error) {
        console.error('Error handling socket message:', error);
        this.sendError(socket, 'Invalid message format');
      }
    };

    socket.onclose = () => {
      console.log('Admin disconnected');
    };

    socket.onerror = (error) => {
      console.error('Socket error:', error);
    };
  }

  private async handleSocketMessage(socket: WebSocket, data: any) {
    console.log('Handling socket message:', data);

    switch (data.type || data) {
      case 'connect-whatsapp':
        await this.connectWhatsApp(socket);
        break;

      case 'disconnect-whatsapp':
        await this.disconnectWhatsApp(socket);
        break;

      case 'send-message':
        await this.sendMessage(socket, data.recipient, data.message, data.id);
        break;

      case 'get-messages':
        await this.getRecentMessages(socket);
        break;

      default:
        console.warn('Unknown message type:', data.type);
        this.sendError(socket, 'Unknown message type');
    }
  }

  private async connectWhatsApp(socket: WebSocket) {
    try {
      if (this.whatsappClient) {
        this.sendError(socket, 'WhatsApp client already exists');
        return;
      }

      console.log('Creating WhatsApp client...');
      const { createWhatsAppClient } = await import('./baileys-handler.ts');
      this.whatsappClient = createWhatsAppClient();

      // Set up event handlers
      this.whatsappClient.onQR((qrCode: string) => {
        console.log('QR Code generated');
        socket.send(JSON.stringify({
          type: 'qr-code',
          qrCode: qrCode
        }));
      });

      this.whatsappClient.onConnectionUpdate((status) => {
        console.log('Connection status updated:', status);
        this.isConnected = status.connected;
        socket.send(JSON.stringify({
          type: 'connection-status',
          connected: status.connected,
          phoneNumber: status.phoneNumber,
          lastSeen: new Date().toISOString()
        }));
      });

      this.whatsappClient.onMessage((message: any) => {
        console.log('New message received:', message);
        socket.send(JSON.stringify({
          type: 'message-received',
          id: message.id,
          sender: message.sender,
          message: message.message,
          type: message.type,
          timestamp: message.timestamp
        }));
      });

      // Start connection process
      await this.whatsappClient.connect();

    } catch (error) {
      console.error('Error connecting WhatsApp:', error);
      this.sendError(socket, 'Failed to connect WhatsApp: ' + error.message);
    }
  }

  private async disconnectWhatsApp(socket: WebSocket) {
    try {
      if (this.whatsappClient) {
        await this.whatsappClient.disconnect();
        this.whatsappClient = null;
      }
      
      this.isConnected = false;
      
      socket.send(JSON.stringify({
        type: 'connection-status',
        connected: false
      }));

      console.log('WhatsApp disconnected successfully');
    } catch (error) {
      console.error('Error disconnecting WhatsApp:', error);
      this.sendError(socket, 'Failed to disconnect WhatsApp');
    }
  }

  private async sendMessage(socket: WebSocket, recipient: string, message: string, messageId: string) {
    try {
      if (!this.whatsappClient || !this.isConnected) {
        throw new Error('WhatsApp is not connected');
      }

      console.log(`Sending message to ${recipient}: ${message}`);
      
      await this.whatsappClient.sendMessage(recipient, message, messageId);

      // Simulate delivery status updates
      setTimeout(() => {
        socket.send(JSON.stringify({
          type: 'message-status',
          id: messageId,
          status: 'delivered'
        }));
      }, 2000);

      setTimeout(() => {
        socket.send(JSON.stringify({
          type: 'message-status',
          id: messageId,
          status: 'read'
        }));
      }, 5000);

    } catch (error) {
      console.error('Error sending message:', error);
      this.sendError(socket, 'Failed to send message: ' + error.message);
      
      // Update message status to failed
      socket.send(JSON.stringify({
        type: 'message-status',
        id: messageId,
        status: 'failed'
      }));
    }
  }

  private async getRecentMessages(socket: WebSocket) {
    try {
      // In a real implementation, this would fetch from database
      // For now, we'll send a mock response
      console.log('Fetching recent messages...');
      
      const mockMessages = [
        {
          id: '1',
          sender: '+1234567890',
          message: 'Previous message 1',
          type: 'incoming',
          timestamp: new Date(Date.now() - 60000).toISOString()
        },
        {
          id: '2',
          sender: '+9876543210',
          message: 'Previous message 2',
          type: 'incoming',
          timestamp: new Date(Date.now() - 120000).toISOString()
        }
      ];

      mockMessages.forEach(msg => {
        socket.send(JSON.stringify({
          type: 'message-received',
          ...msg
        }));
      });

    } catch (error) {
      console.error('Error fetching messages:', error);
      this.sendError(socket, 'Failed to fetch messages');
    }
  }

  private sendConnectionStatus(socket: WebSocket) {
    const status = {
      type: 'connection-status',
      connected: this.isConnected,
      phoneNumber: this.whatsappClient?.getPhoneNumber(),
      lastSeen: this.isConnected ? new Date().toISOString() : undefined
    };

    socket.send(JSON.stringify(status));
  }

  private sendError(socket: WebSocket, message: string) {
    socket.send(JSON.stringify({
      type: 'error',
      message: message
    }));
  }
}