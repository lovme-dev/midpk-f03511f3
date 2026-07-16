import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  liveUsers: number;
}

export function useRealTimeAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    liveUsers: 0
  });

  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      // Total website views from page_views table
      const { count: totalViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true });

      // Unique visitors today from page_views (distinct by session_id)
      const { data: todayData } = await supabase
        .from('page_views')
        .select('session_id, user_id')
        .gte('created_at', today + 'T00:00:00Z')
        .lt('created_at', today + 'T23:59:59Z');

      const uniqueVisitors = todayData ? 
        new Set(todayData.map(d => d.user_id || d.session_id)).size : 0;

      // Live users from live_users table (last 5 minutes)
      const { count: liveUsers } = await supabase
        .from('live_users')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', fiveMinutesAgo);

      setAnalytics({
        totalViews: totalViews || 0,
        uniqueVisitors: uniqueVisitors || 0,
        liveUsers: liveUsers || 0
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAnalytics();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_views'
        },
        () => {
          fetchAnalytics();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'live_users'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { analytics, loading, refetch: fetchAnalytics };
}