import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/midasbuy/:countryCode/buy/honorofkings")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
