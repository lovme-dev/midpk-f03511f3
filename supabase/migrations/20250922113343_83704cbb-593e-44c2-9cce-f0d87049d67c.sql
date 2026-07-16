-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin can view all conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "Admin can create conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "Admin can update conversations" ON public.whatsapp_conversations;
DROP POLICY IF EXISTS "Admin can view all messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Admin can create messages" ON public.whatsapp_messages;
DROP POLICY IF EXISTS "Admin can update messages" ON public.whatsapp_messages;

-- Create basic policies for admin access only
CREATE POLICY "Admins can manage conversations" 
ON public.whatsapp_conversations 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);

CREATE POLICY "Admins can manage messages" 
ON public.whatsapp_messages 
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
  )
);