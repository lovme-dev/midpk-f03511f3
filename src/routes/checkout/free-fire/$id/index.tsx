import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/checkout/free-fire/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
