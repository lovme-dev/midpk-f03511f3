ALTER TABLE public.redeem_codes
  ADD COLUMN IF NOT EXISTS player_id TEXT,
  ADD COLUMN IF NOT EXISTS username TEXT,
  ADD COLUMN IF NOT EXISTS redeem_code TEXT,
  ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reviewed_by UUID,
  ADD COLUMN IF NOT EXISTS notes TEXT;

UPDATE public.redeem_codes SET redeem_code = code WHERE redeem_code IS NULL AND code IS NOT NULL;
ALTER TABLE public.redeem_codes ALTER COLUMN code DROP NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS redeem_codes_redeem_code_key ON public.redeem_codes(redeem_code) WHERE redeem_code IS NOT NULL;

ALTER TABLE public.notifications
  ADD COLUMN IF NOT EXISTS sent_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS icon_url TEXT,
  ADD COLUMN IF NOT EXISTS action_url TEXT;

UPDATE public.notifications SET sent_at = COALESCE(sent_at, created_at, now()) WHERE sent_at IS NULL;

ALTER TABLE public.user_notifications
  ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS delivered BOOLEAN DEFAULT true;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'user_notifications'
      AND constraint_name = 'user_notifications_notification_id_fkey'
  ) THEN
    ALTER TABLE public.user_notifications
      ADD CONSTRAINT user_notifications_notification_id_fkey
      FOREIGN KEY (notification_id) REFERENCES public.notifications(id) ON DELETE CASCADE;
  END IF;
END $$;

ALTER TABLE public.pubg_accounts
  ADD COLUMN IF NOT EXISTS discount NUMERIC DEFAULT 0;

DROP FUNCTION IF EXISTS public.grant_role_by_email(text, public.app_role);
DROP FUNCTION IF EXISTS public.grant_role_by_email(text, text);
CREATE OR REPLACE FUNCTION public.grant_role_by_email(user_email TEXT, target_role public.app_role)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_user_id UUID;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('success', false, 'message', 'Admin access required');
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(user_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.profiles WHERE lower(email) = lower(user_email) LIMIT 1;
  END IF;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not found');
  END IF;

  INSERT INTO public.user_roles(user_id, role) VALUES (v_user_id, target_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN jsonb_build_object('success', true, 'message', 'Role granted successfully');
END;
$$;

DROP FUNCTION IF EXISTS public.revoke_role_by_email(text, public.app_role);
DROP FUNCTION IF EXISTS public.revoke_role_by_email(text, text);
CREATE OR REPLACE FUNCTION public.revoke_role_by_email(user_email TEXT, target_role public.app_role)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_user_id UUID;
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN jsonb_build_object('success', false, 'message', 'Admin access required');
  END IF;

  SELECT id INTO v_user_id FROM auth.users WHERE lower(email) = lower(user_email) LIMIT 1;
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM public.profiles WHERE lower(email) = lower(user_email) LIMIT 1;
  END IF;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'message', 'User not found');
  END IF;

  DELETE FROM public.user_roles WHERE user_id = v_user_id AND role = target_role;
  RETURN jsonb_build_object('success', true, 'message', 'Role revoked successfully');
END;
$$;

DROP FUNCTION IF EXISTS public.submit_redeem_code(text, uuid);
DROP FUNCTION IF EXISTS public.submit_redeem_code(text, text, text);
CREATE OR REPLACE FUNCTION public.submit_redeem_code(
  p_player_id TEXT,
  p_redeem_code TEXT,
  p_username TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_existing_status TEXT;
BEGIN
  SELECT status INTO v_existing_status
  FROM public.redeem_codes
  WHERE redeem_code = p_redeem_code OR code = p_redeem_code
  LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object('success', false, 'duplicate', true, 'status', COALESCE(v_existing_status, 'pending'));
  END IF;

  INSERT INTO public.redeem_codes (player_id, redeem_code, code, username, status, user_id)
  VALUES (p_player_id, p_redeem_code, p_redeem_code, p_username, 'pending', auth.uid());

  RETURN jsonb_build_object('success', true, 'duplicate', false, 'status', 'pending');
EXCEPTION WHEN unique_violation THEN
  RETURN jsonb_build_object('success', false, 'duplicate', true, 'status', 'pending');
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_role_by_email(TEXT, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_role_by_email(TEXT, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_redeem_code(TEXT, TEXT, TEXT) TO anon, authenticated;