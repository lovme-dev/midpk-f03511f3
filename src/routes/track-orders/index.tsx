import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/track-orders")({
  beforeLoad: () => {
    throw redirect({ to: "/order-center", replace: true });
  },
});
