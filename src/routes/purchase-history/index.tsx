import { createFileRoute } from "@tanstack/react-router";
import PurchaseHistoryPage from "@/pages/PurchaseHistoryPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/purchase-history/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PurchaseHistoryPage onLogout={onLogout} />;
}
