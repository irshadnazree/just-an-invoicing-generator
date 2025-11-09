import { createFileRoute } from "@tanstack/react-router";
import QuotationForm from "@/components/quotation-form";
import QuotationPreview from "@/components/quotation-preview";
import { useQuotationStore } from "@/stores/quotation-store";

export const Route = createFileRoute("/")({ component: App });

function App() {
  const { view } = useQuotationStore();

  return (
    <div>{view === "preview" ? <QuotationPreview /> : <QuotationForm />}</div>
  );
}
