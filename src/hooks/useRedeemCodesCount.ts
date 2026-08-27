import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useRedeemCodesCount(isSectionActive = false) {
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingCount = useCallback(async () => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      let lastViewedAt: string | null = null;
      if (userId) {
        const { data: readState } = await supabase
          .from('admin_section_reads')
          .select('last_viewed_at')
          .eq('user_id', userId)
          .eq('section_key', 'redeem_codes')
          .maybeSingle();
        lastViewedAt = readState?.last_viewed_at || null;
      }
      let query = supabase
        .from('redeem_codes')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (lastViewedAt) query = query.gt('created_at', lastViewedAt);
      const { count, error } = await query;

      if (error) throw error;
      setPendingCount(count || 0);
    } catch (error) {
      console.error('Error fetching pending redeem codes count:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markViewed = useCallback(async () => {
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) return;
    const { error } = await supabase.from('admin_section_reads').upsert({
      user_id: userId,
      section_key: 'redeem_codes',
      last_viewed_at: new Date().toISOString(),
    }, { onConflict: 'user_id,section_key' });
    if (!error) setPendingCount(0);
  }, []);

  useEffect(() => {
    fetchPendingCount();

    // Set up realtime subscription
    const channel = supabase
      .channel('redeem-codes-count-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'redeem_codes',
        },
        () => { void (isSectionActive ? markViewed() : fetchPendingCount()); }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'redeem_codes',
        },
        () => { void (isSectionActive ? markViewed() : fetchPendingCount()); }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'redeem_codes',
        },
        () => { void fetchPendingCount(); }
      )
      .subscribe();

    const interval = window.setInterval(fetchPendingCount, 15_000);

    return () => {
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [fetchPendingCount, isSectionActive, markViewed]);

  useEffect(() => {
    if (isSectionActive) void markViewed();
  }, [isSectionActive, markViewed]);

  return { pendingCount, isLoading, refetch: fetchPendingCount };
}
