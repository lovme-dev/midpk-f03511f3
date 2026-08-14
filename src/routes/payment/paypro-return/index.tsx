import { createFileRoute } from "@tanstack/react-router";
import PayProReturnPage from "@/pages/PayProReturnPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/payment/paypro-return/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PayProReturnPage onLogout={onLogout} />;
}
