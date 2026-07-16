import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCountryConfig } from "@/utils/countryConfigs";

// Check if the current user agent is a search engine bot
const isSearchBot = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent.toLowerCase();
  return /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebot|ia_archiver|semrushbot|ahrefsbot|mj12bot|dotbot/i.test(ua);
};

type DetectedCountry = {
  name: string;
  code: string; // lowercase
  region: string;
  currency: string;
};

const safeParseJson = <T,>(value: string | null): T | null => {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
};

const buildDetectedCountry = (countryCodeLower: string): DetectedCountry => {
  const upper = countryCodeLower.toUpperCase();
  const cfg = getCountryConfig(upper);
  return {
    name: cfg.name,
    code: countryCodeLower,
    region: cfg.region,
    currency: cfg.currency,
  };
};

const fetchCountryCodeFromIP = async (): Promise<string | null> => {
  try {
    const ipRes = await fetch("https://api.ipify.org?format=json");
    if (!ipRes.ok) return null;
    const ipData = await ipRes.json();
    const ip = ipData?.ip as string | undefined;
    if (!ip) return null;

    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    if (!geoRes.ok) return null;
    const geoData = await geoRes.json();
    const cc = (geoData?.country_code as string | undefined)?.toLowerCase();
    if (!cc || !/^[a-z]{2}$/.test(cc)) return null;

    // persist for reuse
    localStorage.setItem("detectedIP", ip);
    localStorage.setItem("detectedCountry", JSON.stringify(buildDetectedCountry(cc)));
    window.dispatchEvent(new CustomEvent("countryDetected", { detail: buildDetectedCountry(cc) }));

    return cc;
  } catch {
    return null;
  }
};

// Component to handle automatic redirects to country-specific home page URLs
const InternationalRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Don't redirect search engine bots - let them see the root page content
    if (location.pathname !== "/" || isSearchBot()) return;

    const performRedirect = async () => {
      // 1) If user manually picked a country, respect it (still sends them to /midasbuy/{cc})
      const manual = localStorage.getItem("manualCountrySelection") === "true";
      const selected = safeParseJson<{ code?: string }>(localStorage.getItem("selectedCountry"));
      const selectedCode = selected?.code?.toLowerCase();
      if (manual && selectedCode && /^[a-z]{2}$/.test(selectedCode)) {
        navigate(`/midasbuy/${selectedCode}`, { replace: true });
        return;
      }

      // 2) If we already detected country previously, redirect instantly
      const cached = safeParseJson<{ code?: string }>(localStorage.getItem("detectedCountry"));
      const cachedCode = cached?.code?.toLowerCase();
      if (cachedCode && /^[a-z]{2}$/.test(cachedCode)) {
        navigate(`/midasbuy/${cachedCode}`, { replace: true });
        return;
      }

      // 3) Otherwise detect via IP and redirect
      const cc = await fetchCountryCodeFromIP();
      if (cc) {
        navigate(`/midasbuy/${cc}`, { replace: true });
      }
    };

    performRedirect();
  }, [location.pathname, navigate]);

  return null; // This component doesn't render anything
};

export default InternationalRedirect;
