import { DownloadIcon, EyeIcon, UploadIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import FormWrapper from "@/components/page/quotation/form-wrapper";
import { Button } from "@/components/ui/button";
import { exportJSON, readJsonFile } from "@/lib/utils";
import { useQuotationStore } from "@/stores/quotation-store";

export const Route = createFileRoute("/quotation/$quotation")({
  loader: ({ params: { quotation } }) => ({ quotationId: quotation }),
  component: RouteComponent,
});

function RouteComponent() {
  const { quotationId } = Route.useLoaderData();
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    formData,
    importJSON,
    loadQuotation,
    initializeQuotation,
    saveQuotation,
  } = useQuotationStore();

  // Load quotation on component mount
  useEffect(() => {
    if (quotationId === "new") {
      // Create new quotation
      initializeQuotation();
    } else {
      // Try to load existing quotation
      const loaded = loadQuotation(quotationId);
      if (!loaded) {
        // Quotation not found, redirect to create new
        initializeQuotation();
        router.navigate({
          to: "/quotation/$quotation",
          params: { quotation: "new" },
        });
      }
    }
  }, [quotationId, loadQuotation, initializeQuotation, router]);

  // Auto-save when form data changes
  useEffect(() => {
    if (formData.id && formData.id !== "") {
      const timeoutId = setTimeout(() => {
        saveQuotation();
      }, 1000); // Debounce save by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [formData, saveQuotation]);

  const handleExportJSON = () => {
    const exportData = {
      ...formData,
      items: formData.items.map((item) => ({
        ...item,
        amount: item.quantity * item.rate,
      })),
    };
    exportJSON(exportData, `quotation-${formData.quotationId}.json`);
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
        <h2 className="text-2xl">
          {quotationId === "new" ? "Create Quotation" : "Edit Quotation"}
        </h2>
        <div className="flex items-center gap-1 xl:gap-2">
          {formData.id && formData.id !== "" && (
            <Link
              params={{ quotation: formData.quotationId }}
              to="/quotation/preview"
            >
              <Button
                icon={
                  <EyeIcon
                    className="size-4 xl:size-4.5"
                    size={18}
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
                className="size-4 xl:size-4.5"
                size={18}
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
                className="size-4 xl:size-4.5"
                size={18}
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
