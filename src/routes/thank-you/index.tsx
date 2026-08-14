import { createFileRoute } from "@tanstack/react-router";
import OrderThankYouPage from "@/pages/OrderThankYouPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/thank-you")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <OrderThankYouPage onLogout={onLogout} />;
}
