-- Add SELECT policy for live_users to allow anonymous users to check their own records
-- This fixes the 401 error during upsert operations
CREATE POLICY "Users can select their own live user record"
ON public.live_users
FOR SELECT
USING ((auth.uid() = user_id) OR ((auth.uid() IS NULL) AND (user_id IS NULL)));