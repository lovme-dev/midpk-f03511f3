import { createFileRoute } from "@tanstack/react-router";
import IPDetectorPage from "@/pages/IPDetectorPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/ip-detector/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <IPDetectorPage onLogout={onLogout} />;
}
