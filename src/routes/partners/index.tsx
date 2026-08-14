import { createFileRoute } from "@tanstack/react-router";
import PartnersPage from "@/pages/PartnersPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/partners")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PartnersPage onLogout={onLogout} />;
}
