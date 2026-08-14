import { createFileRoute } from "@tanstack/react-router";
import CountryPubgPage from "@/pages/CountryPubgPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/midasbuy/:countryCode/buy/pubgm")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <CountryPubgPage onLogout={onLogout} />;
}
