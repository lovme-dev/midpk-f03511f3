import { createFileRoute } from "@tanstack/react-router";
import VideosPage from "@/pages/VideosPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/shop/videos")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <VideosPage onLogout={onLogout} />;
}
