import { createFileRoute } from "@tanstack/react-router";
import PressPage from "@/pages/PressPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/press")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <PressPage onLogout={onLogout} />;
}
