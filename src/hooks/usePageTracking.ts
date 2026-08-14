import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function usePageTracking() {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Generate or get session ID
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session', sessionId);
    }

    const trackPageView = async () => {
      try {
        // Track page view
        await supabase.from('page_views').insert({
          path: location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          user_id: user?.id || null,
          session_id: sessionId
        });

        // Update or insert live user
        await supabase.from('live_users').upsert({
          session_id: sessionId,
          user_id: user?.id || null,
          path: location.pathname,
          user_agent: navigator.userAgent,
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'session_id'
        });
      } catch (error) {
        // Silently handle tracking errors to avoid console pollution
      }
    };

    trackPageView();

    // Update live user activity every 30 seconds
    const interval = setInterval(async () => {
      try {
        await supabase.from('live_users').upsert({
          session_id: sessionId,
          user_id: user?.id || null,
          path: location.pathname,
          user_agent: navigator.userAgent,
          last_seen: new Date().toISOString()
        }, {
          onConflict: 'session_id'
        });
      } catch (error) {
        // Silently handle tracking errors to avoid console pollution
      }
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [location.pathname, user?.id]);
}