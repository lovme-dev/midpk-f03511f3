-- Add unique constraint on redeem_code only (one code can only exist once globally)
CREATE UNIQUE INDEX IF NOT EXISTS idx_redeem_codes_unique_code 
ON public.redeem_codes(redeem_code);

-- Create atomic function to submit redeem code (prevents duplicates at database level)
CREATE OR REPLACE FUNCTION public.submit_redeem_code(
  p_player_id TEXT,
  p_username TEXT,
  p_redeem_code TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing RECORD;
  v_new_id UUID;
BEGIN
  -- Check if this exact code already exists
  SELECT id, status INTO v_existing
  FROM redeem_codes
  WHERE redeem_code = p_redeem_code
  LIMIT 1;
  
  IF v_existing IS NOT NULL THEN
    -- Code already exists - return info without inserting
    RETURN jsonb_build_object(
      'success', false,
      'duplicate', true,
      'status', v_existing.status
    );
  END IF;
  
  -- Insert new code (unique constraint will catch any race condition)
  BEGIN
    INSERT INTO redeem_codes (player_id, username, redeem_code, status)
    VALUES (p_player_id, p_username, p_redeem_code, 'pending')
    RETURNING id INTO v_new_id;
    
    RETURN jsonb_build_object(
      'success', true,
      'duplicate', false,
      'id', v_new_id
    );
  EXCEPTION WHEN unique_violation THEN
    -- Race condition: another request inserted the same code
    RETURN jsonb_build_object(
      'success', false,
      'duplicate', true,
      'status', 'pending'
    );
  END;
END;
$$;