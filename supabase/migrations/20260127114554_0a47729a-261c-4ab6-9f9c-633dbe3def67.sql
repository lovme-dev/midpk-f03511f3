-- Drop existing function first
DROP FUNCTION IF EXISTS public.submit_redeem_code(text, text, text);

-- Recreate function with archive table check
CREATE OR REPLACE FUNCTION public.submit_redeem_code(
  p_player_id text,
  p_redeem_code text,
  p_username text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_record RECORD;
  v_archived_record RECORD;
BEGIN
  -- First check if code exists in archive (previously processed and deleted)
  SELECT status INTO v_archived_record
  FROM public.redeem_codes_archive
  WHERE redeem_code = p_redeem_code
  LIMIT 1;
  
  IF FOUND THEN
    -- Code was previously processed and archived
    RETURN json_build_object(
      'success', false,
      'duplicate', true,
      'status', v_archived_record.status,
      'archived', true
    );
  END IF;

  -- Check if code already exists in active table
  SELECT id, status INTO v_existing_record
  FROM public.redeem_codes
  WHERE redeem_code = p_redeem_code
  LIMIT 1;
  
  IF FOUND THEN
    -- Code already exists, return duplicate info
    RETURN json_build_object(
      'success', false,
      'duplicate', true,
      'status', v_existing_record.status
    );
  END IF;
  
  -- Code doesn't exist, insert new record
  BEGIN
    INSERT INTO public.redeem_codes (player_id, redeem_code, username, status)
    VALUES (p_player_id, p_redeem_code, p_username, 'pending');
    
    RETURN json_build_object(
      'success', true,
      'duplicate', false
    );
  EXCEPTION WHEN unique_violation THEN
    -- Race condition: another request inserted the same code
    SELECT status INTO v_existing_record
    FROM public.redeem_codes
    WHERE redeem_code = p_redeem_code
    LIMIT 1;
    
    RETURN json_build_object(
      'success', false,
      'duplicate', true,
      'status', COALESCE(v_existing_record.status, 'pending')
    );
  END;
END;
$$;