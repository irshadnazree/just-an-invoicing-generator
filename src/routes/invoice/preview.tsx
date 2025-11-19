import { ArrowUUpLeftIcon, PrinterIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { formatDecimal, generatePrintFilename } from "@/lib/utils";
import { useInvoiceStore } from "@/stores/invoice-store";
import { numberToWords } from "@/utils/format";

export const Route = createFileRoute("/invoice/preview")({
  component: RouteComponent,
});

function RouteComponent() {
  const { formData } = useInvoiceStore();

  const subtotal = formData.items.reduce(
    (sum, item) => sum + item.quantity * item.rate,
    0
  );
  const total = subtotal - (formData.reductionAmount || 0);
  const backUrl = `/invoice/${formData.id}`;

  function printInvoice() {
    // Save original title
    const originalTitle = document.title;
    // Create filename from invoice details
    const printTitle = generatePrintFilename(
      formData.invoiceFrom.company || "",
      formData.invoiceTo.company || "",
      formData.invoiceId || ""
    );
    // Set title for print filename
    document.title = printTitle;
    // Print
    window.print();
    // Restore title after a short delay
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center xl:gap-0 print:hidden">
        <h2 className="text-2xl">Invoice Preview</h2>
        <div className="flex items-center gap-2">
          <Link to={backUrl}>
            <Button
              icon={
                <ArrowUUpLeftIcon
                  className="size-4 xl:size-5"
                  size={20}
                  weight="bold"
                />
              }
              size="sm"
            />
          </Link>
          <Button
            icon={
              <PrinterIcon
                className="size-4 xl:size-5"
                size={20}
                weight="bold"
              />
            }
            onClick={printInvoice}
            size="sm"
          />
        </div>
      </div>

      <div className="w-[calc(100%)] overflow-x-auto pr-px font-sans xl:w-full">
        <div
          className="min-w-[600px] bg-white text-black"
          style={{ border: "1px solid #000" }}
        >
          {/* Header */}
          <div className="border-black border-b p-4">
            <div className="flex items-center justify-start">
              <h1 className="font-normal text-4xl">Invoice</h1>
            </div>
          </div>

          {/* Info Section */}
          <div className="border-black border-b">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-black border-b">
                  <td className="w-1/3 border-black border-r p-3 align-top">
                    <div className="mb-4 font-bold">Invoice Details</div>
                    <div className="mb-2 grid grid-cols-[200px_1fr] gap-2">
                      <div className="font-bold">Invoice No #</div>
                      <div>{formData.invoiceId}</div>
                    </div>
                    <div className="mb-2 grid grid-cols-[200px_1fr] gap-2">
                      <div className="font-bold">Invoice Date</div>
                      <div>{formData.invoiceDate}</div>
                    </div>
                    <div className="grid grid-cols-[200px_1fr] gap-2">
                      <div className="font-bold">Bank Account Number</div>
                      <div>{formData.bankAccount}</div>
                    </div>
                  </td>
                  <td className="w-1/3 border-black border-r p-3 align-top">
                    <div className="mb-4 font-bold">Billed By</div>
                    <div className="mb-1 font-medium">
                      {formData.invoiceFrom.company}
                    </div>
                  </td>
                  <td className="w-1/3 p-3 align-top">
                    <div className="mb-4 font-bold">Billed To</div>
                    <div className="mb-1 font-medium">
                      {formData.invoiceTo.company}
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="p-2" colSpan={6}>
                    &nbsp;
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-black border-b">
                <th className="w-[4%] border-black border-r p-3 text-left" />
                <th className="w-[61%] border-black border-r p-3 text-left">
                  Item
                </th>
                <th className="w-[10%] border-black border-r p-3 text-center">
                  Quantity
                </th>
                <th className="w-[10%] border-black border-r p-3 text-center">
                  Rate
                </th>
                <th className="w-[15%] p-3 text-center">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr
                  className="border-black border-b"
                  key={`item-${index}-${item.name}`}
                >
                  <td className="border-black border-r p-3 text-center align-top">
                    {index + 1}.
                  </td>
                  <td className="border-black border-r p-3 align-top">
                    <span className="mb-2 block">{item.name}</span>
                    {item.details.length > 0 && (
                      <ul className="ml-4 list-disc space-y-1 text-sm">
                        {item.details.map((detail, idx) => (
                          <li key={`detail-${index}-${idx}-${detail}`}>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="border-black border-r p-3 text-center align-top">
                    {item.quantity}
                  </td>
                  <td className="border-black border-r p-3 text-center align-top">
                    {item.currency || formData.currency} {item.rate}
                  </td>
                  <td className="whitespace-nowrap p-3 text-center align-top">
                    {item.currency || formData.currency}{" "}
                    {formatDecimal(item.quantity * item.rate, 2)}
                  </td>
                </tr>
              ))}
              {/* Empty rows to fill space if needed, or min-height. For now just rendering items */}
            </tbody>
            <tfoot>
              {/* Spacer row */}
              <tr className="border-black border-b">
                <td className="p-2" colSpan={6}>
                  &nbsp;
                </td>
              </tr>

              {/* Reductions */}
              <tr className="border-black border-b">
                <td colSpan={3} />
                <td className="border-black border-r border-l p-3 text-center font-bold">
                  Reductions
                </td>
                <td className="p-3 text-center">
                  ({formData.currency}{" "}
                  {formatDecimal(formData.reductionAmount || 0, 2)})
                </td>
              </tr>

              {/* Total */}
              <tr className="border-black border-b">
                <td colSpan={3} />
                <td className="border-black border-r border-l p-3 text-center font-bold">
                  Total ({formData.currency})
                </td>
                <td className="p-3 text-center font-bold">
                  {formData.currency} {formatDecimal(total, 2)}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Total in Words */}
          <div className="p-4">
            <span className="font-bold">Total (in words) : </span>
            <span className="capitalize">
              {numberToWords(total)}{" "}
              {formData.currency === "RM" ? "Ringgit Only" : "Dollars Only"}
            </span>
          </div>
        </div>
      </div>
      <style>{`
      @media print {
        @page {
          size: A4;
          margin: 1cm;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body {
          color: black !important;
          font-size: 12px;
          background: white !important;
        }
        
        .print\\:hidden {
          display: none !important;
        }

        /* Ensure print uses white backgrounds */
        .bg-white {
          background: white !important;
        }
        
        /* Border adjustments for print */
        .border-black {
          border-color: #000 !important;
        }
        
        .border-b {
          border-bottom-width: 1px !important;
          border-bottom-style: solid !important;
        }
        
        .border-r {
          border-right-width: 1px !important;
          border-right-style: solid !important;
        }
        
        .border-l {
          border-left-width: 1px !important;
          border-left-style: solid !important;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }
      }
    `}</style>
    </section>
  );
}
