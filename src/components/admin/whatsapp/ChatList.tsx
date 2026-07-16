import React from 'react';
import { Search, Archive, MoreVertical } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  avatar?: string;
  isOnline?: boolean;
}

interface ChatListProps {
  chats: Chat[];
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ChatList({ chats, selectedChatId, onSelectChat, searchQuery, onSearchChange }: ChatListProps) {
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-[#111b21] text-white flex flex-col">
      {/* Header */}
      <div className="p-4 bg-[#202c33] border-b border-[#313c42]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Chats</h2>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="text-[#8696a0] hover:bg-[#2a3942]">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#8696a0]" />
          <Input
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-[#2a3942] border-none text-white placeholder-[#8696a0] focus-visible:ring-1 focus-visible:ring-[#00a884]"
          />
        </div>
      </div>

      {/* Archived */}
      <div className="px-4 py-3 hover:bg-[#2a3942] cursor-pointer border-b border-[#313c42]">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-[#00a884] rounded-full flex items-center justify-center">
            <Archive className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-medium">Archived</p>
          </div>
          <span className="text-[#00a884] text-sm font-medium">
            {chats.filter(c => c.unreadCount && c.unreadCount > 0).length || ''}
          </span>
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="space-y-0">
          {filteredChats.length === 0 ? (
            <div className="p-8 text-center text-[#8696a0]">
              <p>No chats found</p>
              <p className="text-sm mt-1">WhatsApp Business API will load chats here</p>
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-4 hover:bg-[#2a3942] cursor-pointer border-b border-[#313c42] ${
                  selectedChatId === chat.id ? 'bg-[#2a3942]' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar} alt={chat.name} />
                      <AvatarFallback className="bg-[#6b46c1] text-white">
                        {chat.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00a884] border-2 border-[#111b21] rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white truncate">{chat.name}</h3>
                      <span className="text-xs text-[#8696a0] flex-shrink-0">{chat.timestamp}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#8696a0] truncate flex-1 mr-2">{chat.lastMessage}</p>
                      {chat.unreadCount && chat.unreadCount > 0 && (
                        <span className="bg-[#00a884] text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                          {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}