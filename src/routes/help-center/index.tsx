import { createFileRoute } from "@tanstack/react-router";
import HelpCenterPage from "@/pages/HelpCenterPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/help-center/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <HelpCenterPage onLogout={onLogout} />;
}
