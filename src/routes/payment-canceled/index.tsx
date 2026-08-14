import { createFileRoute } from "@tanstack/react-router";
import PaymentCanceledPage from "@/pages/PaymentCanceledPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/payment-canceled")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PaymentCanceledPage onLogout={onLogout} />;
}
