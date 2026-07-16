import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Function to get visitor IP address
async function getVisitorIP(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    return null;
  }
}

// Track analytics visit
async function trackAnalyticsVisit() {
  try {
    const ip = await getVisitorIP();
    if (!ip) return;

    const today = new Date().toISOString().split('T')[0];

    // Check if this IP already visited today to avoid duplicate unique visitors
    const { data: existingVisit } = await supabase
      .from('analytics')
      .select('id')
      .eq('ip_address', ip)
      .eq('date', today)
      .maybeSingle();

    // Only insert if no visit from this IP today
    if (!existingVisit) {
      await supabase.from('analytics').insert({
        ip_address: ip,
        date: today
      });
    }
  } catch (error) {
    console.error('Error tracking analytics visit:', error);
  }
}

export function useAnalyticsTracking() {
  useEffect(() => {
    // Track visit when component mounts (page load)
    trackAnalyticsVisit();
  }, []);
}