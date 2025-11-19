import {
  ArrowUUpLeftIcon,
  DownloadIcon,
  EyeIcon,
  UploadIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import FormWrapper from "@/components/page/invoice/form-wrapper";
import { Button } from "@/components/ui/button";
import { exportJSON, readJsonFile } from "@/lib/utils";
import { useInvoiceStore } from "@/stores/invoice-store";

export const Route = createFileRoute("/invoice/$invoice")({
  loader: ({ params: { invoice } }) => ({ invoiceId: invoice }),
  component: RouteComponent,
});

function RouteComponent() {
  const { invoiceId } = Route.useLoaderData();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    formData,
    importJSON,
    loadInvoice,
    initializeInvoice,
    saveInvoice,
  } = useInvoiceStore();

  // Load invoice on component mount
  useEffect(() => {
    if (invoiceId === "new") {
      // Create new invoice
      initializeInvoice();
    } else {
      // Try to load existing invoice
      const loaded = loadInvoice(invoiceId);
      if (!loaded) {
        // Invoice not found, redirect to create new
        initializeInvoice();
        router.navigate({
          to: "/invoice/$invoice",
          params: { invoice: "new" },
        });
      }
    }
  }, [invoiceId, loadInvoice, initializeInvoice, router]);

  // Auto-save when form data changes
  useEffect(() => {
    if (formData.id && formData.id !== "") {
      const timeoutId = setTimeout(() => {
        saveInvoice();
      }, 1000); // Debounce save by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [formData, saveInvoice]);

  const handleExportJSON = () => {
    const exportData = {
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),
    };
    exportJSON(exportData, `invoice-${formData.invoiceId}.json`);
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
      <div className="flex flex-col items-start justify-between gap-4 xl:flex-row xl:items-center xl:gap-0">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl">
            {invoiceId === "new" ? "Create Invoice" : "Edit Invoice"}
          </h2>
          <Link to="/invoice">
            <Button
              icon={
                <ArrowUUpLeftIcon
                  className="size-4 xl:size-5"
                  size={20}
                  weight="bold"
                />
              }
              size="sm"
            />
          </Link>
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          {formData.id && formData.id !== "" && (
            <Link to="/invoice/preview">
              <Button
                icon={
                  <EyeIcon
                    className="size-4 xl:size-5"
                    size={20}
                    weight="bold"
                  />
                }
                size="sm"
              />
            </Link>
          )}

          <Button
            icon={
              <UploadIcon
                className="size-4 xl:size-5"
                size={20}
                weight="bold"
              />
            }
            onClick={() => fileInputRef.current?.click()}
            size="sm"
          />
          <input
            onChange={(event) => handleImportJSON(event)}
            ref={fileInputRef}
            style={{ display: "none" }}
            type="file"
          />
          <Button
            icon={
              <DownloadIcon
                className="size-4 xl:size-5"
                size={20}
                weight="bold"
              />
            }
            onClick={handleExportJSON}
            size="sm"
          />
        </div>
      </div>
      <FormWrapper />
    </section>
  );
}
