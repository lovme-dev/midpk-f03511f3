import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/thankyou/")({
  beforeLoad: () => {
    throw redirect({ to: "/thank-you", replace: true });
  },
});
