-- Add currency_code column to admin_notification_history table
ALTER TABLE public.admin_notification_history ADD COLUMN IF NOT EXISTS currency_code text DEFAULT 'PKR';