import React, { useState } from 'react';
import { Phone, Video, MoreVertical, Paperclip, Mic, Send, Smile } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  status?: 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'file';
}

interface Chat {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface ChatConversationProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ChatConversation({ chat, messages, onSendMessage }: ChatConversationProps) {
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!chat) {
    return (
      <div className="flex-1 bg-[#0b141a] flex items-center justify-center">
        <div className="text-center text-[#8696a0]">
          <div className="w-64 h-64 mx-auto mb-8 opacity-20">
            <svg viewBox="0 0 303 172" className="w-full h-full">
              <defs>
                <linearGradient id="whatsapp-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0f2f5" />
                  <stop offset="100%" stopColor="#8696a0" />
                </linearGradient>
              </defs>
              <path
                fill="url(#whatsapp-gradient)"
                d="M96.153 78.89c-1.47-3.148-3.148-3.379-4.59-3.444-.789-.054-1.685-.05-2.6-.05-2.403 0-4.806.895-6.491 2.58-1.685 1.685-6.49 6.338-6.49 15.447 0 9.108 6.648 17.9 7.579 19.131.93 1.231 12.796 20.354 31.405 27.541 15.529 5.996 18.677 4.806 22.057 4.501 3.379-.305 10.883-4.501 12.415-8.848 1.532-4.347 1.532-8.081 1.071-8.848-.46-.767-1.685-1.231-3.525-2.126z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-light mb-2">WhatsApp Business Chat</h3>
          <p className="text-sm">Select a chat to start messaging customers</p>
          <p className="text-xs mt-2 opacity-70">Real conversations will appear here when connected to WhatsApp Business API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#0b141a] flex flex-col">
      {/* Chat Header */}
      <div className="bg-[#202c33] border-b border-[#313c42] p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className="bg-[#6b46c1] text-white">
                {chat.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-white">{chat.name}</h3>
              <p className="text-sm text-[#8696a0]">
                {chat.isOnline ? 'online' : chat.lastSeen ? `last seen ${chat.lastSeen}` : chat.phone}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-[#8696a0] hover:bg-[#2a3942]">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-[#8696a0] hover:bg-[#2a3942]">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm" className="text-[#8696a0] hover:bg-[#2a3942]">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cdefs%3e%3cpattern id=\'whatsapp-bg\' x=\'0\' y=\'0\' width=\'100\' height=\'100\' patternUnits=\'userSpaceOnUse\'%3e%3cpath d=\'M0 0h100v100H0z\' fill=\'%230a1014\'/%3e%3cpath d=\'M10 10h80v80H10z\' fill=\'none\' stroke=\'%23182229\' stroke-width=\'0.5\' opacity=\'0.1\'/%3e%3c/pattern%3e%3c/defs%3e%3crect width=\'100\' height=\'100\' fill=\'url(%23whatsapp-bg)\'/%3e%3c/svg%3e")' }}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-block bg-[#182229] px-4 py-2 rounded-lg text-[#8696a0] text-sm">
                No messages yet. Start the conversation!
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.isOutgoing ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[65%] px-3 py-2 rounded-lg shadow-sm ${
                    msg.isOutgoing
                      ? 'bg-[#005c4b] text-white rounded-br-sm'
                      : 'bg-[#202c33] text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs text-[#8696a0]">{msg.timestamp}</span>
                    {msg.isOutgoing && (
                      <div className="flex">
                        {msg.status === 'sent' && (
                          <svg width="16" height="11" className="text-[#8696a0]" viewBox="0 0 16 11">
                            <path fill="currentColor" d="m11.071 2.914-5.929 5.929-2.828-2.829L.9 6.428l4.142 4.142 7.343-7.343-1.314-1.313z"/>
                          </svg>
                        )}
                        {msg.status === 'delivered' && (
                          <svg width="18" height="11" className="text-[#8696a0]" viewBox="0 0 18 11">
                            <path fill="currentColor" d="m17.394 2.914-8.485 8.485L7.596 9.328l1.414-1.414 1.213 1.213 7.071-7.071 1.1 1.858zm-7.071 7.071L8.909 8.571 7.495 9.985 5.081 7.571 6.495 6.157l1.414 1.414z"/>
                          </svg>
                        )}
                        {msg.status === 'read' && (
                          <svg width="18" height="11" className="text-[#53bdeb]" viewBox="0 0 18 11">
                            <path fill="currentColor" d="m17.394 2.914-8.485 8.485L7.596 9.328l1.414-1.414 1.213 1.213 7.071-7.071 1.1 1.858zm-7.071 7.071L8.909 8.571 7.495 9.985 5.081 7.571 6.495 6.157l1.414 1.414z"/>
                          </svg>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="bg-[#202c33] p-4 border-t border-[#313c42]">
        <div className="flex items-end space-x-3">
          <Button variant="ghost" size="sm" className="text-[#8696a0] hover:bg-[#2a3942] mb-1">
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 bg-[#2a3942] rounded-lg px-4 py-2 min-h-[44px] flex items-center">
            <Input
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 bg-transparent border-none text-white placeholder-[#8696a0] focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm"
            />
            <Button variant="ghost" size="sm" className="text-[#8696a0] hover:bg-[#3c4a56] ml-2">
              <Smile className="h-5 w-5" />
            </Button>
          </div>

          {message.trim() ? (
            <Button 
              onClick={handleSendMessage}
              className="bg-[#00a884] hover:bg-[#008f6f] text-white rounded-full w-11 h-11 p-0 mb-1"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="text-[#8696a0] hover:bg-[#2a3942] mb-1">
              <Mic className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}