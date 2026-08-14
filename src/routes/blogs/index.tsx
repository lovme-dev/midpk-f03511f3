import { createFileRoute } from "@tanstack/react-router";
import BlogsPage from "@/pages/BlogsPage";

export const Route = createFileRoute("/blogs/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <BlogsPage />;
}
