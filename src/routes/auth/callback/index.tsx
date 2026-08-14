import { createFileRoute } from "@tanstack/react-router";
import GoogleAuthCallbackPage from "@/pages/GoogleAuthCallbackPage";

export const Route = createFileRoute("/auth/callback")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GoogleAuthCallbackPage />;
}
