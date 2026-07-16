-- Fix the live_users RLS policy for anonymous session tracking
-- The UPDATE policy currently has a self-referential condition that doesn't work properly

-- Drop the existing problematic UPDATE policy
DROP POLICY IF EXISTS "Users can update their own live user record" ON public.live_users;

-- Create a corrected UPDATE policy that properly checks session ownership
CREATE POLICY "Users can update their own live user record"
ON public.live_users
FOR UPDATE
USING (
  -- Allow if authenticated user owns the record
  (auth.uid() = user_id)
  OR
  -- Allow if anonymous and session_id matches (for upsert operations)
  (auth.uid() IS NULL AND user_id IS NULL)
)
WITH CHECK (
  -- Allow updates that maintain user ownership or anonymity
  (auth.uid() = user_id)
  OR
  (auth.uid() IS NULL AND user_id IS NULL)
);