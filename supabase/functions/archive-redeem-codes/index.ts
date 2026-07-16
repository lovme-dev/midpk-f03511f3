import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code_ids } = await req.json();
    
    if (!code_ids || !Array.isArray(code_ids) || code_ids.length === 0) {
      return new Response(JSON.stringify({ error: 'code_ids array is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get authorization header to verify admin
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Verify the user is an admin
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check admin role
    const { data: roleData, error: roleError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (roleError || !roleData) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch codes to archive
    const { data: codesToArchive, error: fetchError } = await supabase
      .from('redeem_codes')
      .select('*')
      .in('id', code_ids);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return new Response(JSON.stringify({ error: 'Failed to fetch codes' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!codesToArchive || codesToArchive.length === 0) {
      return new Response(JSON.stringify({ success: true, archived: 0, deleted: 0 }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Archive codes - use upsert to handle duplicates
    const archiveData = codesToArchive.map(code => ({
      original_id: code.id,
      player_id: code.player_id,
      username: code.username,
      redeem_code: code.redeem_code,
      status: code.status,
      notes: code.notes,
      created_at: code.created_at,
      updated_at: code.updated_at,
      reviewed_at: code.reviewed_at,
      reviewed_by: code.reviewed_by,
      archived_by: user.id
    }));

    // Use upsert with onConflict to handle duplicate redeem_codes
    const { error: archiveError } = await supabase
      .from('redeem_codes_archive')
      .upsert(archiveData, { 
        onConflict: 'redeem_code',
        ignoreDuplicates: true 
      });

    if (archiveError) {
      console.error('Archive error:', archiveError);
      return new Response(JSON.stringify({ error: 'Failed to archive codes' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Delete from active table
    const { error: deleteError } = await supabase
      .from('redeem_codes')
      .delete()
      .in('id', code_ids);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return new Response(JSON.stringify({ error: 'Failed to delete codes' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      archived: codesToArchive.length,
      deleted: codesToArchive.length
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
