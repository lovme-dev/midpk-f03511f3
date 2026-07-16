import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function useUserRole() {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkRole = useCallback(async () => {
    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      // Ensure default role assignment (admin for specific emails, else user)
      try {
        await supabase.rpc('assign_default_role', { p_user_id: user.id });
      } catch (e) {
        // Ignore errors from assign_default_role
      }

      // Ask the DB if the user has admin role
      const { data, error } = await supabase.rpc('has_role', { _user_id: user.id, _role: 'admin' });
      if (error) {
        console.error('has_role rpc error:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(!!data);
      }
    } catch (e) {
      console.error('Role check failed:', e);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    // Wait for auth to finish loading before checking role
    if (authLoading) {
      setLoading(true);
      return;
    }

    setLoading(true);
    checkRole();
  }, [user, authLoading, checkRole]);

  // Refresh function to manually re-check role
  const refreshRole = useCallback(() => {
    setLoading(true);
    checkRole();
  }, [checkRole]);

  return { isAdmin, loading, refreshRole };
}
