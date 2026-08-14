import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/midasbuy/:countryCode/game/arenabreakout")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
