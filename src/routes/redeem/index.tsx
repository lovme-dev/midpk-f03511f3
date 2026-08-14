import { createFileRoute } from "@tanstack/react-router";
import RedeemPage from "@/pages/RedeemPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/redeem")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <RedeemPage onLogout={onLogout} />;
}
