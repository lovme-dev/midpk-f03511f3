import { createFileRoute } from "@tanstack/react-router";
import PaymentIssuesPage from "@/pages/PaymentIssuesPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/payment-issues")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PaymentIssuesPage onLogout={onLogout} />;
}
