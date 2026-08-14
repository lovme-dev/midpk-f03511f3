import { createFileRoute } from "@tanstack/react-router";
import ContactUsPage from "@/pages/ContactUsPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/contact-us/")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <ContactUsPage onLogout={onLogout} />;
}
