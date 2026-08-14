import { createFileRoute } from "@tanstack/react-router";
import CreditCardPaymentPage from "@/pages/CreditCardPaymentPage";

export const Route = createFileRoute("/pay/card/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CreditCardPaymentPage />;
}
