import { createFileRoute } from "@tanstack/react-router";
import PubgAccountCheckoutPage from "@/pages/PubgAccountCheckoutPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/pubg-accounts/checkout/$id/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PubgAccountCheckoutPage onLogout={onLogout} />;
}
