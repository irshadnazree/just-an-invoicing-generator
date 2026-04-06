import LineItemSection from "@/components/page/quotation/line-item-section";
import PaymentSection from "@/components/page/quotation/payment-section";
import ProjectDetailsSection from "@/components/page/quotation/project-details-section";
import TermsSection from "@/components/page/quotation/terms-section";
import { useUpdateField, useUpdateNestedField } from "@/stores/quotation-store";

export default function FormWrapper() {
  const updateField = useUpdateField();
  const updateNestedField = useUpdateNestedField();

  return (
    <div className="flex flex-col gap-6">
      <ProjectDetailsSection
        onUpdateField={updateField}
        onUpdateNestedField={updateNestedField}
      />
      <LineItemSection />
      <PaymentSection onUpdateField={updateField} />
      <TermsSection />
    </div>
  );
}
