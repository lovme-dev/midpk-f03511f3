import { createFileRoute } from "@tanstack/react-router";
import PubgMobileRedirect from "@/components/PubgMobileRedirect";

export const Route = createFileRoute("/purchase/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PubgMobileRedirect />;
}
