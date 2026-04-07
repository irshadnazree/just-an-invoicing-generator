import { PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import EmptyListView from "@/components/shared/history/empty-list-view";
import NoResultSection from "@/components/shared/history/no-result-view";
import TableView, {
  type TableColumn,
} from "@/components/shared/history/table-view";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loader } from "@/components/ui/loader";
import { formatCurrency } from "@/lib/utils";
import { initialFormData, useInvoiceStore } from "@/stores/invoice-store";
import type { InvoiceFormData, InvoiceListItem } from "@/types/invoice";
import { generateId } from "@/utils/invoice";

export const Route = createFileRoute("/invoice/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    bulkDeleteInvoices,
    deleteInvoice,
    duplicateInvoice,
    getAllInvoices,
    getAllInvoicesAsync,
  } = useInvoiceStore();
  const router = useRouter();

  const [invoices, setInvoices] = useState<InvoiceFormData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(
    new Set()
  );
  const [pendingBulkDelete, setPendingBulkDelete] = useState(false);

  const formattedInvoices = useMemo(
    () =>
      invoices.map((invoice) => {
        const total =
          invoice.items.reduce(
            (sum, item) => sum + item.quantity * item.rate,
            0
          ) - (invoice.reductionAmount || 0);

        return {
          id: invoice.id,
          invoiceId: invoice.invoiceId,
          invoiceFor: invoice.invoiceTo?.company || "Unknown Company",
          invoiceDate: invoice.invoiceDate,
          total,
          currency: invoice.currency || "RM",
          createdAt: invoice.createdAt,
          updatedAt: invoice.updatedAt,
        } satisfies InvoiceListItem;
      }),
    [invoices]
  );

  const filteredInvoices = useMemo(() => {
    if (!searchTerm) {
      return formattedInvoices;
    }

    const lowerSearchTerm = searchTerm.toLowerCase();
    return formattedInvoices.filter(
      (invoice) =>
        invoice.invoiceFor.toLowerCase().includes(lowerSearchTerm) ||
        invoice.invoiceId.toLowerCase().includes(lowerSearchTerm)
    );
  }, [formattedInvoices, searchTerm]);

  const sortedInvoices = useMemo(
    () =>
      [...filteredInvoices].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    [filteredInvoices]
  );

  function handleCreateInvoice() {
    const newInvoice = generateId(initialFormData as InvoiceFormData);

    handleOpenInvoice(newInvoice.id);
  }

  function handleOpenInvoice(id: string) {
    router.navigate({
      to: "/invoice/$invoice",
      params: { invoice: id },
    });
  }

  const columns: TableColumn<InvoiceListItem>[] = [
    {
      key: "invoiceId",
      label: "Id",
      width: "w-[15%]",
      cellClassName: "whitespace-nowrap font-medium",
      renderCell: (invoice) => (
        <button
          className="text-primary"
          onClick={() => handleOpenInvoice(invoice.id)}
          type="button"
        >
          {invoice.invoiceId || "No ID"}
        </button>
      ),
    },
    {
      key: "invoiceDate",
      label: "Date",
      width: "w-[15%]",
      cellClassName: "whitespace-nowrap",
      renderCell: (invoice) => invoice.invoiceDate,
    },
    {
      key: "invoiceFor",
      label: "Client",
      width: "w-[40%]",
      cellClassName: "min-w-0 truncate",
      renderCell: (invoice) => invoice.invoiceFor,
    },
    {
      key: "total",
      label: "Total",
      width: "w-[15%]",
      cellClassName: "whitespace-nowrap",
      renderCell: (invoice) => formatCurrency(invoice.total, invoice.currency),
    },
  ];

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
    bulkDeleteInvoices([...selectedInvoices]);
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
        <EmptyListView handleCreate={handleCreateInvoice} title="invoices" />
      )}

      {sortedInvoices.length > 0 && (
        <TableView
          actionColumnWidth="w-[15%]"
          columns={columns}
          duplicateItem={duplicateInvoice}
          items={sortedInvoices}
          loadItems={getAllInvoicesAsync}
          openItem={handleOpenInvoice}
          setItems={setInvoices}
          setPendingDeleteId={setPendingDeleteId}
          setSelectedItems={setSelectedInvoices}
          selectedItems={selectedInvoices}
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
