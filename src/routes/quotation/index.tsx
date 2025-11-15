import { createFileRoute, redirect } from "@tanstack/react-router";
import { initialFormData } from "@/stores/quotation-store";
import { generateId } from "@/utils/quotation";

export const Route = createFileRoute("/quotation/")({
  beforeLoad: () => {
    const newQuotation = generateId(initialFormData);

    throw redirect({
      to: "/quotation/$quotation",
      params: { quotation: newQuotation.id },
    });
  },
});
