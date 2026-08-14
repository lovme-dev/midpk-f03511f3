import { createFileRoute } from "@tanstack/react-router";
import MyFeedbacksPage from "@/pages/MyFeedbacksPage";
import { useLogout } from "@/lib/use-logout";

export const Route = createFileRoute("/my-feedbacks")({
  component: RouteComponent,
});

function RouteComponent() {
  const onLogout = useLogout();
  return <MyFeedbacksPage onLogout={onLogout} />;
}
