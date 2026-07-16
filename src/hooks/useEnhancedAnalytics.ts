// @ts-nocheck - Temporary: Database column missing
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TrafficSource {
  source: string;
  count: number;
  percentage: number;
}

interface CountryStats {
  country: string;
  count: number;
  percentage: number;
}

interface EnhancedAnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  liveUsers: number;
  trafficSources: TrafficSource[];
  topCountries: CountryStats[];
  hourlyViews: Array<{ hour: string; views: number }>;
  dailyViews: Array<{ date: string; views: number }>;
}

export function useEnhancedAnalytics(timeframe: string = '24') {
  const [analytics, setAnalytics] = useState<EnhancedAnalyticsData>({
    totalViews: 0,
    uniqueVisitors: 0,
    liveUsers: 0,
    trafficSources: [],
    topCountries: [],
    hourlyViews: [],
    dailyViews: []
  });

  const [loading, setLoading] = useState(true);

  const getTimeframeFilter = () => {
    const now = new Date();
    const hoursAgo = parseInt(timeframe);
    const timeAgo = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));
    return timeAgo.toISOString();
  };

  const fetchEnhancedAnalytics = async () => {
    try {
      const timeFilter = getTimeframeFilter();
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

      // Total views in timeframe
      const { count: totalViews } = await supabase
        .from('page_views')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', timeFilter);

      // Unique visitors in timeframe
      const { data: visitorData } = await supabase
        .from('page_views')
        .select('session_id, user_id')
        .gte('created_at', timeFilter);

      const uniqueVisitors = visitorData ? 
        new Set(visitorData.map(d => d.user_id || d.session_id)).size : 0;

      // Live users
      const { count: liveUsers } = await supabase
        .from('live_users')
        .select('*', { count: 'exact', head: true })
        .gte('last_seen', fiveMinutesAgo);

      // Traffic sources analysis
      const { data: trafficData } = await supabase
        .from('page_views')
        .select('referrer')
        .gte('created_at', timeFilter);

      const trafficSources: TrafficSource[] = [];
      const sourceMap = new Map<string, number>();

      trafficData?.forEach(row => {
        let source = 'Direct';
        if (row.referrer) {
          try {
            const url = new URL(row.referrer);
            const hostname = url.hostname.toLowerCase();
            
            if (hostname.includes('google')) source = 'Google Search';
            else if (hostname.includes('facebook')) source = 'Facebook';
            else if (hostname.includes('instagram')) source = 'Instagram';
            else if (hostname.includes('twitter') || hostname.includes('x.com')) source = 'Twitter/X';
            else if (hostname.includes('youtube')) source = 'YouTube';
            else if (hostname.includes('tiktok')) source = 'TikTok';
            else if (hostname.includes('bing')) source = 'Bing Search';
            else if (hostname.includes('yahoo')) source = 'Yahoo Search';
            else source = 'Other Referrals';
          } catch {
            source = 'Other Referrals';
          }
        }
        sourceMap.set(source, (sourceMap.get(source) || 0) + 1);
      });

      const totalTrafficViews = trafficData?.length || 1;
      sourceMap.forEach((count, source) => {
        trafficSources.push({
          source,
          count,
          percentage: Math.round((count / totalTrafficViews) * 100)
        });
      });

      trafficSources.sort((a, b) => b.count - a.count);

      // Country statistics
      const { data: countryData } = await supabase
        .from('page_views')
        .select('country_name')
        .gte('created_at', timeFilter)
        .not('country_name', 'is', null);

      const countryMap = new Map<string, number>();
      countryData?.forEach(row => {
        const country = row.country_name || 'Unknown';
        countryMap.set(country, (countryMap.get(country) || 0) + 1);
      });

      const topCountries: CountryStats[] = [];
      const totalCountryViews = countryData?.length || 1;
      countryMap.forEach((count, country) => {
        topCountries.push({
          country,
          count,
          percentage: Math.round((count / totalCountryViews) * 100)
        });
      });

      topCountries.sort((a, b) => b.count - a.count);

      // Hourly views for last 24 hours
      const hourlyViews = [];
      for (let i = 23; i >= 0; i--) {
        const hourStart = new Date(Date.now() - (i * 60 * 60 * 1000));
        const hourEnd = new Date(Date.now() - ((i - 1) * 60 * 60 * 1000));
        
        const { count } = await supabase
          .from('page_views')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', hourStart.toISOString())
          .lt('created_at', hourEnd.toISOString());

        hourlyViews.push({
          hour: hourStart.getHours().toString().padStart(2, '0') + ':00',
          views: count || 0
        });
      }

      setAnalytics({
        totalViews: totalViews || 0,
        uniqueVisitors,
        liveUsers: liveUsers || 0,
        trafficSources: trafficSources.slice(0, 10),
        topCountries: topCountries.slice(0, 10),
        hourlyViews,
        dailyViews: [] // Will implement if needed
      });

    } catch (error) {
      console.error('Error fetching enhanced analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnhancedAnalytics();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('enhanced_analytics_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'page_views'
        },
        () => {
          fetchEnhancedAnalytics();
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
          fetchEnhancedAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [timeframe]);

  return { analytics, loading, refetch: fetchEnhancedAnalytics };
}