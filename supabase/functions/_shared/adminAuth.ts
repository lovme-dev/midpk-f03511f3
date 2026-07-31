import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface AuthResult {
  userId: string | null;
  isAdmin: boolean;
}

/**
 * Validates the caller's JWT (from Authorization header or ?token= for websockets)
 * and resolves whether they hold the admin role.
 */
export async function getCallerAuth(req: Request): Promise<AuthResult> {
  let token = "";
  const authHeader = req.headers.get("Authorization") || "";
  if (authHeader.startsWith("Bearer ")) {
    token = authHeader.slice(7);
  } else {
    try {
      token = new URL(req.url).searchParams.get("token") || "";
    } catch (_) {
      token = "";
    }
  }

  if (!token) return { userId: null, isAdmin: false };

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { persistSession: false } },
  );

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return { userId: null, isAdmin: false };

  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();

  return { userId: data.user.id, isAdmin: !!roles };
}

export function unauthorized(corsHeaders: Record<string, string>, message = "Unauthorized") {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function forbidden(corsHeaders: Record<string, string>, message = "Admin access required") {
  return new Response(JSON.stringify({ error: message }), {
    status: 403,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/** Returns a Response when the caller is not an admin, otherwise null. */
export async function requireAdmin(
  req: Request,
  corsHeaders: Record<string, string>,
): Promise<Response | null> {
  const auth = await getCallerAuth(req);
  if (!auth.userId) return unauthorized(corsHeaders);
  if (!auth.isAdmin) return forbidden(corsHeaders);
  return null;
}
