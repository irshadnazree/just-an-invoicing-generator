import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import EmptyQuotationsView from "@/components/page/history/empty-quotations-view";
import NoResultSection from "@/components/page/history/no-result-view";
import TableView from "@/components/page/history/table-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { initialFormData, useQuotationStore } from "@/stores/quotation-store";
import type { QuotationFormData, QuotationListItem } from "@/types/quotation";
import { generateId } from "@/utils/quotation";

export const Route = createFileRoute("/quotation/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { getAllQuotations, getAllQuotationsAsync, deleteQuotation } =
    useQuotationStore();
  const router = useRouter();

  const [quotations, setQuotations] = useState<QuotationFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selectedQuotations, setSelectedQuotations] = useState<Set<string>>(
    new Set()
  );
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const formattedQuotations = quotations.map((q) => {
    const total = q.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
    return {
      id: q.id,
      quotationId: q.quotationId,
      projectTitle: q.projectTitle || "Untitled Project",
      paymentType: q.paymentType.replace(" payment", ""),
      quotationFor: q.quotationFor?.company || "Unknown Company",
      quotationDate: q.quotationDate,
      total,
      currency: q.currency || "RM",
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    } as QuotationListItem;
  });

  const filteredQuotations = searchTerm
    ? (() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return formattedQuotations.filter(
          (q) =>
            q.projectTitle.toLowerCase().includes(lowerSearchTerm) ||
            q.quotationFor.toLowerCase().includes(lowerSearchTerm) ||
            q.quotationId.toLowerCase().includes(lowerSearchTerm)
        );
      })()
    : formattedQuotations;

  const sortedQuotations = [...filteredQuotations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  function handleCreateQuotation() {
    const newQuotation = generateId(initialFormData as QuotationFormData);

    router.navigate({
      to: "/quotation/$quotation",
      params: { quotation: newQuotation.id },
    });
  }

  function cancelDelete() {
    setPendingDeleteId(null);
  }

  function confirmDelete() {
    if (pendingDeleteId) {
      deleteQuotation(pendingDeleteId);
      setQuotations(getAllQuotations());
      setPendingDeleteId(null);
    }
  }

  function handleBulkDelete() {
    if (selectedQuotations.size > 0) {
      setPendingBulkDelete(true);
    }
  }

  function cancelBulkDelete() {
    setPendingBulkDelete(false);
  }

  function confirmBulkDelete() {
    for (const id of selectedQuotations) {
      deleteQuotation(id);
    }
    setQuotations(getAllQuotations());
    setSelectedQuotations(new Set());
    setPendingBulkDelete(false);
  }

  useEffect(() => {
    const loadQuotations = async () => {
      try {
        const loadedQuotations = await getAllQuotationsAsync();
        setQuotations(loadedQuotations);
      } catch (error) {
        console.error("Failed to load quotations:", error);
        setQuotations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuotations();
  }, [getAllQuotationsAsync]);

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex min-h-96 items-center justify-center">
          <Loader text="Loading quotations..." />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      {pendingDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="rounded-lg bg-foreground p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg">Confirm Delete</h3>
            <p className="mb-6 text-text">
              Are you sure you want to delete this quotation?
            </p>
            <div className="flex justify-end gap-3">
              <Button onClick={cancelDelete} variant="ghost">
                Cancel
              </Button>
              <Button onClick={confirmDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}

      {pendingBulkDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="rounded-lg bg-foreground p-6 shadow-lg">
            <h3 className="mb-4 font-semibold text-lg">Confirm Bulk Delete</h3>
            <p className="mb-6 text-text">
              Are you sure you want to delete {selectedQuotations.size}{" "}
              quotation(s)?
            </p>
            <div className="flex justify-end gap-3">
              <Button onClick={cancelBulkDelete} variant="ghost">
                Cancel
              </Button>
              <Button onClick={confirmBulkDelete}>
                Delete {selectedQuotations.size} Item(s)
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center xl:gap-0">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl">Quotations</h2>
          <Button
            icon={
              <PlusIcon className="size-4 xl:size-5" size={20} weight="bold" />
            }
            onClick={handleCreateQuotation}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-4">
          {selectedQuotations.size > 0 && (
            <Button
              icon={<TrashIcon className="size-4 xl:size-5" size={20} />}
              onClick={handleBulkDelete}
              size="sm"
              variant="ghost"
            />
          )}

          <Input
            id="search"
            onChange={(value) => setSearchTerm(value as string)}
            placeholder="Search quotations..."
            type="text"
            value={searchTerm}
          />
        </div>
      </div>

      {sortedQuotations.length === 0 && searchTerm !== "" && (
        <NoResultSection
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}
      {quotations.length === 0 && searchTerm === "" && <EmptyQuotationsView />}

      {sortedQuotations.length > 0 && (
        <TableView
          quotations={sortedQuotations}
          selectedQuotations={selectedQuotations}
          setPendingDeleteId={setPendingDeleteId}
          setQuotations={setQuotations}
          setSelectedQuotations={setSelectedQuotations}
        />
      )}

      {sortedQuotations.length > 0 && (
        <div className="mt-4 text-sm text-text">
          Showing {sortedQuotations.length} of {formattedQuotations.length}{" "}
          quotations
        </div>
      )}
    </section>
  );
}
