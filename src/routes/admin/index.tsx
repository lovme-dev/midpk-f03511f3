import { createFileRoute } from "@tanstack/react-router";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import AdminRoute from "@/components/AdminRoute";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AdminRoute redirectTo="/">
      <AdminDashboardPage />
    </AdminRoute>
  );
}
