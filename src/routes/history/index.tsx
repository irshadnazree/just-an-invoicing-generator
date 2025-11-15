import {
  CopyIcon,
  FileTextIcon,
  PencilSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
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
  const { getAllQuotations, deleteQuotation, duplicateQuotation } =
    useQuotationStore();

  const loadedQuotations = getAllQuotations();

  const tableHeaders = [
    { label: "Id", key: "id" },
    { label: "Project", key: "projectTitle" },
    { label: "Payment Type", key: "paymentType" },
    { label: "Client", key: "quotationFor" },
    { label: "Total", key: "total" },
    { label: "Actions", key: "actions" },
  ];

  const [quotations, setQuotations] =
    useState<QuotationFormData[]>(loadedQuotations);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

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
          total,
          currency: q.currency || "RM",
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
    duplicateQuotation(id);
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
              <Button onClick={confirmDelete} variant="primary">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center xl:gap-0">
        <h1 className="text-3xl">Quotation History</h1>
        <div className="flex items-center gap-4">
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-text/50 bg-foreground/80">
            <thead>
              <tr>
                {tableHeaders.map((header) => (
                  <th
                    className="px-4 py-2 text-left font-medium text-text text-xs uppercase tracking-wider"
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
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-sm">
                    <Link
                      className="text-primary"
                      params={{ quotation: quotation.id }}
                      to="/quotation/$quotation"
                    >
                      {quotation.quotationId || "No ID"}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    {quotation.projectTitle}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    {quotation.paymentType}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    {quotation.quotationFor}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-sm">
                    {formatCurrency(quotation.total, quotation.currency)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2 text-right font-medium text-sm">
                    <div className="flex">
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
        </div>
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
