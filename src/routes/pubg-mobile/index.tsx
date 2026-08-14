import { createFileRoute } from "@tanstack/react-router";
import PubgMobileRedirect from "@/components/PubgMobileRedirect";

export const Route = createFileRoute("/pubg-mobile/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PubgMobileRedirect />;
}
