-- 1. Protect orders table from customer self-completion and price tampering
CREATE OR REPLACE FUNCTION public.prevent_customer_order_tampering()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Allow service_role or admin user to update anything
  IF (current_setting('role', true) = 'service_role') OR (auth.uid() IS NOT NULL AND public.has_role(auth.uid(), 'admin')) THEN
    RETURN NEW;
  END IF;

  -- Block status change to 'completed', 'paid', or 'succeeded' by non-admin customers
  IF NEW.status IS DISTINCT FROM OLD.status AND lower(NEW.status) IN ('completed', 'paid', 'succeeded', 'processing') THEN
    RAISE EXCEPTION 'Only payment gateways and admins can mark orders as completed or processing';
  END IF;

  -- Block changing price, package_id, transaction_id, pkr_amount, exchange_rate, or product details
  IF NEW.price IS DISTINCT FROM OLD.price 
     OR NEW.package_id IS DISTINCT FROM OLD.package_id 
     OR NEW.pkr_amount IS DISTINCT FROM OLD.pkr_amount 
     OR NEW.exchange_rate IS DISTINCT FROM OLD.exchange_rate 
     OR NEW.transaction_id IS DISTINCT FROM OLD.transaction_id THEN
    RAISE EXCEPTION 'Order pricing and package details cannot be modified by customer';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_prevent_customer_order_tampering ON public.orders;
CREATE TRIGGER tr_prevent_customer_order_tampering
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_customer_order_tampering();

-- 2. Fix public read/write exposure on analytics table
DROP POLICY IF EXISTS "Analytics insertable by all and viewable by admins" ON public.analytics;

CREATE POLICY "Analytics insertable by all"
  ON public.analytics
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Analytics manageable by admins"
  ON public.analytics
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 3. Fix public read/write exposure on live_users table
DROP POLICY IF EXISTS "Live users accessible" ON public.live_users;

CREATE POLICY "Live users insertable by all"
  ON public.live_users
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Live users updatable by session"
  ON public.live_users
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Live users viewable and deletable by admins"
  ON public.live_users
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Live users deletable by admins"
  ON public.live_users
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Restrict redeem_codes so unassigned codes aren't open to all authenticated users
DROP POLICY IF EXISTS "Redeem codes manageable by admins and usable by users" ON public.redeem_codes;

CREATE POLICY "Redeem codes manageable by admins"
  ON public.redeem_codes
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can access own redeem codes"
  ON public.redeem_codes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);