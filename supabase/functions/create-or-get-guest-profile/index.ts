import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface GuestProfileRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: GuestProfileRequest = await req.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    // Validate email
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (email.length > 255) {
      return new Response(
        JSON.stringify({ success: false, error: "Email too long" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate password
    if (!password) {
      return new Response(
        JSON.stringify({ success: false, error: "Password is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: "Password must be at least 6 characters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Creating or signing in user for email:", email);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Try to sign up the user first
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm the email
    });

    if (signUpError) {
      // If user already exists, try to verify password by signing in
      if (signUpError.message?.includes('already been registered') || signUpError.message?.includes('already exists')) {
        console.log("User already exists, checking existing profile for:", email);
        
        // Get existing profile
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('user_id, email')
          .eq('email', email)
          .maybeSingle();

        if (fetchError) {
          console.error("Error fetching existing profile:", fetchError);
          return new Response(
            JSON.stringify({ success: false, error: "Failed to verify account" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (existingProfile) {
          console.log("Found existing profile, returning user_id:", existingProfile.user_id);
          return new Response(
            JSON.stringify({
              success: true,
              user_id: existingProfile.user_id,
              email: existingProfile.email,
              is_existing: true,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        // User exists in auth but no profile - shouldn't happen often
        return new Response(
          JSON.stringify({ success: false, error: "Account exists. Please login instead." }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.error("Error creating user:", signUpError);
      return new Response(
        JSON.stringify({ success: false, error: signUpError.message || "Failed to create account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // User created successfully, profile should be created by trigger
    const userId = signUpData.user?.id;
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "Failed to create user account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Created new user with id:", userId);

    // Wait a moment for the trigger to create profile
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify profile was created
    const { data: newProfile } = await supabase
      .from('profiles')
      .select('user_id, email')
      .eq('user_id', userId)
      .maybeSingle();

    return new Response(
      JSON.stringify({
        success: true,
        user_id: userId,
        email: email,
        is_existing: false,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("create-or-get-guest-profile error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});