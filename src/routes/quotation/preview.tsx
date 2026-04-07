import { ArrowUUpLeftIcon, PrinterIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";

import { DocumentPrintStyles } from "@/components/shared/document-print-styles";
import { Button } from "@/components/ui/Button";
import { formatDecimal, generatePrintFilename } from "@/lib/utils";
import { useQuotationData } from "@/stores/quotation-store";
import {
  getDepositByCurrency,
  getFinalPaymentByCurrency,
  getSecondPaymentByCurrency,
  getTotalByCurrency,
} from "@/utils/calculations";

export const Route = createFileRoute("/quotation/preview")({
  component: RouteComponent,
});

function RouteComponent() {
  const formData = useQuotationData();

  const totalsByCurrency = getTotalByCurrency(formData.items);
  const depositsByCurrency = getDepositByCurrency(
    formData.paymentType,
    formData.depositPercent,
    totalsByCurrency
  );
  const secondPaymentsByCurrency = getSecondPaymentByCurrency(
    formData.hasSecondPayment,
    formData.secondPaymentPercent,
    totalsByCurrency
  );
  const finalPaymentsByCurrency = getFinalPaymentByCurrency(
    totalsByCurrency,
    depositsByCurrency,
    secondPaymentsByCurrency
  );
  const currencies = Object.keys(totalsByCurrency);
  const backUrl = `/quotation/${formData.id}`;

  function printQuotation() {
    // Save original title
    const originalTitle = document.title;
    // Create filename from quotation details
    const printTitle = generatePrintFilename(
      formData.quotationFrom.company || "",
      formData.quotationFor.company || "",
      formData.quotationId || ""
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

  function calculateFinalPaymentPercent() {
    if (formData.paymentType === "Recurring payment") {
      return formData.hasSecondPayment
        ? 100 - formData.secondPaymentPercent
        : 100;
    }
    if (formData.hasSecondPayment) {
      return 100 - formData.depositPercent - formData.secondPaymentPercent;
    }
    return 100 - formData.depositPercent;
  }

  function renderPaymentRow(params: {
    label: string;
    value: number;
    currency: string;
    percent?: number;
    isBold?: boolean;
    key: string;
  }) {
    return (
      <tr className="border-black border-b" key={params.key}>
        <td />
        <td />
        <td />
        <td
          className={`whitespace-nowrap border-black border-x p-3 text-left ${params.isBold ? "font-bold" : ""}`}
        >
          {params.label}
          {params.percent !== undefined && <span> ({params.percent}%)</span>}
        </td>
        <td
          className={`whitespace-nowrap p-3 text-left ${params.isBold ? "font-bold" : ""}`}
        >
          {params.currency} {formatDecimal(params.value, 2)}
        </td>
      </tr>
    );
  }

  function renderCurrencyFooter(currency: string) {
    const finalPaymentPercent = calculateFinalPaymentPercent();
    const rows = [
      renderPaymentRow({
        label: "Total",
        value: totalsByCurrency[currency],
        currency,
        isBold: true,
        key: `total-${currency}`,
      }),
    ];

    if (formData.paymentType !== "Recurring payment") {
      rows.push(
        renderPaymentRow({
          label: "Deposit",
          value: depositsByCurrency[currency] ?? 0,
          currency,
          percent: formData.depositPercent,
          key: `deposit-${currency}`,
        })
      );
    }

    if (formData.hasSecondPayment) {
      rows.push(
        renderPaymentRow({
          label: "Second Payment",
          value: secondPaymentsByCurrency[currency] ?? 0,
          currency,
          percent: formData.secondPaymentPercent,
          key: `second-${currency}`,
        })
      );
    }

    rows.push(
      renderPaymentRow({
        label: "Final Payment",
        value: finalPaymentsByCurrency[currency] ?? 0,
        currency,
        percent: finalPaymentPercent,
        key: `final-${currency}`,
      })
    );

    return rows;
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center xl:gap-0 print:hidden">
        <h2 className="text-2xl">Quotation Preview</h2>
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
            onClick={printQuotation}
            size="sm"
          />
        </div>
      </div>

      <div className="w-[calc(100%)] overflow-x-auto pr-px font-sans xl:w-full">
        <div
          className="min-w-[600px] bg-card text-text print:bg-white print:text-black"
          style={{ border: "2px solid #000" }}
        >
          {/* Header */}
          <div className="border-black border-b-2 p-4">
            <div className="flex items-center justify-between">
              <h1 className="font-bold text-2xl">{formData.projectTitle}</h1>
              <div className="flex gap-2">
                <span className="self-center text-muted-foreground">
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
                  <td className="border-black border-r p-3">
                    <div className="text-sm">
                      <strong>Quotation No #</strong>
                    </div>
                    <div>{formData.quotationId}</div>
                  </td>
                  <td className="border-black p-3">
                    <div className="text-sm">
                      <strong>Quotation Date</strong>
                    </div>
                    <div>{formData.quotationDate}</div>
                  </td>
                </tr>
                <tr>
                  <td className="border-black border-r p-3">
                    <div className="text-sm">
                      <strong>Quotation From</strong>
                    </div>
                    <div>{formData.quotationFrom.company}</div>
                  </td>
                  <td className="p-3">
                    <div className="text-sm">
                      <strong>Quotation For</strong>
                    </div>
                    <div>{formData.quotationFor.company}</div>
                  </td>
                </tr>
                <tr className="border-black border-t">
                  <td className="p-3" colSpan={2}>
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
              <tr className="border-black border-b-2 bg-muted">
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
              {currencies.flatMap((currency) => renderCurrencyFooter(currency))}
            </tfoot>
          </table>

          {/* Terms and Conditions */}
          <div className="p-3">
            <h3 className="mb-2 font-bold">Terms and Conditions</h3>
            <ol className="space-y-1">
              {formData.terms.map((term, index) => (
                <li className="text-sm" key={`term-${index}`}>
                  {index + 1}. {term}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <DocumentPrintStyles />
    </section>
  );
}
