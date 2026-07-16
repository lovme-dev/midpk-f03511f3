-- Update the assign_default_role function to recognize ayubkhanzsa@gmail.com as admin
CREATE OR REPLACE FUNCTION public.assign_default_role(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_email TEXT;
BEGIN
  SELECT email INTO user_email FROM auth.users WHERE id = p_user_id;
  
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = p_user_id) THEN
    IF user_email = 'ayubkhanzsa@gmail.com' THEN
      INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'admin');
    ELSE
      INSERT INTO public.user_roles (user_id, role) VALUES (p_user_id, 'user');
    END IF;
  END IF;
END;
$function$;

-- Manually assign admin role to existing user
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'ayubkhanzsa@gmail.com';
  
  IF v_user_id IS NOT NULL THEN
    -- Delete existing role if any
    DELETE FROM public.user_roles WHERE user_id = v_user_id;
    -- Insert admin role
    INSERT INTO public.user_roles (user_id, role) VALUES (v_user_id, 'admin');
  END IF;
END $$;