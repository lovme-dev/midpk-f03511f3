import { createFileRoute } from "@tanstack/react-router";
import LegacyGameRedirect from "@/components/LegacyGameRedirect";

export const Route = createFileRoute("/car-purchase")({
  component: RouteComponent,
});

function RouteComponent() {
  return <LegacyGameRedirect />;
}
