-- Create grant_role_by_email function to grant admin role by email
CREATE OR REPLACE FUNCTION public.grant_role_by_email(user_email TEXT, target_role TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
  result_message TEXT;
BEGIN
  -- Find the user by email in auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  -- If user doesn't exist, try to find in profiles table
  IF target_user_id IS NULL THEN
    SELECT user_id INTO target_user_id
    FROM public.profiles
    WHERE profiles.email = user_email
    LIMIT 1;
  END IF;

  IF target_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'User with this email not found. User must sign up first.'
    );
  END IF;

  -- Check if user already has this role
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role = target_role) THEN
    RETURN json_build_object(
      'success', false,
      'message', 'User already has this role.'
    );
  END IF;

  -- Grant the role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, target_role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN json_build_object(
    'success', true,
    'message', 'Role granted successfully.',
    'user_id', target_user_id
  );
END;
$$;

-- Create revoke_role_by_email function to revoke admin role by email
CREATE OR REPLACE FUNCTION public.revoke_role_by_email(user_email TEXT, target_role TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Find the user by email in auth.users
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  -- If user doesn't exist in auth.users, try profiles
  IF target_user_id IS NULL THEN
    SELECT user_id INTO target_user_id
    FROM public.profiles
    WHERE profiles.email = user_email
    LIMIT 1;
  END IF;

  IF target_user_id IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'message', 'User with this email not found.'
    );
  END IF;

  -- Check if user has this role
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = target_user_id AND role = target_role) THEN
    RETURN json_build_object(
      'success', false,
      'message', 'User does not have this role.'
    );
  END IF;

  -- Revoke the role
  DELETE FROM public.user_roles
  WHERE user_id = target_user_id AND role = target_role;

  RETURN json_build_object(
    'success', true,
    'message', 'Role revoked successfully.',
    'user_id', target_user_id
  );
END;
$$;

-- Create function to list all admins with their emails
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id UUID, email TEXT, since TIMESTAMPTZ)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ur.user_id,
    COALESCE(p.email, au.email) AS email,
    ur.created_at AS since
  FROM public.user_roles ur
  LEFT JOIN public.profiles p ON p.user_id = ur.user_id
  LEFT JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at DESC;
END;
$$;

-- Create function to list all users with admin status
CREATE OR REPLACE FUNCTION public.list_users_with_admin_status()
RETURNS TABLE(user_id UUID, email TEXT, is_admin BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.user_id,
    p.email,
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = p.user_id AND ur.role = 'admin') AS is_admin
  FROM public.profiles p
  ORDER BY p.created_at DESC;
END;
$$;