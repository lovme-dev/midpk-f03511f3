-- Create table for storing WhatsApp messages
CREATE TABLE public.whatsapp_messages (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id TEXT NOT NULL UNIQUE,
    sender TEXT,
    recipient TEXT,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('incoming', 'outgoing')),
    status TEXT CHECK (status IN ('sent', 'delivered', 'read', 'failed')),
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.whatsapp_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
-- Note: This assumes you have user roles system in place
CREATE POLICY "Only admins can access WhatsApp messages" 
ON public.whatsapp_messages 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = auth.uid() 
        AND role = 'admin'
    )
);

-- Create indexes for better performance
CREATE INDEX idx_whatsapp_messages_type ON public.whatsapp_messages(type);
CREATE INDEX idx_whatsapp_messages_created_at ON public.whatsapp_messages(created_at);
CREATE INDEX idx_whatsapp_messages_message_id ON public.whatsapp_messages(message_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_whatsapp_messages_updated_at
BEFORE UPDATE ON public.whatsapp_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();