-- Allow users to delete their own pending/failed orders
CREATE POLICY "Users can delete their own pending or failed orders"
ON public.orders
FOR DELETE
USING (
  auth.uid() = user_id 
  AND status IN ('pending', 'processing', 'failed')
);