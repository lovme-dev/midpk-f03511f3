import React, { useState } from 'react';
import { ChatList } from './whatsapp/ChatList';
import { ChatConversation } from './whatsapp/ChatConversation';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isOutgoing: boolean;
  status?: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

export function WhatsAppChat() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(false);

  // Load conversations from database
  const loadConversations = async () => {
    try {
      const response = await fetch(`https://xphijmjxpgkwhtysmcxb.supabase.co/functions/v1/whatsapp-chats?action=get-conversations`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaGlqbWp4cGdrd2h0eXNtY3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDk3OTgsImV4cCI6MjA3MDA4NTc5OH0.Vav5evDk2tlzyrQJ9Iq0K01g9g8_5I9nAeEYD-l2cKQ`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setChats(data.conversations || []);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Load messages for selected conversation
  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`https://xphijmjxpgkwhtysmcxb.supabase.co/functions/v1/whatsapp-chats?action=get-messages&conversationId=${conversationId}`, {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaGlqbWp4cGdrd2h0eXNtY3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDk3OTgsImV4cCI6MjA3MDA4NTc5OH0.Vav5evDk2tlzyrQJ9Iq0K01g9g8_5I9nAeEYD-l2cKQ`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(prev => ({
          ...prev,
          [conversationId]: data.messages || []
        }));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Send message via WhatsApp Business API
  const handleSendMessage = async (messageText: string) => {
    if (!selectedChatId) return;

    setLoading(true);
    try {
      const selectedChat = chats.find(chat => chat.id === selectedChatId);
      if (!selectedChat) return;

      const response = await fetch(`https://xphijmjxpgkwhtysmcxb.supabase.co/functions/v1/whatsapp-send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwaGlqbWp4cGdrd2h0eXNtY3hiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MDk3OTgsImV4cCI6MjA3MDA4NTc5OH0.Vav5evDk2tlzyrQJ9Iq0K01g9g8_5I9nAeEYD-l2cKQ`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          phoneNumber: selectedChat.phone,
          message: messageText,
          conversationId: selectedChatId
        })
      });

      if (response.ok) {
        // Reload messages to show the sent message
        await loadMessages(selectedChatId);
        // Reload conversations to update last message
        await loadConversations();
      } else {
        console.error('Error sending message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load conversations on component mount
  React.useEffect(() => {
    loadConversations();
  }, []);

  // Load messages when conversation is selected
  React.useEffect(() => {
    if (selectedChatId) {
      loadMessages(selectedChatId);
    }
  }, [selectedChatId]);

  const selectedChat = chats.find(chat => chat.id === selectedChatId) || null;
  const selectedMessages = selectedChatId ? messages[selectedChatId] || [] : [];

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-[#111b21] border rounded-lg shadow-sm overflow-hidden">
      {/* Chat List Sidebar */}
      <div className="w-[380px] border-r border-[#313c42] flex-shrink-0">
        <ChatList
          chats={chats}
          selectedChatId={selectedChatId}
          onSelectChat={setSelectedChatId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Chat Conversation */}
      <ChatConversation
        chat={selectedChat}
        messages={selectedMessages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}