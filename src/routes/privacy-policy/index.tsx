import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/privacy-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PrivacyPolicyPage onLogout={onLogout} />;
}
