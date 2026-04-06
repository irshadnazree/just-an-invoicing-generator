import { PlusIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/Button";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const navigate = useNavigate();

  const handleNewQuotation = () => {
    navigate({ to: "/quotation/$quotation", params: { quotation: "new" } });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="flex w-full flex-col items-start gap-4">
        <h1 className="text-2xl/12">Quotations</h1>
        <div className="flex h-scrollbar w-full gap-12 overflow-x-auto pb-2">
          <Button
            icon={<PlusIcon size={22} weight="bold" />}
            onClick={handleNewQuotation}
          >
            New Quotation
          </Button>
        </div>
      </div>
    </div>
  );
}
