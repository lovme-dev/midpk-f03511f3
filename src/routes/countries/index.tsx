import { createFileRoute } from "@tanstack/react-router";
import CountriesDirectoryPage from "@/pages/CountriesDirectoryPage";

export const Route = createFileRoute("/countries")({
  component: RouteComponent,
});

function RouteComponent() {
  return <CountriesDirectoryPage />;
}
