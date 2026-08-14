import { createFileRoute } from "@tanstack/react-router";
import GoogleAuthCallbackPage from "@/pages/GoogleAuthCallbackPage";

export const Route = createFileRoute("/api/auth/callback/google")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GoogleAuthCallbackPage />;
}
