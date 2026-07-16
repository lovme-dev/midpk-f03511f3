// Baileys WhatsApp Web handler
import makeWASocket, { DisconnectReason, useMultiFileAuthState } from 'https://esm.sh/@whiskeysockets/baileys@7.0.0-rc.3?target=deno';
import { Boom } from 'https://esm.sh/@hapi/boom@10.0.1?target=deno';
// pino removed due to Deno incompatibility in Edge Functions
import QRCode from 'https://esm.sh/qrcode@1.5.3?target=deno';

export interface WhatsAppClient {
  isConnected: boolean;
  phoneNumber?: string;
  qrCode?: string;
}

export interface WhatsAppMessage {
  id: string;
  sender: string;
  recipient?: string;
  message: string;
  type: 'incoming' | 'outgoing';
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read' | 'failed';
}

// Baileys WhatsApp client implementation
export class BaileysWhatsAppClient {
  private sock: any = null;
  private connected = false;
  private phoneNumber = '';
  private onQRCallback?: (qr: string) => void;
  private onMessageCallback?: (message: WhatsAppMessage) => void;
  private onStatusCallback?: (status: { connected: boolean; phoneNumber?: string }) => void;
  private authState: any;
  private saveCreds: any;

  constructor() {
    // Initialize with logger
    this.initializeAuthState();
  }

  private async initializeAuthState() {
    try {
      // In production, you should implement your own auth state
      // For now, using the built-in file-based auth state
      const { state, saveCreds } = await useMultiFileAuthState('/tmp/auth_info_baileys');
      this.authState = state;
      this.saveCreds = saveCreds;
    } catch (error) {
      console.error('Error initializing auth state:', error);
    }
  }

  onQR(callback: (qr: string) => void) {
    this.onQRCallback = callback;
  }

  onMessage(callback: (message: WhatsAppMessage) => void) {
    this.onMessageCallback = callback;
  }

  onConnectionUpdate(callback: (status: { connected: boolean; phoneNumber?: string }) => void) {
    this.onStatusCallback = callback;
  }

  async connect() {
    try {
      console.log('Starting WhatsApp connection with Baileys...');
      
      // Ensure auth state is initialized
      if (!this.authState) {
        await this.initializeAuthState();
      }

      this.sock = makeWASocket({
        auth: this.authState,
        // logger removed to avoid pino import
        printQRInTerminal: false,
        browser: ['WhatsApp Control', 'Chrome', '1.0.0'],
        getMessage: async (key) => {
          // In production, implement proper message retrieval from database
          return { conversation: 'Hello' };
        }
      });

      // Handle credential updates
      this.sock.ev.on('creds.update', this.saveCreds);

      // Handle connection updates
      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;
        
        console.log('Connection update:', { connection, qr: !!qr });

        if (qr && this.onQRCallback) {
          // Generate QR code as base64 image
          const qrCodeDataURL = await QRCode.toDataURL(qr);
          this.onQRCallback(qrCodeDataURL);
        }

        if (connection === 'close') {
          const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
          console.log('Connection closed due to:', lastDisconnect?.error, 'Reconnecting:', shouldReconnect);
          
          this.connected = false;
          if (this.onStatusCallback) {
            this.onStatusCallback({ connected: false });
          }

          if (shouldReconnect) {
            // Reconnect after a delay
            setTimeout(() => this.connect(), 3000);
          }
        } else if (connection === 'open') {
          console.log('WhatsApp connection opened successfully');
          this.connected = true;
          this.phoneNumber = this.sock.user?.id?.split(':')[0] || '';
          
          if (this.onStatusCallback) {
            this.onStatusCallback({
              connected: true,
              phoneNumber: this.phoneNumber
            });
          }
        }
      });

      // Handle incoming messages
      this.sock.ev.on('messages.upsert', ({ messages, type }: any) => {
        if (type === 'notify' && this.onMessageCallback) {
          for (const msg of messages) {
            if (!msg.key.fromMe && msg.message) {
              const messageText = msg.message.conversation || 
                                msg.message.extendedTextMessage?.text || 
                                'Media message';
              
              const whatsappMessage: WhatsAppMessage = {
                id: msg.key.id,
                sender: msg.key.remoteJid,
                message: messageText,
                type: 'incoming',
                timestamp: new Date(msg.messageTimestamp * 1000).toISOString()
              };
              
              this.onMessageCallback(whatsappMessage);
            }
          }
        }
      });

    } catch (error) {
      console.error('Error connecting to WhatsApp:', error);
      throw error;
    }
  }

  async disconnect() {
    if (this.sock) {
      await this.sock.logout();
      this.connected = false;
      this.phoneNumber = '';
      
      if (this.onStatusCallback) {
        this.onStatusCallback({ connected: false });
      }
    }
  }

  async sendMessage(recipient: string, message: string, messageId: string) {
    if (!this.connected || !this.sock) {
      throw new Error('WhatsApp not connected');
    }

    try {
      console.log(`Sending message to ${recipient}: ${message}`);
      
      // Ensure recipient has @s.whatsapp.net suffix
      const jid = recipient.includes('@') ? recipient : `${recipient}@s.whatsapp.net`;
      
      await this.sock.sendMessage(jid, { text: message });
      
      return {
        id: messageId,
        status: 'sent'
      };
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  isConnectedStatus() {
    return this.connected;
  }

  getPhoneNumber() {
    return this.phoneNumber;
  }
}

// Factory function to create WhatsApp client
export function createWhatsAppClient(): BaileysWhatsAppClient {
  return new BaileysWhatsAppClient();
}