import { createFileRoute } from "@tanstack/react-router";
import OrderCenterPage from "@/pages/OrderCenterPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/order-center/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <OrderCenterPage onLogout={onLogout} />;
}
