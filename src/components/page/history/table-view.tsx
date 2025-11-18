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
import { useQuotationStore } from "@/stores/quotation-store";
import type { QuotationFormData, QuotationListItem } from "@/types/quotation";

type TableViewProps = {
  quotations: QuotationListItem[];
  setQuotations: (quotations: QuotationFormData[]) => void;
  selectedQuotations: Set<string>;
  setSelectedQuotations: (selectedQuotations: Set<string>) => void;
  setPendingDeleteId: (pendingDeleteId: string | null) => void;
};

export default function TableView({
  quotations,
  setQuotations,
  selectedQuotations,
  setSelectedQuotations,
  setPendingDeleteId,
}: TableViewProps) {
  const router = useRouter();
  const { getAllQuotationsAsync, duplicateQuotation } = useQuotationStore();

  const tableHeaders = [
    { label: "Id", key: "id", width: "w-[6%]" },
    { label: "Project", key: "projectTitle", width: "w-[38%]" },
    { label: "Payment Type", key: "paymentType", width: "w-[12%]" },
    { label: "Client", key: "quotationFor", width: "w-[18%]" },
    { label: "Total", key: "total", width: "w-[10%]" },
    { label: "Actions", key: "actions", width: "w-[12%]" },
  ];

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
    if (selectedQuotations.size === quotations.length) {
      setSelectedQuotations(new Set());
    } else {
      setSelectedQuotations(new Set(quotations.map((q) => q.id)));
    }
  }

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

  return (
    <table className="w-full table-fixed divide-y divide-text/50 bg-foreground/80">
      <thead>
        <tr>
          <th className="w-[4%] px-2 py-2 text-left">
            <Button
              icon={
                selectedQuotations.size === quotations.length ? (
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
        {quotations.map((quotation) => (
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
  );
}
