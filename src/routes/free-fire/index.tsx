import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/free-fire")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
