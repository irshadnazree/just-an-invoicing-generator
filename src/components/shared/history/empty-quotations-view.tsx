import { FileTextIcon, PlusIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function EmptyQuotationsView({
  title,
  handleCreateQuotation,
}: {
  title: string;
  handleCreateQuotation: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="flex flex-col items-center justify-center">
        <FileTextIcon className="mx-auto mb-2 text-text" size={32} />
        <h3 className="font-medium">No {title} found</h3>
        <p className="mb-2 text-sm text-text/80">
          Create your first {title.replace("s", "")} to get started
        </p>
      </div>

      <Button
        icon={<PlusIcon className="size-4 xl:size-5" size={20} weight="bold" />}
        onClick={handleCreateQuotation}
      >
        Create {title}
      </Button>
    </div>
  );
}
