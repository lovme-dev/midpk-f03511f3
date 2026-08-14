import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/roblox/checkout/:id")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
