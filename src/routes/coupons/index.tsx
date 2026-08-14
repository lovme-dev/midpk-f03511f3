import { createFileRoute } from "@tanstack/react-router";
import CouponsPage from "@/pages/CouponsPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/coupons/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <CouponsPage onLogout={onLogout} />;
}
