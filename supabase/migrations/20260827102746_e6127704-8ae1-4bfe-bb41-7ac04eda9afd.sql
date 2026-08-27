DROP POLICY IF EXISTS "Payment credentials viewable by all" ON public.payment_credentials;
DROP POLICY IF EXISTS "Only admins can read payment credentials" ON public.payment_credentials;
CREATE POLICY "Only admins can read payment credentials"
ON public.payment_credentials FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
REVOKE ALL ON public.payment_credentials FROM anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_credentials TO authenticated;
GRANT ALL ON public.payment_credentials TO service_role;

ALTER FUNCTION public.pms_touch_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.assign_default_role(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.assign_default_role(uuid) TO service_role;
REVOKE EXECUTE ON FUNCTION public.delete_old_pending_failed_orders() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.delete_old_pending_failed_orders() TO service_role;
REVOKE EXECUTE ON FUNCTION public.handle_new_user_role() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.handle_new_user_role() TO service_role;
REVOKE EXECUTE ON FUNCTION public.prevent_customer_order_tampering() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.prevent_customer_order_tampering() TO service_role;

REVOKE EXECUTE ON FUNCTION public.grant_role_by_email(text, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.grant_role_by_email(text, public.app_role) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.revoke_role_by_email(text, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.revoke_role_by_email(text, public.app_role) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.list_admins() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.list_users_with_admin_status() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_users_with_admin_status() TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.log_admin_action(uuid, text, text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.log_admin_action(uuid, text, text, jsonb) TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.reset_auth_attempts(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reset_auth_attempts(uuid) TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION public.check_auth_rate_limit(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_auth_rate_limit(text) TO anon, authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.increment_auth_attempts(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_auth_attempts(text) TO anon, authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.submit_redeem_code(text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_redeem_code(text, text, text) TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id uuid, email text, since timestamptz)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT ur.user_id, au.email::text, ur.created_at
  FROM public.user_roles ur
  LEFT JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
    AND public.has_role(auth.uid(), 'admin')
  ORDER BY ur.created_at DESC
$$;

CREATE OR REPLACE FUNCTION public.list_users_with_admin_status()
RETURNS TABLE(user_id uuid, email text, is_admin boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT au.id, au.email::text, public.has_role(au.id, 'admin')
  FROM auth.users au
  WHERE public.has_role(auth.uid(), 'admin')
  ORDER BY au.created_at DESC
$$;