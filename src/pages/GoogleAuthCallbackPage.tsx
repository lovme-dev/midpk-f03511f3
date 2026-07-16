import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const GoogleAuthCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    // SEO
    document.title = "Google Login Callback – Midasbuy";
    const desc = "Completing Google sign-in for Midasbuy and redirecting you.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    (meta as HTMLMetaElement).setAttribute("content", desc);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    (canonical as HTMLLinkElement).setAttribute("href", window.location.href);
  }, []);

  useEffect(() => {
    const finalize = async () => {
      try {
        // Get hash fragment or query params for OAuth callback
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const queryParams = new URLSearchParams(window.location.search);
        
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const code = queryParams.get("code");

        // If we have tokens in the hash (implicit flow)
        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            setErrorMsg(error.message);
            return;
          }
        }
        // If we have a code (PKCE flow)
        else if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) {
            setErrorMsg(error.message);
            return;
          }
        }

        // Verify session and redirect to home page on current domain
        const { data } = await supabase.auth.getSession();
        if (data.session) {
          // Redirect to home page - this will be on the current domain (e.g., middasbuy.com)
          navigate("/", { replace: true });
        } else if (!errorMsg) {
          setErrorMsg("Login session could not be established. Please try again.");
        }
      } catch (e: any) {
        setErrorMsg(e?.message || "Unexpected error while completing login.");
      }
    };

    finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="min-h-screen bg-midasbuy-darkBlue text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <h1 className="sr-only">Google Login Callback</h1>
        {!errorMsg ? (
          <div className="flex items-center justify-center gap-3">
            <span className="h-6 w-6 rounded-full border-2 border-midasbuy-blue border-b-transparent animate-spin" />
            <p className="text-midasbuy-muted">Completing sign-in…</p>
          </div>
        ) : (
          <div className="glass-effect p-6 rounded-xl">
            <p className="text-red-400 mb-3">{errorMsg}</p>
            <button
              onClick={() => navigate("/auth", { replace: true })}
              className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-midasbuy-blue hover:bg-midasbuy-blue/90 transition"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default GoogleAuthCallbackPage;
