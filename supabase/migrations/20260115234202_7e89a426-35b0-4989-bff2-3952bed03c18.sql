-- Create saved_cards table for storing encrypted user payment cards
CREATE TABLE public.saved_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  card_last_four VARCHAR(4) NOT NULL,
  card_type VARCHAR(20) NOT NULL DEFAULT 'visa',
  expiry_month VARCHAR(2) NOT NULL,
  expiry_year VARCHAR(2) NOT NULL,
  cardholder_name TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_cards ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved cards" 
ON public.saved_cards 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved cards" 
ON public.saved_cards 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved cards" 
ON public.saved_cards 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved cards" 
ON public.saved_cards 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_cards_updated_at
BEFORE UPDATE ON public.saved_cards
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();