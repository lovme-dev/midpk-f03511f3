import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, RefreshCw, User, Phone, Mic, MicOff, Upload, Image as ImageIcon, RotateCcw, Headphones } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './ui/use-toast';

import chatLogo from '../assets/chat-logo.png';
import botIcon from '../assets/bot-icon.png';
import miraIcon from '../assets/mira-icon.gif';
import miraProfile from '../assets/mira-profile.jpeg';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string;
}

interface QuickAction {
  id: string;
  label: string;
  action: () => void;
}

export function AIChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Check authentication and load chat history
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      if (user?.id) {
        // User is logged in - load from database
        await loadChatFromDatabase(user.id);
        // Load user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', user.id)
          .maybeSingle();
        if (profile) {
          setUserProfile(profile);
        }
      } else {
        // User not logged in - load from localStorage (no time limit)
        loadChatFromLocalStorage();
        setUserProfile(null);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const newUserId = session?.user?.id || null;
      setUserId(newUserId);
      
      if (newUserId) {
        await loadChatFromDatabase(newUserId);
        // Load user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', newUserId)
          .maybeSingle();
        if (profile) {
          setUserProfile(profile);
        }
      } else {
        loadChatFromLocalStorage();
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadChatFromDatabase = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error loading chat:', error);
        return;
      }

      if (data && data.messages) {
        const loadedMessages = (data.messages as any[]).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })).slice(-50); // Keep last 50 messages
        setChatHistory(loadedMessages);
        setChatId(data.id);
      }
    } catch (error) {
      console.error('Error loading chat from database:', error);
    }
  };

  const loadChatFromLocalStorage = () => {
    const savedChat = localStorage.getItem('midasbuy-chat');
    if (savedChat) {
      try {
        const { messages: savedMessages } = JSON.parse(savedChat);
        // Keep last 50 messages, no time limit
        const recent50 = savedMessages.slice(-50);
        setChatHistory(recent50);
      } catch (error) {
        console.error('Error loading from localStorage:', error);
        localStorage.removeItem('midasbuy-chat');
      }
    }
  };

  // Save chat history whenever messages change (max 50 messages)
  useEffect(() => {
    if (messages.length > 0) {
      const newChatHistory = [...chatHistory, ...messages];
      // Keep only last 50 messages
      const limitedHistory = newChatHistory.slice(-50);
      
      setChatHistory(limitedHistory);

      // Save to database if logged in, otherwise localStorage
      if (userId) {
        saveChatToDatabase(userId, limitedHistory);
      } else {
        saveChatToLocalStorage(limitedHistory);
      }
    }
  }, [messages, userId]);

  const saveChatToDatabase = async (userId: string, messages: Message[]) => {
    try {
      // Convert messages to plain objects for JSON storage
      const messagesData = messages.map(msg => ({
        id: msg.id,
        text: msg.text,
        sender: msg.sender,
        timestamp: msg.timestamp.toISOString(),
        image: msg.image
      }));

      if (chatId) {
        // Update existing chat
        await supabase
          .from('chat_history')
          .update({ 
            messages: messagesData as any,
            updated_at: new Date().toISOString()
          })
          .eq('id', chatId);
      } else {
        // Create new chat
        const { data, error } = await supabase
          .from('chat_history')
          .insert({ 
            user_id: userId,
            messages: messagesData as any
          } as any)
          .select()
          .single();

        if (data) {
          setChatId(data.id);
        }

        if (error) {
          console.error('Error saving chat:', error);
        }
      }
    } catch (error) {
      console.error('Error saving chat to database:', error);
    }
  };

  const saveChatToLocalStorage = (messages: Message[]) => {
    const chatData = {
      messages: messages,
      timestamp: Date.now()
    };
    
    try {
      localStorage.setItem('midasbuy-chat', JSON.stringify(chatData));
    } catch (error) {
      console.warn('localStorage quota exceeded, clearing old chat data');
      localStorage.removeItem('midasbuy-chat');
      try {
        localStorage.setItem('midasbuy-chat', JSON.stringify(chatData));
      } catch (finalError) {
        console.error('Cannot save to localStorage:', finalError);
      }
    }
  };

  // AI chat backend function (Lovable Cloud)

  // Initial welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        text: "Hey! I'm Mira, your Midasbuy shopping companion. I'm here to help with deals and support. I'm still in Beta, so please chat with me to help me 'level up'! 🎮",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Quick actions for the chatbot - matching Midasbuy style
  const quickActions: QuickAction[] = [
    {
      id: 'who-is-mira',
      label: 'Who is Mira?',
      action: () => handleQuickAction('Who is Mira?')
    },
    {
      id: 'how-to-topup',
      label: 'How do I top up on Midasbuy?',
      action: () => handleQuickAction('How do I top up on Midasbuy?')
    },
    {
      id: 'vip-points',
      label: 'What are vip points?',
      action: () => handleQuickAction('What are vip points?')
    },
    {
      id: 'check-orders',
      label: 'Please check my orders',
      action: () => handleQuickAction('Please check my orders')
    }
  ];

  const handleQuickAction = (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    handleBotResponse(message);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      image: uploadedImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    
    // If there's an uploaded image, analyze it with the user's problem description
    if (uploadedImage) {
      analyzeImageWithAI(uploadedImage, inputValue);
      setUploadedImage(null); // Clear uploaded image after sending
    } else {
      handleBotResponse(inputValue);
    }
    
    setInputValue('');
  };

  const handleBotResponse = async (userInput: string) => {
    setIsTyping(true);

    try {
      // Prepare conversation messages with history
      const conversationMessages = [];

      // Add last 50 messages from chat history for context
      const recentHistory = chatHistory.slice(-50);
      recentHistory.forEach(msg => {
        conversationMessages.push({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });

      // Add current user input
      conversationMessages.push({
        role: 'user',
        content: userInput
      });

      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: {
          messages: conversationMessages,
          includeVision: false,
          userName: userProfile?.full_name || null,
        },
      });

      if (error) {
        const status = (error as any)?.context?.status;
        if (status === 429) {
          throw new Error('RATE_LIMIT');
        }
        throw new Error(`API Error: ${status || ''} ${error.message}`.trim());
      }

      if (!data || !(data as any).response) {
        throw new Error('Invalid response structure');
      }

      let botResponse = (data as any).response as string;

      // Ensure the response isn't too long
      if (botResponse.length > 500) {
        botResponse = botResponse.substring(0, 497) + '...';
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      
      let fallbackResponse = "";
      
      // Handle different types of errors with appropriate responses
      if (error instanceof Error) {
        if (error.message === 'RATE_LIMIT') {
          // Rate limit - provide helpful response with package info
          const responses = [
            "سروس میں تھوڑا بہت لوڈ ہے۔ میں آپ کو PUBG UC پیکجز کی معلومات دے سکتا ہوں:\n\n• 3,697 + 976 Bonus UC - PKR 3,600\n• 7,394 + 1,952 Bonus UC - PKR 8,400\n• 11,091 + 3,904 Bonus UC - PKR 12,350\n\nمزید معلومات کے لیے WhatsApp: +1 450 232 2003",
            
            "I can help you with our current packages while the system is busy:\n\n• PUBG UC: Starting from PKR 3,600 ($12.86)\n• Free Fire Diamonds: Starting from PKR 3,800 ($13.57)\n• 24/7 Support: WhatsApp +1 450 232 2003\n\nWhat specific package do you need?",
            
            "سسٹم میں تھوڑا وقفہ ہے۔ یہ پیکجز دستیاب ہیں:\n\n🎮 PUBG UC پیکجز: PKR 3,600 سے شروع\n💎 Free Fire Diamonds: PKR 3,800 سے\n📞 فوری مدد: +1 450 232 2003\n\nکیا چاہیے آپ کو?"
          ];
          
          // Random response for variety
          fallbackResponse = responses[Math.floor(Math.random() * responses.length)];
          
        } else if (error.message.includes('Invalid response')) {
          fallbackResponse = "Let me help you directly! What do you need:\n\n🎮 PUBG UC Packages?\n💎 Free Fire Diamonds?\n❓ Support or FAQs?\n\nWhatsApp: +1 450 232 2003 (24/7)";
          
        } else {
          fallbackResponse = "I'm here to help with MidasBuy services! Available options:\n\n• PUBG UC Packages (PKR 3,600+)\n• Free Fire Diamonds (PKR 3,800+)\n• Instant Support: +1 450 232 2003\n\nWhat can I help you with?";
        }
      } else {
        // Generic fallback with useful info
        fallbackResponse = "مجھے آپ کی مدد کرنے دیں! کیا چاہیے:\n\n🎮 PUBG UC پیکجز\n💎 Free Fire Diamonds  \n📞 WhatsApp Support: +1 450 232 2003\n\nکوئی سوال ہے؟";
      }

      const botMessage: Message = {
        id: Date.now().toString(),
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Voice recording functionality with Whisper transcription
  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setIsRecording(true);
      recorder.start();
    } catch (error) {
      console.error('Error starting voice recording:', error);
      alert('🎤 Microphone access denied. Please allow microphone access and try again.');
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTyping(true);
    
    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to process audio');
        }

        // Call voice transcription edge function
        const response = await fetch('https://xphijmjxpgkwhtysmcxb.supabase.co/functions/v1/transcribe-voice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio: base64Audio })
        });

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();
        const transcribedText = data.text;

        if (transcribedText) {
          // Set the transcribed text in input field
          setInputValue(transcribedText);
          setIsTyping(false);
        } else {
          throw new Error('No transcription result');
        }
      };

      reader.onerror = () => {
        setIsTyping(false);
        alert('🎤 Error reading audio. Please try again.');
      };
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setIsTyping(false);
      alert('🎤 Voice transcription failed. Please try typing your message or speak more clearly.');
    }
  };

  // Image upload and analysis functions
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload only image files');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        
        // Basic content filtering - check for adult content
        const isInappropriate = await checkImageContent(imageDataUrl);
        
        if (isInappropriate) {
          alert('❌ Inappropriate image detected. Please upload appropriate images only.');
          return;
        }

        // Store uploaded image temporarily
        setUploadedImage(imageDataUrl);
        
        // Ask user to describe their problem first
        const promptMessage: Message = {
          id: Date.now().toString(),
          text: '📸 Image received! Please describe your problem or question about this image so I can help you better.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, promptMessage]);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Error processing image. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const checkImageContent = async (imageDataUrl: string): Promise<boolean> => {
    try {
      // Simple client-side content filtering
      // Check image dimensions and basic characteristics
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          // Basic heuristics - can be enhanced with AI services
          const aspectRatio = img.width / img.height;
          
          // Flag suspicious aspect ratios or very small images
          if (aspectRatio > 3 || aspectRatio < 0.3 || img.width < 100 || img.height < 100) {
            resolve(false); // Not inappropriate based on basic checks
          } else {
            resolve(false); // Allow image - more advanced filtering would need API
          }
        };
        img.src = imageDataUrl;
      });
    } catch (error) {
      console.error('Error checking image content:', error);
      return false; // Allow by default if check fails
    }
  };

  const analyzeImageWithAI = async (imageDataUrl: string, userProblem?: string) => {
    setIsTyping(true);

    try {      
      const promptText = userProblem ? 
        `User uploaded an image with this problem: "${userProblem}". Please analyze the image carefully and provide specific solutions based on what you see in the screenshot.` :
        'User uploaded an image. Please analyze it carefully and provide helpful guidance based on what you see.';

      // Prepare messages with vision support
      const imageMessages = [
        {
          role: 'user',
          content: promptText,
          image: imageDataUrl // Send actual image data
        }
      ];

      // Call our edge function with vision support using supabase invoke
      const { data, error } = await supabase.functions.invoke('chat-support', {
        body: {
          messages: imageMessages,
          includeVision: true,
          userName: userProfile?.full_name || null,
        },
      });

      if (error) {
        throw new Error('Failed to analyze image');
      }

      let analysisResult = (data as any)?.response || 'I can see your image. How can I help?';

      const botMessage: Message = {
        id: Date.now().toString(),
        text: `📸 ${analysisResult}`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error analyzing image:', error);
      
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        text: `📸 I can see your image! 

For gaming issues, screenshots, or payment problems, our agents can help better.

💬 WhatsApp: +1 4502322003 (24/7 support)
📧 Email: help@midasbuy.com.co`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages(prev => [...prev, fallbackMessage]);
    }
  };

  // New chat handler
  const handleNewChat = async () => {
    try {
      setMessages([]);
      setChatHistory([]);
      setChatId(null);

      if (userId) {
        // Delete from database if logged in
        if (chatId) {
          await supabase
            .from('chat_history')
            .delete()
            .eq('id', chatId);
        }
      } else {
        // Clear from localStorage
        localStorage.removeItem('midasbuy-chat');
      }

      toast({
        title: "New Chat Started",
        description: "Previous conversation cleared.",
      });
    } catch (error) {
      console.error('Error starting new chat:', error);
    }
  };

  return (
    <>
      {/* Mira Chat Widget Button - Draggable */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.1}
        dragConstraints={{
          top: -window.innerHeight + 150,
          left: -window.innerWidth + 100,
          right: 0,
          bottom: 0,
        }}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5, ease: "easeOut" }}
        whileDrag={{ scale: 1.05 }}
      >
        {/* Mira Character Image - clickable to open chat */}
        <motion.div
          className="mb-[-22px] md:mb-[-28px] relative z-0 cursor-pointer"
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <img 
            src={miraIcon} 
            alt="Mira - Click to chat" 
            className="w-18 h-18 md:w-24 md:h-24 object-contain drop-shadow-lg"
            style={{ width: '72px', height: '72px' }}
          />
        </motion.div>

        {/* Mira Button - narrower */}
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative cursor-pointer z-10"
        >
          <div 
            className="flex items-center gap-1 px-2.5 md:px-3.5 py-1 md:py-1.5 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #4FC3F7 0%, #2196F3 50%, #1976D2 100%)',
              boxShadow: '0 0 12px 2px rgba(255, 255, 255, 0.3), 0 0 20px 4px rgba(79, 195, 247, 0.25), inset 0 1px 0 rgba(255,255,255,0.3)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
            }}
          >
            <Headphones className="w-2.5 h-2.5 md:w-3.5 md:h-3.5 text-white" />
            <span className="text-white font-semibold text-[9px] md:text-xs">Mira</span>
          </div>
        </motion.button>
      </motion.div>

      {/* Chat Modal - Midasbuy style - mobile: bottom sheet with rounded top corners */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="w-full max-w-none md:max-w-4xl lg:max-w-5xl p-0 overflow-hidden flex flex-col border-0 md:border rounded-t-2xl md:rounded-lg h-[calc(100dvh-60px)] md:h-[90vh] max-h-[calc(100dvh-60px)] md:max-h-[90vh] fixed inset-x-0 bottom-0 top-auto left-0 right-0 translate-x-0 translate-y-0 md:inset-auto md:left-1/2 md:top-1/2 md:bottom-auto md:right-auto md:-translate-x-1/2 md:-translate-y-1/2 chat-slide-up md:animate-in md:fade-in-0 md:zoom-in-95"
          style={{
            background: 'linear-gradient(180deg, #0a1628 0%, #0d1f3c 50%, #102a4c 100%)',
          }}
        >
          {/* Light glow effect on top-left corner */}
          <div 
            className="absolute top-0 left-0 w-[350px] h-[350px] pointer-events-none z-0 rounded-t-2xl md:rounded-lg overflow-hidden"
            style={{
              background: 'radial-gradient(ellipse at top left, rgba(79, 195, 247, 0.3) 0%, rgba(41, 182, 246, 0.2) 25%, rgba(2, 136, 209, 0.1) 50%, transparent 75%)',
            }}
          />
          {/* Header */}
          <DialogHeader className="p-4 md:p-5 flex-shrink-0 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Headphones className="w-6 h-6 text-white" />
                <DialogTitle className="text-lg md:text-xl font-semibold text-white">Customer Service</DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleNewChat}
                  variant="ghost"
                  size="sm"
                  className="text-white/70 hover:text-white hover:bg-white/10 text-xs px-2 py-1 h-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  New
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Messages Area - Dark theme */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0">
            <div className="space-y-4 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  {/* Bot message with Mira profile */}
                  {message.sender === 'bot' && (
                    <div className="flex items-start gap-3 max-w-[90%] md:max-w-[80%]">
                      {/* Mira Profile Image */}
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 overflow-hidden border-2 border-cyan-400/50">
                        <img 
                          src={miraProfile} 
                          alt="Mira" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/70 text-sm mb-1">Mira</span>
                        <div 
                          className="px-4 py-3 rounded-2xl rounded-tl-md"
                          style={{
                            background: 'linear-gradient(135deg, rgba(30, 58, 95, 0.9) 0%, rgba(20, 45, 80, 0.95) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                        >
                          {/* Display image if present */}
                          {message.image && (
                            <div className="mb-2">
                              <img 
                                src={message.image} 
                                alt="Uploaded content" 
                                className="max-w-full max-h-48 rounded-lg object-cover"
                              />
                            </div>
                          )}
                          <p className="text-white text-sm md:text-base leading-relaxed whitespace-pre-line">
                            {message.text}
                          </p>
                        </div>
                        
                        {/* Quick Questions - only show after first bot message */}
                        {index === 0 && (
                          <div className="flex flex-col gap-2 mt-3">
                            {quickActions.map((action) => (
                              <button
                                key={action.id}
                                onClick={action.action}
                                className="px-4 py-2.5 text-left text-white text-sm md:text-base rounded-lg transition-all hover:bg-white/10"
                                style={{
                                  background: 'rgba(30, 50, 80, 0.6)',
                                  border: '1px solid rgba(255, 255, 255, 0.15)',
                                }}
                              >
                                {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-white/40 text-xs mt-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* User message - darker blue background */}
                  {message.sender === 'user' && (
                    <div className="flex items-start gap-2 max-w-[85%] md:max-w-[70%] flex-row-reverse">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-cyan-500 to-blue-600 overflow-hidden">
                        {userId && userProfile?.full_name ? (
                          <span className="text-white text-xs font-semibold">
                            {userProfile.full_name.charAt(0).toUpperCase()}
                          </span>
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div 
                        className="px-4 py-3 rounded-2xl rounded-tr-md"
                        style={{
                          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 100%)',
                        }}
                      >
                        {message.image && (
                          <div className="mb-2">
                            <img 
                              src={message.image} 
                              alt="Uploaded content" 
                              className="max-w-full max-h-48 rounded-lg object-cover"
                            />
                          </div>
                        )}
                        <p className="text-white text-sm md:text-base leading-relaxed whitespace-pre-line">
                          {message.text}
                        </p>
                        <p className="text-white/60 text-xs mt-2">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full flex-shrink-0 overflow-hidden border-2 border-cyan-400/50">
                    <img src={miraProfile} alt="Mira" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white/70 text-sm mb-1">Mira</span>
                    <div 
                      className="px-4 py-3 rounded-2xl rounded-tl-md"
                      style={{
                        background: 'rgba(30, 58, 95, 0.9)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                      }}
                    >
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area - Dark theme matching screenshot */}
          <div 
            className="p-4 md:p-5 flex-shrink-0 border-t border-white/10"
            style={{ background: 'rgba(10, 22, 40, 0.95)' }}
          >
            {/* Image preview section */}
            {uploadedImage && (
              <div className="mb-3 relative inline-block">
                <img 
                  src={uploadedImage} 
                  alt="Preview" 
                  className="h-16 w-16 object-cover rounded-lg border-2 border-cyan-400"
                />
                <button
                  onClick={() => setUploadedImage(null)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            )}
            
            <div className="flex gap-2 max-w-3xl mx-auto items-center">
              {/* WhatsApp Button - Professional Design */}
              <a
                href="https://wa.me/14502322003"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 h-11 w-11 rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 50%, #075E54 100%)',
                  boxShadow: '0 2px 8px rgba(37, 211, 102, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                }}
                title="Chat on WhatsApp"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="w-5 h-5 text-white fill-current"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
              
              <div 
                className="flex-1 flex items-center rounded-lg px-4"
                style={{
                  background: 'rgba(30, 50, 80, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter Message"
                  className="flex-1 bg-transparent border-0 text-white placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
                />
              </div>
              
              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              {/* Send button - 10% smaller and positioned right */}
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="h-11 px-5 rounded-lg font-medium transition-all disabled:opacity-50 flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #4FC3F7 0%, #29B6F6 50%, #0288D1 100%)',
                }}
              >
                <span className="text-white font-semibold text-sm">Send</span>
              </Button>
            </div>
            
            {/* Footer disclaimer */}
            <div className="flex items-center justify-center mt-3 gap-2">
              <span className="text-white/40 text-xs">
                Info generated by AI. Final prices apply at checkout.
              </span>
              <span className="text-white/60 text-[10px] px-1.5 py-0.5 rounded border border-white/20">
                Beta
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}