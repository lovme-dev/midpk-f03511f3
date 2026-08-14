import { createFileRoute } from "@tanstack/react-router";
import TermsOfServicePage from "@/pages/TermsOfServicePage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/terms-of-service/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <TermsOfServicePage onLogout={onLogout} />;
}
