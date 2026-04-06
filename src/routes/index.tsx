import { PlusIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { generateRandomString } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const navigate = useNavigate();

  const handleNewQuotation = () => {
    const newId = generateRandomString(10);
    navigate({ to: "/quotation/$quotation", params: { quotation: newId } });
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
      {/* <div className="flex w-full flex-col items-start gap-4 pb-2">
        <h1 className="text-2xl/12">Invoices</h1>
        <div className="flex h-scrollbar w-full gap-12 overflow-x-auto pb-2">
          coming soon...
        </div>
      </div> */}
    </div>
  );
}
