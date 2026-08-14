import { createFileRoute } from "@tanstack/react-router";
import CookiePolicyPage from "@/pages/CookiePolicyPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/cookie-policy")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <CookiePolicyPage onLogout={onLogout} />;
}
