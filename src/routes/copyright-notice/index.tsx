import { createFileRoute } from "@tanstack/react-router";
import CopyrightNoticePage from "@/pages/CopyrightNoticePage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/copyright-notice/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <CopyrightNoticePage onLogout={onLogout} />;
}
