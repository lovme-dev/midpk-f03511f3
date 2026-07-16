-- Update all functions to have proper search_path set
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.assign_default_role(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = p_user_id;
  
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id) THEN
    IF user_email = 'admin@example.com' THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'admin');
    ELSE
      INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'user');
    END IF;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_admin_id UUID,
  p_action_type TEXT,
  p_target_id TEXT DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_actions (admin_id, action_type, target_id, details)
  VALUES (p_admin_id, p_action_type, p_target_id, p_details);
END;
$$;