import { FileTextIcon, PlusIcon } from "@phosphor-icons/react";
import { useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export default function EmptyQuotationsView() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="flex flex-col items-center justify-center">
        <FileTextIcon className="mx-auto mb-2 text-text" size={32} />
        <h3 className="font-medium">No quotations found</h3>
        <p className="mb-2 text-sm text-text/80">
          Create your first quotation to get started
        </p>
      </div>

      <Button
        icon={<PlusIcon size={22} weight="bold" />}
        onClick={() => router.navigate({ to: "/quotation" })}
      >
        Create Quotation
      </Button>
    </div>
  );
}
