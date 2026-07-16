import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function usePendingOrdersCount() {
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingCount = useCallback(async () => {
    try {
      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (error) throw error;
      setPendingCount(count || 0);
    } catch (error) {
      console.error('Error fetching pending orders count:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingCount();

    // Set up realtime subscription
    const channel = supabase
      .channel('orders-count-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const newOrder = payload.new as { status?: string };
          if (newOrder.status === 'pending') {
            setPendingCount(prev => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const oldData = payload.old as { status?: string };
          const newData = payload.new as { status?: string };
          
          // If status changed from pending to something else
          if (oldData.status === 'pending' && newData.status !== 'pending') {
            setPendingCount(prev => Math.max(0, prev - 1));
          }
          // If status changed to pending from something else
          if (oldData.status !== 'pending' && newData.status === 'pending') {
            setPendingCount(prev => prev + 1);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          const deletedData = payload.old as { status?: string };
          if (deletedData.status === 'pending') {
            setPendingCount(prev => Math.max(0, prev - 1));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchPendingCount]);

  return { pendingCount, isLoading, refetch: fetchPendingCount };
}
