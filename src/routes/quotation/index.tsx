import {
  CopyIcon,
  EyeIcon,
  FileTextIcon,
  PlusIcon,
  TrashIcon,
  UploadIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  cn,
  exportJSON,
  formatCurrency,
  formatDecimal,
  readJsonFile,
} from "@/lib/utils";
import { useQuotationStore } from "@/stores/quotation-store";

export const Route = createFileRoute("/quotation/")({
  component: RouteComponent,
});

function RouteComponent() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    formData,
    updateField,
    updateNestedField,
    addItem,
    duplicateItem,
    removeItem,
    updateItem,
    addItemDetail,
    removeItemDetail,
    updateItemDetail,
    addTerm,
    duplicateTerm,
    removeTerm,
    updateTerm,
    calculateTotalByCurrency,
    calculateDepositByCurrency,
    calculateSecondPaymentByCurrency,
    calculateFinalPaymentByCurrency,
    importJSON,
  } = useQuotationStore();

  const totalsByCurrency = calculateTotalByCurrency();
  const depositsByCurrency = calculateDepositByCurrency();
  const secondPaymentsByCurrency = calculateSecondPaymentByCurrency();
  const finalPaymentsByCurrency = calculateFinalPaymentByCurrency();
  const currencies = Object.keys(totalsByCurrency);

  const handleExportJSON = () => {
    const exportData = {
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),
    };
    exportJSON(exportData, `quotation-${formData.quotationId}.json`);
  };

  const handleImportJSON = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const jsonData = await readJsonFile(file);
      importJSON(jsonData as Parameters<typeof importJSON>[0]);
      // Reset the input so the same file can be imported again
      event.target.value = "";
    } catch (error) {
      console.error(
        "Failed to import JSON file. Please check the file format.",
        error
      );
    }
  };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl">Create Quotation</h2>
        <div className="flex items-center gap-2">
          <Link to="/quotation/preview">
            <Button icon={<EyeIcon size={22} weight="bold" />}>Preview</Button>
          </Link>

          <Button
            icon={<UploadIcon size={22} weight="bold" />}
            onClick={() => fileInputRef.current?.click()}
          >
            Import
          </Button>
          <input
            onChange={(event) => handleImportJSON(event)}
            ref={fileInputRef}
            style={{ display: "none" }}
            type="file"
          />
          <Button
            icon={<FileTextIcon size={22} weight="bold" />}
            onClick={handleExportJSON}
          >
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="border-text border-b-2 pb-2 font-semibold">
          Project Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField className="col-span-2">
            <FormLabel id="project-title" label="Project Title" />
            <Input
              id="project-title"
              onChange={(value) => updateField("projectTitle", value as string)}
              value={formData.projectTitle}
            />
          </FormField>
          <FormField>
            <FormLabel id="quotation-id" label="Quotation id" />
            <Input
              id="quotation-id"
              onChange={(value) => updateField("quotationId", value as string)}
              type="text"
              value={formData.quotationId}
            />
          </FormField>
          <FormField>
            <FormLabel id="quotation-date" label="Quotation Date" />
            <Input
              id="quotation-date"
              onChange={(value) =>
                updateField("quotationDate", value as string)
              }
              type="date"
              value={formData.quotationDate}
            />
          </FormField>
          <FormField>
            <FormLabel id="payment-type" label="Payment Type" />
            <Input
              id="payment-type"
              onChange={(value) => updateField("paymentType", value as string)}
              value={formData.paymentType}
            />
          </FormField>
          <FormField>
            <FormLabel id="bank-account" label="Bank Account Number" />
            <Input
              id="bank-account"
              onChange={(value) => updateField("bankAccount", value as string)}
              type="text"
              value={formData.bankAccount}
            />
          </FormField>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="border-text border-b-2 pb-2 font-semibold">
          Client Information
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <FormField>
            <FormLabel id="quotation-from-company" label="Quotation From" />
            <Input
              id="quotation-from-company"
              onChange={(value) =>
                updateNestedField("quotationFrom", "company", value as string)
              }
              type="text"
              value={formData.quotationFrom.company}
            />
          </FormField>
          <FormField>
            <FormLabel id="quotation-for-company" label="Quotation For" />
            <Input
              id="quotation-for-company"
              onChange={(value) =>
                updateNestedField("quotationFor", "company", value as string)
              }
              type="text"
              value={formData.quotationFor.company}
            />
          </FormField>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b-2 pb-1">
          <h3 className="border-text font-semibold">Line Items</h3>
          <Button
            icon={<PlusIcon size={18} weight="bold" />}
            onClick={addItem}
            size="sm"
            variant="text"
          >
            Add Item
          </Button>
        </div>
        <div className="flex flex-col gap-6">
          {formData.items.map((item, itemIndex) => (
            <Card key={`item-${itemIndex + 1}`}>
              <div className="mb-2 flex items-start justify-between">
                <p>Item {itemIndex + 1}</p>
                <div className="flex items-center">
                  <Button
                    icon={<CopyIcon size={18} />}
                    onClick={() => duplicateItem(itemIndex)}
                    size="sm"
                    variant="text"
                  />

                  <Button
                    icon={<TrashIcon size={18} />}
                    onClick={() => removeItem(itemIndex)}
                    size="sm"
                    variant="text"
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                <FormField className="col-span-4">
                  <FormLabel id="item-name" label="Item Name" />
                  <Input
                    id={`item-name-${itemIndex}`}
                    onChange={(value) =>
                      updateItem(itemIndex, "name", value as string)
                    }
                    value={item.name}
                  />
                </FormField>
                <FormField>
                  <FormLabel id="item-quantity" label="Quantity" />
                  <Input
                    id={`item-quantity-${itemIndex}`}
                    onChange={(value) =>
                      updateItem(itemIndex, "quantity", value as number)
                    }
                    type="number"
                    value={item.quantity || 0}
                  />
                </FormField>
                <FormField>
                  <FormLabel id="item-rate" label="Rate" />
                  <Input
                    id={`item-rate-${itemIndex}`}
                    onChange={(value) =>
                      updateItem(itemIndex, "rate", value as number)
                    }
                    type="number"
                    value={item.rate || 0}
                  />
                </FormField>
                <FormField>
                  <FormLabel id="item-currency" label="Currency" />
                  <Select
                    id={`item-currency-${itemIndex}`}
                    onChange={(value) =>
                      updateItem(itemIndex, "currency", value)
                    }
                    options={[
                      { value: "RM", label: "MYR" },
                      { value: "USD", label: "USD" },
                    ]}
                    value={item.currency || formData.currency || "RM"}
                  />
                </FormField>
                <FormField>
                  <FormLabel id="item-amount" label="Amount" />
                  <Input
                    disabled
                    id={`item-amount-${itemIndex}`}
                    type="text"
                    value={formatCurrency(
                      item.quantity * item.rate || 2,
                      item.currency || formData.currency || "RM"
                    )}
                  />
                </FormField>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <FormLabel id="item-details" label="Details" />
                  <Button
                    icon={<PlusIcon size={18} />}
                    onClick={() => addItemDetail(itemIndex)}
                    size="sm"
                    variant="text"
                  >
                    Add Detail
                  </Button>
                </div>
                <div className="flex flex-col gap-2">
                  {item.details.map((detail, detailIndex) => (
                    <div
                      className="flex items-center gap-2"
                      // biome-ignore lint/suspicious/noArrayIndexKey: Details are not reordered, stable index prevents focus loss
                      key={`detail-${itemIndex}-${detailIndex}`}
                    >
                      <Input
                        id={`item-detail-${itemIndex}-${detailIndex}`}
                        onChange={(value) =>
                          updateItemDetail(
                            itemIndex,
                            detailIndex,
                            value as string
                          )
                        }
                        placeholder="Enter detail"
                        value={detail}
                      />
                      <Button
                        icon={<TrashIcon size={18} />}
                        onClick={() => removeItemDetail(itemIndex, detailIndex)}
                        size="sm"
                        variant="text"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="border-text border-b-2 pb-2 font-semibold">
          Payment Details
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <FormField className="col-span-2">
            <FormLabel id="currency" label="Currency" />
            <Input
              id="currency"
              onChange={(value) => updateField("currency", value as string)}
              type="text"
              value={formData.currency}
            />
          </FormField>
          <FormField
            className={cn(
              formData.hasSecondPayment ? "col-span-1" : "col-span-2"
            )}
          >
            <FormLabel id="deposit-percent" label="Deposit Percentage (%)" />
            <Input
              id="deposit-percent"
              onChange={(value) => updateField("depositPercent", Number(value))}
              type="number"
              value={formData.depositPercent}
            />
          </FormField>
          {formData.hasSecondPayment && (
            <FormField>
              <FormLabel
                id="second-payment-percent"
                label="Second Payment Percentage (%)"
              />
              <Input
                id="second-payment-percent"
                onChange={(value) =>
                  updateField("secondPaymentPercent", value as number)
                }
                type="number"
                value={formData.secondPaymentPercent || 0}
              />
            </FormField>
          )}
        </div>
        <FormField>
          <Checkbox
            checked={formData.hasSecondPayment}
            id="has-second-payment"
            label="Enable Second Payment Option"
            onChange={(checked) => updateField("hasSecondPayment", checked)}
          />
        </FormField>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {currencies.map((currency) => (
              <div className="flex flex-col gap-2" key={currency}>
                <div className="font-semibold text-sm">{currency} Totals</div>
                <Card
                  className={cn(
                    "grid",
                    formData.paymentType !== "Recurring payment" &&
                      formData.hasSecondPayment
                      ? "grid-cols-4"
                      : "grid-cols-3",
                    formData.paymentType === "Recurring payment" &&
                      "grid-cols-2"
                  )}
                >
                  <div>
                    <div className="mb-1 text-sm">Total</div>
                    <div className="font-bold text-xl">
                      {currency} {formatDecimal(totalsByCurrency[currency], 2)}
                    </div>
                  </div>
                  {formData.paymentType !== "Recurring payment" && (
                    <div>
                      <div className="mb-1 text-sm">
                        Deposit ({formData.depositPercent}%)
                      </div>
                      <div className="font-bold text-teal-600 text-xl">
                        {currency}{" "}
                        {formatDecimal(depositsByCurrency[currency] ?? 0, 2)}
                      </div>
                    </div>
                  )}
                  {formData.hasSecondPayment && (
                    <div>
                      <div className="mb-1 text-sm">
                        Second Payment ({formData.secondPaymentPercent}%)
                      </div>
                      <div className="font-bold text-teal-600 text-xl">
                        {currency}{" "}
                        {formatDecimal(
                          secondPaymentsByCurrency[currency] ?? 0,
                          2
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <div className="mb-1 text-sm">
                      Final Payment
                      {(() => {
                        if (formData.paymentType === "Recurring payment") {
                          return formData.hasSecondPayment
                            ? ` (${100 - formData.secondPaymentPercent}%)`
                            : "";
                        }
                        if (formData.hasSecondPayment) {
                          return ` (${
                            100 -
                            formData.depositPercent -
                            formData.secondPaymentPercent
                          }%)`;
                        }
                        return ` (${100 - formData.depositPercent}%)`;
                      })()}
                    </div>
                    <div className="font-bold text-teal-600 text-xl">
                      {currency}{" "}
                      {formatDecimal(finalPaymentsByCurrency[currency] ?? 0, 2)}
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between border-b-2 pb-1">
          <h3 className="border-text font-semibold">
            Terms and Conditions Details
          </h3>
          <Button
            icon={<PlusIcon size={22} weight="bold" />}
            onClick={addTerm}
            size="sm"
            variant="text"
          >
            Add Term
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          {formData.terms.map((term, index) => (
            <Card key={`term-${index + 1}`}>
              <div className="mb-2 flex items-start justify-between">
                <h3 className="font-semibold text-lg">Term {index + 1}</h3>
                <div className="flex items-center">
                  <Button
                    icon={<CopyIcon size={18} />}
                    onClick={() => duplicateTerm(index)}
                    size="sm"
                    variant="text"
                  />

                  <Button
                    icon={<TrashIcon size={18} />}
                    onClick={() => removeTerm(index)}
                    size="sm"
                    variant="text"
                  />
                </div>
              </div>
              <Textarea
                id={`term-${index}`}
                onChange={(value) => updateTerm(index, value as string)}
                placeholder="Enter term"
                value={term}
              />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
