import { createFileRoute } from "@tanstack/react-router";
import PaymentFailedPage from "@/pages/PaymentFailedPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/payment/failed")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PaymentFailedPage onLogout={onLogout} />;
}
