import LineItemSection from "@/components/page/invoice/line-item-section";
import ProjectDetailsSection from "@/components/page/invoice/project-details-section";
import SummarySection from "@/components/page/invoice/summary-section";
import {
  useInvoiceUpdateField,
  useInvoiceUpdateNestedField,
} from "@/stores/invoice-store";
import type { InvoiceFormData } from "@/types/invoice";

export default function FormWrapper() {
  const updateField = useInvoiceUpdateField();
  const updateNestedField = useInvoiceUpdateNestedField();

  function handleUpdateField(field: string, value: unknown) {
    updateField(field as keyof InvoiceFormData, value as never);
  }

  function handleUpdateNestedField(
    parent: string,
    field: string,
    value: unknown
  ) {
    updateNestedField(
      parent as "invoiceFrom" | "invoiceTo",
      field as keyof InvoiceFormData["invoiceFrom"],
      value as string
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ProjectDetailsSection
        onUpdateField={handleUpdateField}
        onUpdateNestedField={handleUpdateNestedField}
      />
      <LineItemSection />
      <SummarySection onUpdateField={handleUpdateField} />
    </div>
  );
}
