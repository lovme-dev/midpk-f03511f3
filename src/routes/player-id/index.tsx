import { createFileRoute } from "@tanstack/react-router";
import PubgMobileRedirect from "@/components/PubgMobileRedirect";

export const Route = createFileRoute("/player-id/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PubgMobileRedirect />;
}
