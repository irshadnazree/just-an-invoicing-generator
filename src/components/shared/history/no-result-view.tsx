import { FileTextIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export default function NoResultSection({
  title,
  setSearchTerm,
}: {
  title: string;
  setSearchTerm: (searchTerm: string) => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="flex flex-col items-center justify-center">
        <FileTextIcon className="mx-auto mb-2 text-text" size={32} />
        <h3 className="font-medium">No {title} found</h3>
        <p className="mb-2 text-sm text-text/80">
          "Try adjusting your search terms"
        </p>
      </div>

      <Button onClick={() => setSearchTerm("")}>Clear {title} Search</Button>
    </div>
  );
}
