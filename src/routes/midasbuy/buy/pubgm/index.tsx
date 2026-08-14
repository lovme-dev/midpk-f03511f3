import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/midasbuy/buy/pubgm")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <Index onLogout={onLogout} />;
}
