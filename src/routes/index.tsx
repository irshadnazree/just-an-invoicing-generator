import { PlusIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex w-full flex-col items-start gap-4">
        <h1 className="text-3xl/12">Quotations</h1>
        <div className="flex h-scrollbar w-full gap-12 overflow-x-auto pb-2">
          <Link to="/quotation">
            <Button icon={<PlusIcon size={22} weight="bold" />}>
              New Quotation
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-4 pb-2">
        <h1 className="text-3xl/12">Invoices</h1>
        <div className="flex h-scrollbar w-full gap-12 overflow-x-auto pb-2">
          coming soon...
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-4 pb-2">
        <h1 className="text-3xl/12">History</h1>
        <div className="flex h-scrollbar w-full gap-12 overflow-x-auto pb-2">
          coming soon...
        </div>
      </div>
    </div>
  );
}
