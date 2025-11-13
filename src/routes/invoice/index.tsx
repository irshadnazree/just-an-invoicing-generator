import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/invoice/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>coming soon...</div>;
}
