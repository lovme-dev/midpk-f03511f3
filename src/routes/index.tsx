import { createFileRoute } from "@tanstack/react-router";
import Index from "@/pages/Index";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Midasbuy — Official PUBG Mobile UC Top Up Store" },
      { name: "description", content: "Buy PUBG Mobile UC securely with instant delivery and local payment methods on Midasbuy." },
      { property: "og:title", content: "Midasbuy — Official PUBG Mobile UC Top Up Store" },
      { property: "og:description", content: "Buy PUBG Mobile UC securely with instant delivery and local payment methods on Midasbuy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <Index onLogout={onLogout} />;
}
