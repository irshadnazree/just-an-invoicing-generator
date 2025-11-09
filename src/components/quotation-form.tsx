import { Copy, Eye, FileText, Plus, Trash2, Upload } from "lucide-react";
import { useQuotationStore } from "@/stores/quotation-store";

export default function QuotationForm() {
  const {
    view: _view,
    formData,
    setView,
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
    removeTerm,
    updateTerm,
    calculateTotalByCurrency,
    calculateDepositByCurrency,
    calculateSecondPaymentByCurrency,
    calculateFinalPaymentByCurrency,
    importJSON,
  } = useQuotationStore();

  const exportJSON = () => {
    const exportData = {
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `quotation-${formData.quotationNumber}.json`;
    link.click();
  };

  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        importJSON(jsonData);
        // Reset the input so the same file can be imported again
        event.target.value = "";
      } catch (error) {
        console.error(
          "Failed to import JSON file. Please check the file format.",
          error
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="bg-white p-8 shadow-lg">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-bold text-3xl text-gray-800">
              Create Quotation
            </h1>
            <div className="flex items-center gap-4">
              <button
                className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap bg-blue-600 px-3 py-3 text-white transition hover:bg-blue-700"
                onClick={() => setView("preview")}
                type="button"
              >
                <Eye className="h-5 w-5" />
                Preview Quotation
              </button>
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 whitespace-nowrap bg-purple-600 px-3 py-3 text-white transition hover:bg-purple-700">
                <Upload className="h-5 w-5" />
                Import JSON
                <input
                  accept=".json"
                  className="hidden"
                  onChange={handleImportJSON}
                  type="file"
                />
              </label>
              <button
                className="flex flex-1 items-center justify-center gap-2 whitespace-nowrap bg-green-600 px-3 py-3 text-white transition hover:bg-green-700"
                onClick={exportJSON}
                type="button"
              >
                <FileText className="h-5 w-5" />
                Export JSON
              </button>
            </div>
          </div>

          <div className="space-y-8">
            {/* Project Details */}
            <section className="border-b pb-6">
              <h2 className="mb-4 font-semibold text-gray-700 text-xl">
                Project Details
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    className="mb-2 block font-medium text-sm"
                    htmlFor="project-title"
                  >
                    Project Title
                  </label>
                  <input
                    className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    id="project-title"
                    onChange={(e) =>
                      updateField("projectTitle", e.target.value)
                    }
                    type="text"
                    value={formData.projectTitle}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    className="mb-2 block font-medium text-sm"
                    htmlFor="payment-type"
                  >
                    Payment Type
                  </label>
                  <select
                    className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    id="payment-type"
                    onChange={(e) => updateField("paymentType", e.target.value)}
                    value={formData.paymentType}
                  >
                    <option value="">Select payment type</option>
                    <option value="One-time payment">One-time payment</option>
                    <option value="Recurring payment">Recurring payment</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Basic Information */}
            <section className="border-b pb-6">
              <h2 className="mb-4 font-semibold text-gray-700 text-xl">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className="mb-2 block font-medium text-sm"
                    htmlFor="quotation-number"
                  >
                    Quotation Number
                  </label>
                  <input
                    className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    id="quotation-number"
                    onChange={(e) =>
                      updateField("quotationNumber", e.target.value)
                    }
                    type="text"
                    value={formData.quotationNumber}
                  />
                </div>
                <div>
                  <label
                    className="mb-2 block font-medium text-sm"
                    htmlFor="quotation-date"
                  >
                    Quotation Date
                  </label>
                  <input
                    className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    id="quotation-date"
                    onChange={(e) =>
                      updateField("quotationDate", e.target.value)
                    }
                    type="date"
                    value={formData.quotationDate}
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    className="mb-2 block font-medium text-sm"
                    htmlFor="bank-account"
                  >
                    Bank Account Number
                  </label>
                  <input
                    className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    id="bank-account"
                    onChange={(e) => updateField("bankAccount", e.target.value)}
                    type="text"
                    value={formData.bankAccount}
                  />
                </div>
              </div>
            </section>

            {/* From and For */}
            <section className="border-b pb-6">
              <h2 className="mb-4 font-semibold text-gray-700 text-xl">
                Company Information
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-600">
                    Quotation From
                  </h3>
                  <div>
                    <label
                      className="mb-2 block font-medium text-sm"
                      htmlFor="quotation-from-company"
                    >
                      Company Name
                    </label>
                    <input
                      className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      id="quotation-from-company"
                      onChange={(e) =>
                        updateNestedField(
                          "quotationFrom",
                          "company",
                          e.target.value
                        )
                      }
                      type="text"
                      value={formData.quotationFrom.company}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-2 block font-medium text-sm"
                      htmlFor="quotation-from-country"
                    >
                      Country
                    </label>
                    <input
                      className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      id="quotation-from-country"
                      onChange={(e) =>
                        updateNestedField(
                          "quotationFrom",
                          "country",
                          e.target.value
                        )
                      }
                      type="text"
                      value={formData.quotationFrom.country}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-600">Quotation For</h3>
                  <div>
                    <label
                      className="mb-2 block font-medium text-sm"
                      htmlFor="quotation-for-company"
                    >
                      Company Name
                    </label>
                    <input
                      className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      id="quotation-for-company"
                      onChange={(e) =>
                        updateNestedField(
                          "quotationFor",
                          "company",
                          e.target.value
                        )
                      }
                      type="text"
                      value={formData.quotationFor.company}
                    />
                  </div>
                  <div>
                    <label
                      className="mb-2 block font-medium text-sm"
                      htmlFor="quotation-for-country"
                    >
                      Country
                    </label>
                    <input
                      className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      id="quotation-for-country"
                      onChange={(e) =>
                        updateNestedField(
                          "quotationFor",
                          "country",
                          e.target.value
                        )
                      }
                      type="text"
                      value={formData.quotationFor.country}
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Line Items */}
            <section className="border-b pb-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-700 text-xl">
                  Line Items
                </h2>
                <button
                  className="flex items-center gap-2 bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  onClick={addItem}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add Item
                </button>
              </div>

              <div className="space-y-6">
                {formData.items.map((item, itemIndex) => (
                  <div
                    className="border border-gray-300 bg-gray-50 p-6"
                    // biome-ignore lint/suspicious/noArrayIndexKey: Items are not reordered, stable index prevents focus loss
                    key={`item-${itemIndex}`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <h3 className="font-semibold text-lg">
                        Item {itemIndex + 1}
                      </h3>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 transition hover:text-blue-700"
                          onClick={() => duplicateItem(itemIndex)}
                          title="Duplicate item"
                          type="button"
                        >
                          <Copy className="h-5 w-5" />
                        </button>
                        {formData.items.length > 1 && (
                          <button
                            className="text-red-600 transition hover:text-red-700"
                            onClick={() => removeItem(itemIndex)}
                            title="Remove item"
                            type="button"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div className="md:col-span-4">
                        <label
                          className="mb-2 block font-medium text-sm"
                          htmlFor={`item-name-${itemIndex}`}
                        >
                          Item Name
                        </label>
                        <input
                          className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          id={`item-name-${itemIndex}`}
                          onChange={(e) =>
                            updateItem(itemIndex, "name", e.target.value)
                          }
                          type="text"
                          value={item.name}
                        />
                      </div>
                      <div>
                        <label
                          className="mb-2 block font-medium text-sm"
                          htmlFor={`item-quantity-${itemIndex}`}
                        >
                          Quantity
                          {formData.paymentType !== "Recurring payment" &&
                            " (Work Days)"}
                        </label>
                        <input
                          className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          id={`item-quantity-${itemIndex}`}
                          onChange={(e) =>
                            updateItem(
                              itemIndex,
                              "quantity",
                              e.target.value === ""
                                ? 0
                                : Number.parseInt(e.target.value, 10) || 0
                            )
                          }
                          type="number"
                          value={item.quantity || ""}
                        />
                      </div>
                      <div>
                        <label
                          className="mb-2 block font-medium text-sm"
                          htmlFor={`item-rate-${itemIndex}`}
                        >
                          Rate
                        </label>
                        <input
                          className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          id={`item-rate-${itemIndex}`}
                          onChange={(e) =>
                            updateItem(
                              itemIndex,
                              "rate",
                              e.target.value === ""
                                ? 0
                                : Number.parseInt(e.target.value, 10) || 0
                            )
                          }
                          type="number"
                          value={item.rate || ""}
                        />
                      </div>
                      <div>
                        <label
                          className="mb-2 block font-medium text-sm"
                          htmlFor={`item-currency-${itemIndex}`}
                        >
                          Currency
                        </label>
                        <select
                          className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          id={`item-currency-${itemIndex}`}
                          onChange={(e) =>
                            updateItem(itemIndex, "currency", e.target.value)
                          }
                          value={item.currency || formData.currency || "RM"}
                        >
                          <option value="RM">MYR</option>
                          <option value="USD">USD</option>
                        </select>
                      </div>
                      <div>
                        <label
                          className="mb-2 block font-medium text-sm"
                          htmlFor={`item-amount-${itemIndex}`}
                        >
                          Amount
                        </label>
                        <div className="border border-gray-300 bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                          {item.currency || formData.currency || "RM"}{" "}
                          {(item.quantity * item.rate).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <label
                          className="block font-medium text-sm"
                          htmlFor={`item-detail-${itemIndex}-0`}
                        >
                          Details
                        </label>
                        <button
                          className="flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700"
                          onClick={() => addItemDetail(itemIndex)}
                          type="button"
                        >
                          <Plus className="h-3 w-3" />
                          Add Detail
                        </button>
                      </div>
                      <div className="space-y-2">
                        {item.details.map((detail, detailIndex) => (
                          <div
                            className="flex gap-2"
                            // biome-ignore lint/suspicious/noArrayIndexKey: Details are not reordered, stable index prevents focus loss
                            key={`detail-${itemIndex}-${detailIndex}`}
                          >
                            <input
                              className="flex-1 border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                              id={`item-detail-${itemIndex}-${detailIndex}`}
                              onChange={(e) =>
                                updateItemDetail(
                                  itemIndex,
                                  detailIndex,
                                  e.target.value
                                )
                              }
                              placeholder="Enter detail"
                              type="text"
                              value={detail}
                            />
                            <button
                              className="text-red-600 hover:text-red-700"
                              onClick={() =>
                                removeItemDetail(itemIndex, detailIndex)
                              }
                              type="button"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Payment Settings */}
            <section className="border-b pb-6">
              <h2 className="mb-4 font-semibold text-gray-700 text-xl">
                Payment Settings
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label
                    className="mb-2 block font-medium text-sm"
                    htmlFor="currency"
                  >
                    Currency
                  </label>
                  <select
                    className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                    id="currency"
                    onChange={(e) => updateField("currency", e.target.value)}
                    value={formData.currency}
                  >
                    <option value="RM">MYR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
                {formData.paymentType !== "Recurring payment" && (
                  <div>
                    <label
                      className="mb-2 block font-medium text-sm"
                      htmlFor="deposit-percent"
                    >
                      Deposit Percentage (%)
                    </label>
                    <input
                      className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      id="deposit-percent"
                      onChange={(e) =>
                        updateField(
                          "depositPercent",
                          e.target.value === ""
                            ? 0
                            : Number.parseInt(e.target.value, 10) || 0
                        )
                      }
                      type="number"
                      value={formData.depositPercent || ""}
                    />
                  </div>
                )}
                <div className="md:col-span-2">
                  <div className="mb-4 flex items-center gap-3">
                    <input
                      checked={formData.hasSecondPayment}
                      className="h-4 w-4 cursor-pointer"
                      id="has-second-payment"
                      onChange={(e) =>
                        updateField("hasSecondPayment", e.target.checked)
                      }
                      type="checkbox"
                    />
                    <label
                      className="cursor-pointer font-medium text-sm"
                      htmlFor="has-second-payment"
                    >
                      Enable Second Payment Option
                    </label>
                  </div>
                  {formData.hasSecondPayment && (
                    <div>
                      <label
                        className="mb-2 block font-medium text-sm"
                        htmlFor="second-payment-percent"
                      >
                        Second Payment Percentage (%)
                      </label>
                      <input
                        className="w-full border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        id="second-payment-percent"
                        onChange={(e) =>
                          updateField(
                            "secondPaymentPercent",
                            e.target.value === ""
                              ? 0
                              : Number.parseInt(e.target.value, 10) || 0
                          )
                        }
                        type="number"
                        value={formData.secondPaymentPercent || ""}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 bg-blue-50 p-4">
                {(() => {
                  const totalsByCurrency = calculateTotalByCurrency();
                  const depositsByCurrency = calculateDepositByCurrency();
                  const secondPaymentsByCurrency =
                    calculateSecondPaymentByCurrency();
                  const finalPaymentsByCurrency =
                    calculateFinalPaymentByCurrency();
                  const currencies = Object.keys(totalsByCurrency);

                  return (
                    <div className="space-y-4">
                      {currencies.map((currency) => {
                        let gridCols = "grid-cols-3";
                        if (formData.paymentType === "Recurring payment") {
                          gridCols = formData.hasSecondPayment
                            ? "grid-cols-2"
                            : "grid-cols-1";
                        } else if (formData.hasSecondPayment) {
                          gridCols = "grid-cols-4";
                        }
                        return (
                          <div className="space-y-2" key={currency}>
                            <div className="font-semibold text-gray-700 text-sm">
                              {currency} Totals
                            </div>
                            <div
                              className={`grid gap-4 text-center ${gridCols}`}
                            >
                              <div>
                                <div className="mb-1 text-gray-600 text-sm">
                                  Total
                                </div>
                                <div className="font-bold text-gray-800 text-xl">
                                  {currency}{" "}
                                  {totalsByCurrency[currency].toFixed(2)}
                                </div>
                              </div>
                              {formData.paymentType !== "Recurring payment" && (
                                <div>
                                  <div className="mb-1 text-gray-600 text-sm">
                                    Deposit ({formData.depositPercent}%)
                                  </div>
                                  <div className="font-bold text-green-600 text-xl">
                                    {currency}{" "}
                                    {depositsByCurrency[currency]?.toFixed(0) ||
                                      "0.00"}
                                  </div>
                                </div>
                              )}
                              {formData.hasSecondPayment && (
                                <div>
                                  <div className="mb-1 text-gray-600 text-sm">
                                    Second Payment (
                                    {formData.secondPaymentPercent}%)
                                  </div>
                                  <div className="font-bold text-xl text-yellow-600">
                                    {currency}{" "}
                                    {secondPaymentsByCurrency[
                                      currency
                                    ]?.toFixed(0) || "0.00"}
                                  </div>
                                </div>
                              )}
                              <div>
                                <div className="mb-1 text-gray-600 text-sm">
                                  Final Payment
                                  {(() => {
                                    if (
                                      formData.paymentType ===
                                      "Recurring payment"
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
                                    return ` (${
                                      100 - formData.depositPercent
                                    }%)`;
                                  })()}
                                </div>
                                <div className="font-bold text-blue-600 text-xl">
                                  {currency}{" "}
                                  {finalPaymentsByCurrency[currency]?.toFixed(
                                    0
                                  ) || "0.00"}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </section>

            {/* Terms and Conditions */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-700 text-xl">
                  Terms and Conditions
                </h2>
                <button
                  className="flex items-center gap-2 bg-green-600 px-4 py-2 text-white transition hover:bg-green-700"
                  onClick={addTerm}
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  Add Term
                </button>
              </div>

              <div className="space-y-3">
                {formData.terms.map((term, index) => (
                  <div
                    className="flex gap-2"
                    // biome-ignore lint/suspicious/noArrayIndexKey: Terms are not reordered, stable index prevents focus loss
                    key={`term-${index}`}
                  >
                    <div className="w-8 shrink-0 pt-2 text-center font-medium text-gray-600">
                      {index + 1}.
                    </div>
                    <textarea
                      className="flex-1 border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      id={`term-${index}`}
                      onChange={(e) => updateTerm(index, e.target.value)}
                      placeholder="Enter term"
                      rows={2}
                      value={term}
                    />
                    {formData.terms.length > 1 && (
                      <button
                        className="shrink-0 text-red-600 hover:text-red-700"
                        onClick={() => removeTerm(index)}
                        type="button"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
