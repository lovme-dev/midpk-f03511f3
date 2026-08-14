import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/midasbuy/$countryCode/game/ludo/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
