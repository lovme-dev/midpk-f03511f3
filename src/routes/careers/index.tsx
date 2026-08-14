import { createFileRoute } from "@tanstack/react-router";
import CareersPage from "@/pages/CareersPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/careers/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <CareersPage onLogout={onLogout} />;
}
