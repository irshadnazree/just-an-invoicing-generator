import LineItemSection from "@/components/page/quotation/line-item-section";
import PaymentSection from "@/components/page/quotation/payment-section";
import ProjectDetailsSection from "@/components/page/quotation/project-details-section";
import TermsSection from "@/components/page/quotation/terms-section";
import { useUpdateField, useUpdateNestedField } from "@/stores/quotation-store";
import type { QuotationFormData } from "@/types/quotation";

export default function FormWrapper() {
  const updateField = useUpdateField();
  const updateNestedField = useUpdateNestedField();

  function handleUpdateField(field: string, value: unknown) {
    updateField(field as keyof QuotationFormData, value as never);
  }

  function handleUpdateNestedField(
    parent: string,
    field: string,
    value: unknown
  ) {
    updateNestedField(
      parent as "quotationFrom" | "quotationFor",
      field as keyof QuotationFormData["quotationFrom"],
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
      <PaymentSection onUpdateField={handleUpdateField} />
      <TermsSection />
    </div>
  );
}
