ALTER TABLE public.admin_section_reads
  DROP CONSTRAINT IF EXISTS admin_section_reads_section_key_check;

ALTER TABLE public.admin_section_reads
  ADD CONSTRAINT admin_section_reads_section_key_check
  CHECK (section_key IN ('orders', 'redeem_codes', 'customer_inquiries'));