import { memo } from "react";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useQuotationData } from "@/stores/quotation-store";

type ProjectDetailsSectionProps = {
  onUpdateField: (field: string, value: unknown) => void;
  onUpdateNestedField: (parent: string, field: string, value: unknown) => void;
};

function ProjectDetailsSectionComponent({
  onUpdateField,
  onUpdateNestedField,
}: ProjectDetailsSectionProps) {
  const formData = useQuotationData();
  const {
    projectTitle,
    quotationId,
    quotationDate,
    paymentType,
    bankAccount,
    quotationFrom,
    quotationFor,
  } = formData;

  return (
    <>
      <div className="flex flex-col gap-3">
        <h3 className="border-text border-b-2 pb-2 font-bold text-xl">
          Project Details
        </h3>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          <FormField className="col-span-1 xl:col-span-2">
            <FormLabel id="project-title" label="Project Title" />
            <Input
              id="project-title"
              onChange={(value) =>
                onUpdateField("projectTitle", value as string)
              }
              value={projectTitle}
            />
          </FormField>
          <FormField>
            <FormLabel id="quotation-id" label="Quotation id" />
            <Input
              id="quotation-id"
              onChange={(value) =>
                onUpdateField("quotationId", value as string)
              }
              type="text"
              value={quotationId}
            />
          </FormField>
          <FormField>
            <FormLabel id="quotation-date" label="Quotation Date" />
            <Input
              id="quotation-date"
              onChange={(value) =>
                onUpdateField("quotationDate", value as string)
              }
              type="date"
              value={quotationDate}
            />
          </FormField>
          <FormField>
            <FormLabel id="payment-type" label="Payment Type" />
            <Select
              id="payment-type"
              onChange={(value) =>
                onUpdateField("paymentType", value as string)
              }
              options={[
                { value: "One-time payment", label: "One-time payment" },
                { value: "Recurring payment", label: "Recurring payment" },
              ]}
              value={paymentType}
            />
          </FormField>
          <FormField>
            <FormLabel id="bank-account" label="Bank Account Number" />
            <Input
              id="bank-account"
              onChange={(value) =>
                onUpdateField("bankAccount", value as string)
              }
              type="text"
              value={bankAccount}
            />
          </FormField>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="border-text border-b-2 pb-2 font-bold text-xl">
          Client Information
        </h3>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          <FormField>
            <FormLabel id="quotation-from-company" label="Quotation From" />
            <Input
              id="quotation-from-company"
              onChange={(value) =>
                onUpdateNestedField("quotationFrom", "company", value as string)
              }
              type="text"
              value={quotationFrom.company}
            />
          </FormField>
          <FormField>
            <FormLabel id="quotation-for-company" label="Quotation For" />
            <Input
              id="quotation-for-company"
              onChange={(value) =>
                onUpdateNestedField("quotationFor", "company", value as string)
              }
              type="text"
              value={quotationFor.company}
            />
          </FormField>
        </div>
      </div>
    </>
  );
}

export default memo(ProjectDetailsSectionComponent);
