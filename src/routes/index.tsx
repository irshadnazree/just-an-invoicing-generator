import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Link to="/quotation">
        <Button>Quotation</Button>
      </Link>
    </div>
  );
}
