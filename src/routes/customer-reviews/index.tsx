import { createFileRoute } from "@tanstack/react-router";
import CustomerReviewsPage from "@/pages/CustomerReviewsPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/customer-reviews/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <CustomerReviewsPage onLogout={onLogout} />;
}
