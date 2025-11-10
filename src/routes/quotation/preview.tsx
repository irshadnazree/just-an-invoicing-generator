import {
  ArrowLeftIcon,
  DownloadIcon,
  FileArrowDownIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { exportJSON, formatDecimal, generatePrintFilename } from "@/lib/utils";
import { useQuotationStore } from "@/stores/quotation-store";

export const Route = createFileRoute("/quotation/preview")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    formData,
    calculateTotalByCurrency,
    calculateDepositByCurrency,
    calculateSecondPaymentByCurrency,
    calculateFinalPaymentByCurrency,
  } = useQuotationStore();

  const totalsByCurrency = calculateTotalByCurrency();
  const depositsByCurrency = calculateDepositByCurrency();
  const secondPaymentsByCurrency = calculateSecondPaymentByCurrency();
  const finalPaymentsByCurrency = calculateFinalPaymentByCurrency();
  const currencies = Object.keys(totalsByCurrency);

  const printQuotation = () => {
    // Save original title
    const originalTitle = document.title;
    // Create filename from quotation details
    const printTitle = generatePrintFilename(
      formData.quotationFrom.company || "",
      formData.quotationFor.company || "",
      formData.quotationNumber || ""
    );
    // Set title for print filename
    document.title = printTitle;
    // Print
    window.print();
    // Restore title after a short delay
    setTimeout(() => {
      document.title = originalTitle;
    }, 100);
  };

  const handleExportJSON = () => {
    const exportData = {
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),
    };
    exportJSON(exportData, `quotation-${formData.quotationNumber}.json`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-8xl">
        <div className="mb-4 flex gap-2 print:hidden">
          <Link to="/quotation">
            <Button icon={<ArrowLeftIcon className="h-5 w-5" />}>
              Back to Edit
            </Button>
          </Link>
          <Button
            icon={<DownloadIcon className="h-5 w-5" />}
            onClick={printQuotation}
          >
            Print / Save PDF
          </Button>
          <Button
            icon={<FileArrowDownIcon className="h-5 w-5" />}
            onClick={handleExportJSON}
          >
            Export JSON
          </Button>
        </div>

        <div className="bg-white" style={{ border: "2px solid #000" }}>
          {/* Header */}
          <div className="border-black border-b-2 p-6">
            <div className="flex items-start justify-between">
              <h1 className="font-bold text-2xl">{formData.projectTitle}</h1>
              <div className="flex gap-2">
                <span className="self-center text-gray-600 text-sm">
                  {formData.paymentType}
                </span>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="border-black border-b-2">
            <table className="w-full">
              <tbody>
                <tr className="border-black border-b">
                  <td className="w-1/3 border-black border-r p-3">
                    <div className="text-sm">
                      <strong>Quotation No #</strong>
                    </div>
                    <div>{formData.quotationNumber}</div>
                  </td>
                  <td className="w-1/3 border-black border-r p-3">
                    <div className="text-sm">
                      <strong>Quotation From</strong>
                    </div>
                    <div>{formData.quotationFrom.company}</div>
                  </td>
                  <td className="w-1/3 p-3">
                    <div className="text-sm">
                      <strong>Quotation For</strong>
                    </div>
                    <div>{formData.quotationFor.company}</div>
                  </td>
                </tr>
                <tr>
                  <td className="border-black border-r p-3">
                    <div className="text-sm">
                      <strong>Quotation Date</strong>
                    </div>
                    <div>{formData.quotationDate}</div>
                  </td>
                  <td className="border-black border-r p-3">
                    <div>{formData.quotationFrom.country}</div>
                  </td>
                  <td className="p-3">
                    <div>{formData.quotationFor.country}</div>
                  </td>
                </tr>
                <tr className="border-black border-t">
                  <td className="p-3" colSpan={3}>
                    <div className="text-sm">
                      <strong>Bank Account Number</strong>
                    </div>
                    <div>{formData.bankAccount}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Items Table */}
          <table className="w-full">
            <thead>
              <tr className="border-black border-b-2 bg-gray-50">
                <th className="w-10 border-black border-r p-3 text-left" />
                <th className="border-black border-r p-3 text-left">Item</th>
                <th className="w-32 border-black border-r p-3 text-center">
                  Quantity <br />
                  (Work Day)
                </th>
                <th className="w-32 border-black border-r p-3 text-left">
                  Rate
                </th>
                <th className="w-32 p-3 text-left">Amount</th>
              </tr>
            </thead>
            <tbody>
              {formData.items.map((item, index) => (
                <tr
                  className="border-black border-b"
                  key={`item-${index}-${item.name}`}
                >
                  <td className="border-black border-r p-3 text-center">
                    {index + 1}
                  </td>
                  <td className="border-black border-r p-3">
                    <span className="mb-2 font-semibold">{item.name}</span>
                    {item.details.length > 0 && (
                      <ul className="list-inside list-disc space-y-1 text-sm">
                        {item.details.map((detail, idx) => (
                          <li key={`detail-${index}-${idx}-${detail}`}>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                  <td className="border-black border-r p-3 text-center">
                    {item.quantity}
                  </td>
                  <td className="border-black border-r p-3 text-left">
                    {item.currency || formData.currency} {item.rate}
                  </td>
                  <td className="whitespace-nowrap p-3 text-left">
                    {item.currency || formData.currency}{" "}
                    {formatDecimal(item.quantity * item.rate, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              {currencies.map((currency) => [
                <tr className="border-black border-b" key={`total-${currency}`}>
                  <td />
                  <td />
                  <td />
                  <td className="border-black border-x p-3 text-left font-bold">
                    Total ({currency})
                  </td>
                  <td className="whitespace-nowrap p-3 text-left font-bold">
                    {currency} {formatDecimal(totalsByCurrency[currency], 2)}
                  </td>
                </tr>,
                formData.paymentType !== "Recurring payment" && (
                  <tr
                    className="border-black border-b"
                    key={`deposit-${currency}`}
                  >
                    <td />
                    <td />
                    <td />
                    <td className="border-black border-x p-3 text-left">
                      Deposit ({currency}) <br />({formData.depositPercent}%)
                    </td>
                    <td className="whitespace-nowrap p-3 text-left">
                      {currency}{" "}
                      {formatDecimal(depositsByCurrency[currency] ?? 0, 2)}
                    </td>
                  </tr>
                ),
                formData.hasSecondPayment && (
                  <tr
                    className="border-black border-b"
                    key={`second-${currency}`}
                  >
                    <td />
                    <td />
                    <td />
                    <td className="border-black border-x p-3 text-left">
                      Second Payment ({currency}) <br />(
                      {formData.secondPaymentPercent}%)
                    </td>
                    <td className="p-3 text-left">
                      {currency}{" "}
                      {formatDecimal(
                        secondPaymentsByCurrency[currency] ?? 0,
                        2
                      )}
                    </td>
                  </tr>
                ),
                <tr className="border-black border-b" key={`final-${currency}`}>
                  <td />
                  <td />
                  <td />
                  <td className="whitespace-nowrap border-black border-x p-3 text-left">
                    Final Payment ({currency}) <br />({(() => {
                      if (formData.paymentType === "Recurring payment") {
                        return formData.hasSecondPayment
                          ? 100 - formData.secondPaymentPercent
                          : 100;
                      }
                      if (formData.hasSecondPayment) {
                        return (
                          100 -
                          formData.depositPercent -
                          formData.secondPaymentPercent
                        );
                      }
                      return 100 - formData.depositPercent;
                    })()}
                    %)
                  </td>
                  <td className="whitespace-nowrap p-3 text-left">
                    {currency}{" "}
                    {formatDecimal(finalPaymentsByCurrency[currency] ?? 0, 2)}
                  </td>
                </tr>,
              ])}
            </tfoot>
          </table>
        </div>

        {/* Terms and Conditions */}
        <div className="border-2 border-black p-3">
          <h3 className="mb-3 font-bold">Terms and Conditions</h3>
          <ol className="space-y-2">
            {formData.terms.map((term, index) => (
              <li className="text-sm" key={`term-${term}`}>
                {index + 1}. {term}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <style>{`
      @media print {
        @page {
          size: A4;
          margin-top: 1cm;
          margin-bottom: 1cm;
          margin-left: 0.25cm;
          margin-right: 0.25cm;
          /* Remove browser print headers and footers */
          @top-left { content: ""; }
          @top-center { content: ""; }
          @top-right { content: ""; }
          @bottom-left { content: ""; }
          @bottom-center { content: ""; }
          @bottom-right { content: ""; }
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        body {
          font-size: 0.75em;
          margin: 0;
          padding: 0;
          background: white !important;
        }
        
        /* Hide title element if visible */
        title {
          display: none !important;
        }
        
        head {
          display: none !important;
        }
        
        .min-h-screen {
          min-height: auto !important;
          background: white !important;
          padding: 0 !important;
        }
        
        .max-w-8xl {
          max-width: 95% !important;
          margin: 0 auto !important;
        }
        
        .print\\:hidden {
          display: none !important;
        }
        
        .bg-gray-50 {
          background: white !important;
        }
        
        .bg-white {
          background: white !important;
        }
        
        .bg-yellow-400 {
          background-color: #facc15 !important;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        
        /* Reduce padding in print */
        .p-6 {
          padding: 0.75rem !important;
        }
        
        .p-3 {
          padding: 0.5rem !important;
        }
        
        /* Reduce column widths in print */
        .w-10 {
          width: 2rem !important;
        }
        
        .w-32 {
          width: 5rem !important;
        }
        
        table {
          page-break-inside: auto;
        }
        
        tr {
          page-break-inside: avoid;
          page-break-after: auto;
        }
        
        thead {
          display: table-header-group;
        }
        
        tfoot {
          display: table-footer-group;
        }
        
        .border-black {
          border-color: #000 !important;
        }
        
        .border-b-2 {
          border-bottom-width: 2px !important;
          border-bottom-style: solid !important;
        }
        
        .border-t-2 {
          border-top-width: 2px !important;
          border-top-style: solid !important;
        }
        
        .border-r {
          border-right-width: 1px !important;
          border-right-style: solid !important;
        }
        
        .border-b {
          border-bottom-width: 1px !important;
          border-bottom-style: solid !important;
        }
        
        .border-x {
          border-left-width: 1px !important;
          border-left-style: solid !important;
          border-right-width: 1px !important;
          border-right-style: solid !important;
        }
        
        /* Match font size scale for li elements - use em to maintain relative scale */
        li {
          font-size: 0.875em !important;
        }
        
        .text-sm {
          font-size: 0.875em !important;
        }
      }
    `}</style>
    </div>
  );
}
