import {
  CheckSquareIcon,
  CopyIcon,
  PencilSimpleIcon,
  SquareIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { Link, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { useInvoiceStore } from "@/stores/invoice-store";
import type { InvoiceFormData, InvoiceListItem } from "@/types/invoice";

type InvoiceTableViewProps = {
  invoices: InvoiceListItem[];
  setInvoices: (invoices: InvoiceFormData[]) => void;
  selectedInvoices: Set<string>;
  setSelectedInvoices: (selectedInvoices: Set<string>) => void;
  setPendingDeleteId: (pendingDeleteId: string | null) => void;
};

export default function InvoiceTableView({
  invoices,
  setInvoices,
  selectedInvoices,
  setSelectedInvoices,
  setPendingDeleteId,
}: InvoiceTableViewProps) {
  const router = useRouter();
  const { getAllInvoicesAsync, duplicateInvoice } = useInvoiceStore();

  const tableHeaders = [
    { label: "Id", key: "invoiceId", width: "w-[15%]" },
    { label: "Date", key: "invoiceDate", width: "w-[15%]" },
    { label: "Client", key: "invoiceFor", width: "w-[40%]" },
    { label: "Total", key: "total", width: "w-[15%]" },
    { label: "Actions", key: "actions", width: "w-[15%]" },
  ];

  function toggleInvoiceSelection(id: string) {
    const newSelection = new Set(selectedInvoices);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedInvoices(newSelection);
  }

  function toggleSelectAll() {
    if (selectedInvoices.size === invoices.length) {
      setSelectedInvoices(new Set());
    } else {
      setSelectedInvoices(new Set(invoices.map((q) => q.id)));
    }
  }

  function handleDuplicateInvoice(id: string) {
    const newId = duplicateInvoice(id);
    if (newId) {
      // Refresh the invoices list
      getAllInvoicesAsync().then(setInvoices);
      // Navigate to the new invoice
      router.navigate({
        to: "/invoice/$invoice",
        params: { invoice: newId },
      });
    }
  }

  function handleDeleteInvoice(id: string) {
    setPendingDeleteId(id);
  }

  return (
    <table className="w-full table-fixed divide-y divide-text/50 bg-foreground/80">
      <thead>
        <tr>
          <th className="w-[4%] px-2 py-2 text-left">
            <Button
              icon={
                selectedInvoices.size === invoices.length ? (
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
        {invoices.map((invoice) => (
          <tr className="hover:bg-foreground" key={invoice.id}>
            <td className="w-[4%] whitespace-nowrap px-2 py-2">
              <Button
                icon={
                  selectedInvoices.has(invoice.id) ? (
                    <CheckSquareIcon size={18} />
                  ) : (
                    <SquareIcon size={18} />
                  )
                }
                onClick={() => toggleInvoiceSelection(invoice.id)}
                size="sm"
                variant="ghost"
              />
            </td>

            <td className="w-[15%] whitespace-nowrap px-4 py-2 font-medium text-sm">
              <Link
                className="text-primary"
                params={{ invoice: invoice.id }}
                to="/invoice/$invoice"
              >
                {invoice.invoiceId || "No ID"}
              </Link>
            </td>
            <td className="w-[15%] whitespace-nowrap px-4 py-2 text-sm">
              {invoice.invoiceDate}
            </td>
            <td className="w-[40%] min-w-0 truncate px-4 py-2 text-sm">
              {invoice.invoiceFor}
            </td>
            <td className="w-[15%] whitespace-nowrap px-4 py-2 text-sm">
              {formatCurrency(invoice.total, invoice.currency)}
            </td>

            <td className="w-[15%] whitespace-nowrap px-4 py-2 text-right font-medium text-sm">
              <div
                className={cn(
                  "flex justify-start gap-1",
                  selectedInvoices.size > 0 &&
                    "pointer-events-none cursor-not-allowed opacity-50"
                )}
              >
                <Link params={{ invoice: invoice.id }} to="/invoice/$invoice">
                  <Button
                    icon={<PencilSimpleIcon size={22} />}
                    size="sm"
                    variant="ghost"
                  />
                </Link>
                <Button
                  icon={<CopyIcon size={22} />}
                  onClick={() => handleDuplicateInvoice(invoice.id)}
                  size="sm"
                  variant="ghost"
                />

                <Button
                  icon={<TrashIcon size={22} />}
                  onClick={() => handleDeleteInvoice(invoice.id)}
                  size="sm"
                  variant="ghost"
                />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

