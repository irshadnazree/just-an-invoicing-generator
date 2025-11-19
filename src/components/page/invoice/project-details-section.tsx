import { memo } from "react";
import { FormField, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useInvoiceData } from "@/stores/invoice-store";

type ProjectDetailsSectionProps = {
  onUpdateField: (field: string, value: unknown) => void;
  onUpdateNestedField: (parent: string, field: string, value: unknown) => void;
};

function ProjectDetailsSectionComponent({
  onUpdateField,
  onUpdateNestedField,
}: ProjectDetailsSectionProps) {
  const formData = useInvoiceData();
  const { invoiceId, invoiceDate, bankAccount, invoiceFrom, invoiceTo } =
    formData;

  return (
    <>
      <div className="flex flex-col gap-3">
        <h3 className="border-text border-b-2 pb-2 font-bold text-xl">
          Invoice Details
        </h3>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          <FormField>
            <FormLabel id="invoice-id" label="Invoice No #" />
            <Input
              id="invoice-id"
              onChange={(value) => onUpdateField("invoiceId", value as string)}
              type="text"
              value={invoiceId}
            />
          </FormField>
          <FormField>
            <FormLabel id="invoice-date" label="Invoice Date" />
            <Input
              id="invoice-date"
              onChange={(value) =>
                onUpdateField("invoiceDate", value as string)
              }
              type="date"
              value={invoiceDate}
            />
          </FormField>
          <FormField className="col-span-1 xl:col-span-2">
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
          Billed Information
        </h3>
        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          <div className="flex flex-col gap-2">
            <FormField>
              <FormLabel id="invoice-from-company" label="Billed By" />
              <Input
                id="invoice-from-company"
                onChange={(value) =>
                  onUpdateNestedField("invoiceFrom", "company", value as string)
                }
                type="text"
                value={invoiceFrom.company}
              />
            </FormField>
          </div>
          <div className="flex flex-col gap-2">
            <FormField>
              <FormLabel id="invoice-to-company" label="Billed To" />
              <Input
                id="invoice-to-company"
                onChange={(value) =>
                  onUpdateNestedField("invoiceTo", "company", value as string)
                }
                type="text"
                value={invoiceTo.company}
              />
            </FormField>
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(ProjectDetailsSectionComponent);
