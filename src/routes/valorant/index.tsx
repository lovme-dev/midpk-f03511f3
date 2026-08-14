import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/valorant")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
