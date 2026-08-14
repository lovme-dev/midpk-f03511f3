import { createFileRoute } from "@tanstack/react-router";
import SecurityPage from "@/pages/SecurityPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/security")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <SecurityPage onLogout={onLogout} />;
}
