-- Insert the new WhatsApp number
INSERT INTO whatsapp_settings (phone_number, is_active) 
VALUES ('+447476966269', true);

-- Deactivate any other active numbers
UPDATE whatsapp_settings 
SET is_active = false 
WHERE phone_number != '+447476966269';