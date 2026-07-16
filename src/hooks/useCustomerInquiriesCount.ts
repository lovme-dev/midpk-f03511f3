import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Simple notification sound using Web Audio API
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.log('Could not play notification sound:', error);
  }
};

export function useCustomerInquiriesCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('customer_inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false);

      if (error) throw error;
      setUnreadCount(count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnreadCount();

    // Set up realtime subscription
    const channel = supabase
      .channel('customer-inquiries-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customer_inquiries',
        },
        (payload) => {
          // New inquiry received
          setUnreadCount(prev => prev + 1);
          playNotificationSound();
          
          const newInquiry = payload.new as { name?: string; subject?: string };
          toast({
            title: '🔔 New Customer Inquiry',
            description: `${newInquiry.name || 'Someone'} sent: "${newInquiry.subject || 'New message'}"`,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_inquiries',
        },
        (payload) => {
          // If marked as read, decrement count
          const oldData = payload.old as { is_read?: boolean };
          const newData = payload.new as { is_read?: boolean };
          
          if (!oldData.is_read && newData.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'customer_inquiries',
        },
        (payload) => {
          const deletedData = payload.old as { is_read?: boolean };
          if (!deletedData.is_read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchUnreadCount, toast]);

  return { unreadCount, isLoading, refetch: fetchUnreadCount };
}
