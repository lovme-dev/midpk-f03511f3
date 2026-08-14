import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/roblox/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
