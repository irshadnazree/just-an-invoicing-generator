import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import EmptyQuotationsView from "@/components/shared/history/empty-quotations-view";
import InvoiceTableView from "@/components/shared/history/invoice-table-view";
import NoResultSection from "@/components/shared/history/no-result-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader } from "@/components/ui/loader";
import { initialFormData, useInvoiceStore } from "@/stores/invoice-store";
import type { InvoiceFormData, InvoiceListItem } from "@/types/invoice";
import { generateId } from "@/utils/invoice";

export const Route = createFileRoute("/invoice/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { getAllInvoices, getAllInvoicesAsync, deleteInvoice } =
    useInvoiceStore();
  const router = useRouter();

  const [invoices, setInvoices] = useState<InvoiceFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(
    new Set()
  );
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const formattedInvoices = invoices.map((q) => {
    const total =
      q.items.reduce((sum, item) => sum + item.quantity * item.rate, 0) -
      (q.reductionAmount || 0);
    return {
      id: q.id,
      invoiceId: q.invoiceId,
      invoiceFor: q.invoiceTo?.company || "Unknown Company",
      invoiceDate: q.invoiceDate,
      total,
      currency: q.currency || "RM",
      createdAt: q.createdAt,
      updatedAt: q.updatedAt,
    } as InvoiceListItem;
  });

  const filteredInvoices = searchTerm
    ? (() => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return formattedInvoices.filter(
          (q) =>
            q.invoiceFor.toLowerCase().includes(lowerSearchTerm) ||
            q.invoiceId.toLowerCase().includes(lowerSearchTerm)
        );
      })()
    : formattedInvoices;

  const sortedInvoices = [...filteredInvoices].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  function handleCreateInvoice() {
    const newInvoice = generateId(initialFormData as InvoiceFormData);

    router.navigate({
      to: "/invoice/$invoice",
      params: { invoice: newInvoice.id },
    });
  }

  function cancelDelete() {
    setPendingDeleteId(null);
  }

  function confirmDelete() {
    if (pendingDeleteId) {
      deleteInvoice(pendingDeleteId);
      setInvoices(getAllInvoices());
      setPendingDeleteId(null);
    }
  }

  function handleBulkDelete() {
    if (selectedInvoices.size > 0) {
      setPendingBulkDelete(true);
    }
  }

  function cancelBulkDelete() {
    setPendingBulkDelete(false);
  }

  function confirmBulkDelete() {
    for (const id of selectedInvoices) {
      deleteInvoice(id);
    }
    setInvoices(getAllInvoices());
    setSelectedInvoices(new Set());
    setPendingBulkDelete(false);
  }

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const loadedInvoices = await getAllInvoicesAsync();
        setInvoices(loadedInvoices);
      } catch (error) {
        console.error("Failed to load invoices:", error);
        setInvoices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadInvoices();
  }, [getAllInvoicesAsync]);

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex min-h-96 items-center justify-center">
          <Loader text="Loading invoices..." />
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
              Are you sure you want to delete this invoice?
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
              Are you sure you want to delete {selectedInvoices.size}{" "}
              invoice(s)?
            </p>
            <div className="flex justify-end gap-3">
              <Button onClick={cancelBulkDelete} variant="ghost">
                Cancel
              </Button>
              <Button onClick={confirmBulkDelete}>
                Delete {selectedInvoices.size} Item(s)
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center xl:gap-0">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl">Invoices</h2>
          <Button
            icon={
              <PlusIcon className="size-4 xl:size-5" size={20} weight="bold" />
            }
            onClick={handleCreateInvoice}
            size="sm"
          />
        </div>
        <div className="flex items-center gap-4">
          {selectedInvoices.size > 0 && (
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
            placeholder="Search invoices..."
            type="text"
            value={searchTerm}
          />
        </div>
      </div>

      {sortedInvoices.length === 0 && searchTerm !== "" && (
        <NoResultSection setSearchTerm={setSearchTerm} title="invoices" />
      )}
      {invoices.length === 0 && searchTerm === "" && (
        <EmptyQuotationsView
          handleCreateQuotation={handleCreateInvoice}
          title="invoices"
        />
      )}

      {sortedInvoices.length > 0 && (
        <InvoiceTableView
          invoices={sortedInvoices}
          selectedInvoices={selectedInvoices}
          setInvoices={setInvoices}
          setPendingDeleteId={setPendingDeleteId}
          setSelectedInvoices={setSelectedInvoices}
        />
      )}

      {sortedInvoices.length > 0 && (
        <div className="mt-4 text-sm text-text">
          Showing {sortedInvoices.length} of {formattedInvoices.length} invoices
        </div>
      )}
    </section>
  );
}
