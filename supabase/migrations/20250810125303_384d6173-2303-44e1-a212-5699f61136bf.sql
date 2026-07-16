-- Create RPC to grant a role by email
CREATE OR REPLACE FUNCTION public.grant_role_by_email(user_email text, target_role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  uid uuid;
BEGIN
  -- Find user id from profiles
  SELECT id INTO uid FROM public.profiles WHERE lower(email) = lower(user_email);
  IF uid IS NULL THEN
    RETURN FALSE; -- No such user
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, target_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN TRUE;
END;
$function$;

-- Create RPC to revoke a role by email
CREATE OR REPLACE FUNCTION public.revoke_role_by_email(user_email text, target_role public.app_role)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  uid uuid;
BEGIN
  SELECT id INTO uid FROM public.profiles WHERE lower(email) = lower(user_email);
  IF uid IS NULL THEN
    RETURN FALSE; -- No such user
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = uid AND role = target_role;

  RETURN TRUE;
END;
$function$;

-- Create RPC to list admins (email, user_id, since)
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id uuid, email text, since timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
  SELECT ur.user_id, p.email, ur.created_at AS since
  FROM public.user_roles ur
  JOIN public.profiles p ON p.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at DESC;
$function$;

-- Create RPC to list users with whether admin (for professional UI)
CREATE OR REPLACE FUNCTION public.list_users_with_admin()
RETURNS TABLE(user_id uuid, email text, is_admin boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $function$
  SELECT p.id AS user_id,
         p.email,
         EXISTS (
           SELECT 1 FROM public.user_roles ur
           WHERE ur.user_id = p.id AND ur.role = 'admin'
         ) AS is_admin
  FROM public.profiles p
  ORDER BY p.created_at DESC;
$function$;