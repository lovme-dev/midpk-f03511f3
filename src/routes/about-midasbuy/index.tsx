import { createFileRoute } from "@tanstack/react-router";
import AboutMidasbuyPage from "@/pages/AboutMidasbuyPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/about-midasbuy/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <AboutMidasbuyPage onLogout={onLogout} />;
}
