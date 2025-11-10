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
import { AmountDisplay } from "@/components/amount-display";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn, exportJSON, formatDecimal, readJsonFile } from "@/lib/utils";
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-bold text-3xl">Create Quotation</h1>
            <div className="flex items-center gap-2">
              <Link to="/quotation/preview">
                <Button icon={<EyeIcon className="h-5 w-5" />}>
                  Preview Quotation
                </Button>
              </Link>
              <Button
                icon={<UploadIcon className="h-5 w-5" />}
                onClick={() => fileInputRef.current?.click()}
              >
                Import JSON
                <input
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJSON}
                  ref={fileInputRef}
                  type="file"
                />
              </Button>
              <Button
                icon={<FileTextIcon className="h-5 w-5" />}
                onClick={handleExportJSON}
              >
                Export JSON
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Project Details */}
            <section className="flex flex-col gap-4">
              <h2 className="border-b pb-2 font-semibold text-xl">
                Project Details
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <FormField className="col-span-2">
                  <FormLabel id="project-title" label="Project Title" />
                  <Input
                    id="project-title"
                    onChange={(value) =>
                      updateField("projectTitle", value as string)
                    }
                    value={formData.projectTitle}
                  />
                </FormField>

                <FormField>
                  <FormLabel id="quotation-number" label="Quotation Number" />
                  <Input
                    id="quotation-number"
                    onChange={(value) =>
                      updateField("quotationNumber", value as string)
                    }
                    type="text"
                    value={formData.quotationNumber}
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
                  <Select
                    id="payment-type"
                    onChange={(value) => updateField("paymentType", value)}
                    options={[
                      { value: "One-time payment", label: "One-time payment" },
                      {
                        value: "Recurring payment",
                        label: "Recurring payment",
                      },
                    ]}
                    placeholder="Select payment type"
                    value={formData.paymentType}
                  />
                </FormField>
                <FormField>
                  <FormLabel id="bank-account" label="Bank Account Number" />
                  <Input
                    id="bank-account"
                    onChange={(value) =>
                      updateField("bankAccount", value as string)
                    }
                    value={formData.bankAccount}
                  />
                </FormField>
              </div>
            </section>

            {/* Client Information */}
            <section className="flex flex-col gap-4">
              <h2 className="border-b pb-2 font-semibold text-xl">
                Client Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormField>
                    <FormLabel
                      id="quotation-from-company"
                      label="Quotation From"
                    />
                    <Input
                      id="quotation-from-company"
                      onChange={(value) =>
                        updateNestedField(
                          "quotationFrom",
                          "company",
                          value as string
                        )
                      }
                      value={formData.quotationFrom.company}
                    />
                  </FormField>
                </div>
                <div>
                  <FormField>
                    <FormLabel
                      id="quotation-from-company"
                      label="Quotation For"
                    />
                    <Input
                      id="quotation-from-company"
                      onChange={(value) =>
                        updateNestedField(
                          "quotationFrom",
                          "company",
                          value as string
                        )
                      }
                      value={formData.quotationFrom.company}
                    />
                  </FormField>
                </div>
              </div>
            </section>

            {/* Line Items */}
            <section className="flex flex-col gap-4">
              <div className="mb-4 flex items-center justify-between border-b">
                <h2 className="pb-2 font-semibold text-xl">Line Items</h2>

                <Button
                  icon={<PlusIcon className="size-4" />}
                  onClick={addItem}
                  size="sm"
                  type="button"
                  variant="text"
                >
                  Add Item
                </Button>
              </div>

              <div className="flex flex-col gap-6">
                {formData.items.map((item, itemIndex) => (
                  <Card key={`item-${itemIndex + 1}`}>
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-lg">
                        Item {itemIndex + 1}
                      </h3>
                      <div className="flex items-center">
                        <Button
                          icon={<CopyIcon className="h-5 w-5" />}
                          onClick={() => duplicateItem(itemIndex)}
                          size="icon"
                          title="Duplicate item"
                          variant="text"
                        />

                        <Button
                          icon={<TrashIcon className="h-5 w-5" />}
                          onClick={() => removeItem(itemIndex)}
                          size="icon"
                          title="Remove item"
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
                      <AmountDisplay
                        id={`item-amount-${itemIndex}`}
                        label="Amount"
                        prefix={item.currency || formData.currency || "RM"}
                        value={formatDecimal(item.quantity * item.rate, 2)}
                      />
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <FormLabel id="item-details" label="Details" />
                        <Button
                          icon={<PlusIcon className="h-3 w-3" />}
                          onClick={() => addItemDetail(itemIndex)}
                          size="sm"
                          type="button"
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
                              icon={<TrashIcon className="size-5" />}
                              onClick={() =>
                                removeItemDetail(itemIndex, detailIndex)
                              }
                              size="icon"
                              title="Remove detail"
                              variant="text"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Payment Settings */}
            <section className="flex flex-col gap-4">
              <h2 className="border-b pb-2 font-semibold text-xl">
                Payment Settings
              </h2>
              <div className="grid grid-cols-4 gap-4">
                <FormField
                  className={cn(
                    formData.paymentType !== "Recurring payment"
                      ? "col-span-2"
                      : "col-span-4"
                  )}
                >
                  <FormLabel id="currency" label="Currency" />
                  <Select
                    id="currency"
                    onChange={(value) => updateField("currency", value)}
                    options={[
                      { value: "RM", label: "MYR" },
                      { value: "USD", label: "USD" },
                    ]}
                    value={formData.currency}
                  />
                </FormField>
                {formData.paymentType !== "Recurring payment" && (
                  <>
                    <FormField
                      className={cn(
                        formData.hasSecondPayment ? "col-span-1" : "col-span-2"
                      )}
                    >
                      <FormLabel
                        id="deposit-percent"
                        label="Deposit Percentage (%)"
                      />
                      <Input
                        id="deposit-percent"
                        onChange={(value) =>
                          updateField("depositPercent", value as number)
                        }
                        type="number"
                        value={formData.depositPercent || 0}
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
                    <FormField>
                      <Checkbox
                        checked={formData.hasSecondPayment}
                        id="has-second-payment"
                        label="Enable Second Payment Option"
                        onChange={(checked) =>
                          updateField("hasSecondPayment", checked)
                        }
                      />
                    </FormField>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-4">
                {(() => {
                  const totalsByCurrency = calculateTotalByCurrency();
                  const depositsByCurrency = calculateDepositByCurrency();
                  const secondPaymentsByCurrency =
                    calculateSecondPaymentByCurrency();
                  const finalPaymentsByCurrency =
                    calculateFinalPaymentByCurrency();
                  const currencies = Object.keys(totalsByCurrency);

                  return (
                    <div className="flex flex-col gap-4">
                      {currencies.map((currency) => (
                        <div className="flex flex-col gap-2" key={currency}>
                          <div className="font-semibold text-sm">
                            {currency} Totals
                          </div>
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
                                {currency}{" "}
                                {formatDecimal(totalsByCurrency[currency], 2)}
                              </div>
                            </div>
                            {formData.paymentType !== "Recurring payment" && (
                              <div>
                                <div className="mb-1 text-sm">
                                  Deposit ({formData.depositPercent}%)
                                </div>
                                <div className="font-bold text-teal-600 text-xl">
                                  {currency}{" "}
                                  {formatDecimal(
                                    depositsByCurrency[currency] ?? 0,
                                    0
                                  )}
                                </div>
                              </div>
                            )}
                            {formData.hasSecondPayment && (
                              <div>
                                <div className="mb-1 text-sm">
                                  Second Payment (
                                  {formData.secondPaymentPercent}%)
                                </div>
                                <div className="font-bold text-teal-600 text-xl">
                                  {currency}{" "}
                                  {formatDecimal(
                                    secondPaymentsByCurrency[currency] ?? 0,
                                    0
                                  )}
                                </div>
                              </div>
                            )}
                            <div>
                              <div className="mb-1 text-sm">
                                Final Payment
                                {(() => {
                                  if (
                                    formData.paymentType === "Recurring payment"
                                  ) {
                                    return formData.hasSecondPayment
                                      ? ` (${
                                          100 - formData.secondPaymentPercent
                                        }%)`
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
                                {formatDecimal(
                                  finalPaymentsByCurrency[currency] ?? 0,
                                  0
                                )}
                              </div>
                            </div>
                          </Card>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            </section>

            {/* Terms and Conditions */}
            <section>
              <div className="mb-4 flex items-center justify-between border-b">
                <h2 className="pb-2 font-semibold text-xl">
                  Terms and Conditions
                </h2>

                <Button
                  icon={<PlusIcon className="size-4" />}
                  onClick={addTerm}
                  size="sm"
                  type="button"
                  variant="text"
                >
                  Add Term
                </Button>
              </div>

              <div className="space-y-3">
                {formData.terms.map((term, index) => (
                  <Card key={`term-${index + 1}`}>
                    <div className="mb-2 flex items-start justify-between">
                      <h3 className="font-semibold text-lg">
                        Term {index + 1}
                      </h3>
                      <div className="flex items-center">
                        <Button
                          icon={<CopyIcon className="h-5 w-5" />}
                          onClick={() => duplicateTerm(index)}
                          size="icon"
                          title="Duplicate term"
                          variant="text"
                        />

                        <Button
                          icon={<TrashIcon className="h-5 w-5" />}
                          onClick={() => removeTerm(index)}
                          size="icon"
                          title="Remove term"
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
