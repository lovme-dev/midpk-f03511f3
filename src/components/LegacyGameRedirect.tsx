import { Navigate, useParams } from "@/lib/router-compat";

/**
 * Redirects every retired game URL (Free Fire, Roblox, Valorant, BGMI,
 * Honor of Kings, Car, external game iframes) to the PUBG Mobile store,
 * keeping the country scope when present.
 */
const LegacyGameRedirect = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const cc = (countryCode || "").toLowerCase();
  const target = cc ? `/midasbuy/${cc}/buy/pubgm` : "/";
  return <Navigate to={target} replace />;
};

export default LegacyGameRedirect;
