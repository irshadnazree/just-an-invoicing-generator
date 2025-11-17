import {
  CheckSquareIcon,
  CopyIcon,
  FileTextIcon,
  PencilSimpleIcon,
  SquareIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { cn, formatCurrency } from "@/lib/utils";
import { useQuotationStore } from "@/stores/quotation-store";
import type { QuotationFormData } from "@/types/quotation";

type QuotationListItem = {
  id: string;
  quotationId: string;
  projectTitle: string;
  quotationFor: string;
  quotationDate: string;
  paymentType: string;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export const Route = createFileRoute("/history/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    getAllQuotations,
    getAllQuotationsAsync,
    deleteQuotation,
    duplicateQuotation,
  } = useQuotationStore();
  const router = useRouter();

  const [quotations, setQuotations] = useState<QuotationFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selectedQuotations, setSelectedQuotations] = useState<Set<string>>(
    new Set()
  );
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const tableHeaders = [
    { label: "Id", key: "id", width: "w-[6%]" },
    { label: "Project", key: "projectTitle", width: "w-[38%]" },
    { label: "Payment Type", key: "paymentType", width: "w-[12%]" },
    { label: "Client", key: "quotationFor", width: "w-[18%]" },
    { label: "Total", key: "total", width: "w-[10%]" },
    { label: "Actions", key: "actions", width: "w-[12%]" },
  ];

  // Load quotations on mount
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

  const formattedQuotations = useMemo(
    () =>
      quotations.map((q) => {
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
      }),
    [quotations]
  );

  const filteredQuotations = useMemo(() => {
    if (!searchTerm) {
      return formattedQuotations;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return formattedQuotations.filter(
      (q) =>
        q.projectTitle.toLowerCase().includes(lowerSearchTerm) ||
        q.quotationFor.toLowerCase().includes(lowerSearchTerm) ||
        q.quotationId.toLowerCase().includes(lowerSearchTerm)
    );
  }, [formattedQuotations, searchTerm]);

  const sortedQuotations = useMemo(
    () =>
      filteredQuotations.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [filteredQuotations]
  );

  function handleDuplicateQuotation(id: string) {
    const newId = duplicateQuotation(id);
    if (newId) {
      // Refresh the quotations list
      getAllQuotationsAsync().then(setQuotations);
      // Navigate to the new quotation
      router.navigate({
        to: "/quotation/$quotation",
        params: { quotation: newId },
      });
    }
  }

  function handleDeleteQuotation(id: string) {
    setPendingDeleteId(id);
  }

  function confirmDelete() {
    if (pendingDeleteId) {
      deleteQuotation(pendingDeleteId);
      setQuotations(getAllQuotations());
      setPendingDeleteId(null);
    }
  }

  function cancelDelete() {
    setPendingDeleteId(null);
  }

  function toggleQuotationSelection(id: string) {
    const newSelection = new Set(selectedQuotations);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedQuotations(newSelection);
  }

  function toggleSelectAll() {
    if (selectedQuotations.size === sortedQuotations.length) {
      setSelectedQuotations(new Set());
    } else {
      setSelectedQuotations(new Set(sortedQuotations.map((q) => q.id)));
    }
  }

  function handleBulkDelete() {
    if (selectedQuotations.size > 0) {
      setPendingBulkDelete(true);
    }
  }

  function confirmBulkDelete() {
    for (const id of selectedQuotations) {
      deleteQuotation(id);
    }
    setQuotations(getAllQuotations());
    setSelectedQuotations(new Set());
    setPendingBulkDelete(false);
  }

  function cancelBulkDelete() {
    setPendingBulkDelete(false);
  }

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center xl:gap-0">
          <h2 className="text-3xl/11.5">Quotation History</h2>
        </div>
        <div className="flex min-h-96 items-center justify-center">
          <Loader size="lg" text="Loading quotations..." />
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
        <h2 className="text-3xl/11.5">Quotation History</h2>
        <div className="flex items-center gap-4">
          {selectedQuotations.size > 0 && (
            <Button
              icon={<TrashIcon size={18} />}
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

      {sortedQuotations.length === 0 ? (
        <div className="py-12 text-center">
          <FileTextIcon className="mx-auto mb-2 text-text" size={32} />
          <h3 className="font-medium">No quotations found</h3>
          <p className="mb-2 text-sm text-text/80">
            {searchTerm
              ? "Try adjusting your search terms"
              : "Create your first quotation to get started"}
          </p>
          {searchTerm && (
            <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
          )}
        </div>
      ) : (
        <table className="w-full table-fixed divide-y divide-text/50 bg-foreground/80">
          <thead>
            <tr>
              <th className="w-[4%] px-2 py-2 text-left">
                <Button
                  icon={
                    selectedQuotations.size === sortedQuotations.length ? (
                      <CheckSquareIcon size={18} />
                    ) : (
                      <SquareIcon size={18} />
                    )
                  }
                  onClick={toggleSelectAll}
                  size="sm"
                  variant="ghost"
                />
              </th>

              {tableHeaders.map((header) => (
                <th
                  className={cn(
                    "px-4 py-2 text-left font-medium text-text text-xs uppercase tracking-wider",
                    header.width
                  )}
                  key={header.key}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedQuotations.map((quotation) => (
              <tr className="hover:bg-foreground" key={quotation.id}>
                <td className="w-[4%] whitespace-nowrap px-2 py-2">
                  <Button
                    icon={
                      selectedQuotations.has(quotation.id) ? (
                        <CheckSquareIcon size={18} />
                      ) : (
                        <SquareIcon size={18} />
                      )
                    }
                    onClick={() => toggleQuotationSelection(quotation.id)}
                    size="sm"
                    variant="ghost"
                  />
                </td>

                <td className="w-[6%] whitespace-nowrap px-4 py-2 font-medium text-sm">
                  <Link
                    className="text-primary"
                    params={{ quotation: quotation.id }}
                    to="/quotation/$quotation"
                  >
                    {quotation.quotationId || "No ID"}
                  </Link>
                </td>
                <td className="w-[38%] min-w-0 truncate px-4 py-2 text-sm">
                  {quotation.projectTitle}
                </td>
                <td className="w-[12%] whitespace-nowrap px-4 py-2 text-sm">
                  {quotation.paymentType}
                </td>
                <td className="w-[18%] min-w-0 truncate px-4 py-2 text-sm">
                  {quotation.quotationFor}
                </td>
                <td className="w-[10%] whitespace-nowrap px-4 py-2 text-sm">
                  {formatCurrency(quotation.total, quotation.currency)}
                </td>

                <td className="w-[12%] whitespace-nowrap px-4 py-2 text-right font-medium text-sm">
                  <div
                    className={cn(
                      "flex justify-start gap-1",
                      selectedQuotations.size > 0 &&
                        "pointer-events-none cursor-not-allowed opacity-50"
                    )}
                  >
                    <Link
                      params={{ quotation: quotation.id }}
                      to="/quotation/$quotation"
                    >
                      <Button
                        icon={<PencilSimpleIcon size={22} />}
                        size="sm"
                        variant="ghost"
                      />
                    </Link>
                    <Button
                      icon={<CopyIcon size={22} />}
                      onClick={() => handleDuplicateQuotation(quotation.id)}
                      size="sm"
                      variant="ghost"
                    />

                    <Button
                      icon={<TrashIcon size={22} />}
                      onClick={() => handleDeleteQuotation(quotation.id)}
                      size="sm"
                      variant="ghost"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
