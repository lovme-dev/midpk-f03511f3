import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/gaming-shop/")({
  beforeLoad: () => {
    throw redirect({ to: "/", replace: true });
  },
});
