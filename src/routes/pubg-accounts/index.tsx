import { createFileRoute } from "@tanstack/react-router";
import PubgAccountsPage from "@/pages/PubgAccountsPage";

export const Route = createFileRoute("/pubg-accounts")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PubgAccountsPage />;
}
