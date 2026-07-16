-- Fix security issue: Private Chat Conversations Could Be Read by Anyone
-- Remove the overly permissive public access policy

-- Drop existing policies on conversations table
DROP POLICY IF EXISTS "Public conversations access" ON public.conversations;

-- Create proper RLS policies for conversations
-- Users can view only their own conversations
CREATE POLICY "Users can view their own conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create conversations with their own user_id
CREATE POLICY "Users can create their own conversations"
ON public.conversations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own conversations
CREATE POLICY "Users can update their own conversations"
ON public.conversations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own conversations
CREATE POLICY "Users can delete their own conversations"
ON public.conversations
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Admins can view all conversations (for customer support)
CREATE POLICY "Admins can view all conversations"
ON public.conversations
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all conversations
CREATE POLICY "Admins can manage all conversations"
ON public.conversations
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Fix chat_messages table as well (same security issue)
DROP POLICY IF EXISTS "Public messages access" ON public.chat_messages;

-- Users can view messages from their own conversations
CREATE POLICY "Users can view their own conversation messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND conversations.user_id = auth.uid()
  )
);

-- Users can create messages in their own conversations
CREATE POLICY "Users can create messages in their own conversations"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.conversations
    WHERE conversations.id = chat_messages.conversation_id
    AND conversations.user_id = auth.uid()
  )
);

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.chat_messages
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Admins can manage all messages
CREATE POLICY "Admins can manage all messages"
ON public.chat_messages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));