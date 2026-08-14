import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/valorant/purchase/:id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
