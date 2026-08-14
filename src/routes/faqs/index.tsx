import { createFileRoute } from "@tanstack/react-router";
import FAQsPage from "@/pages/FAQsPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/faqs")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <FAQsPage onLogout={onLogout} />;
}
