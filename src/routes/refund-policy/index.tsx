import { createFileRoute } from "@tanstack/react-router";
import RefundPolicyPage from "@/pages/RefundPolicyPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/refund-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <RefundPolicyPage onLogout={onLogout} />;
}
