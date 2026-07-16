
CREATE TABLE public.inquiry_email_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  inquiry_id UUID,
  customer_email TEXT NOT NULL,
  template_type TEXT,
  subject TEXT,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  sent_by UUID
);

ALTER TABLE public.inquiry_email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view email logs" ON public.inquiry_email_log
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert email logs" ON public.inquiry_email_log
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_inquiry_email_log_email ON public.inquiry_email_log(customer_email);
CREATE INDEX idx_inquiry_email_log_inquiry ON public.inquiry_email_log(inquiry_id);
