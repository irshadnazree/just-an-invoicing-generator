import {
  ArrowUUpLeftIcon,
  DownloadIcon,
  EyeIcon,
  UploadIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import FormWrapper from "@/components/page/quotation/form-wrapper";
import { Button } from "@/components/ui/Button";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { useToastManager } from "@/lib/provider/toast-provider";
import { exportJSON, readJsonFile } from "@/lib/utils";
import { useQuotationStore } from "@/stores/quotation-store";

export const Route = createFileRoute("/quotation/$quotation")({
  loader: ({ params: { quotation } }) => ({ quotationId: quotation }),
  component: RouteComponent,
});

function RouteComponent() {
  const { quotationId } = Route.useLoaderData();
  const router = useRouter();
  const { add } = useToastManager();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    formData,
    importJSON,
    loadQuotation,
    initializeQuotation,
    saveQuotation,
  } = useQuotationStore(
    useShallow((state) => ({
      formData: state.formData,
      importJSON: state.importJSON,
      loadQuotation: state.loadQuotation,
      initializeQuotation: state.initializeQuotation,
      saveQuotation: state.saveQuotation,
    }))
  );

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

  // Auto-save when form data changes with debounce
  useEffect(() => {
    if (formData.id && formData.id !== "") {
      setIsSaving(true);

      const timeoutId = setTimeout(() => {
        const success = saveQuotation();
        setIsSaving(false);

        if (success) {
          add({
            title: "Quotation saved",
            type: "success",
          });
        } else {
          add({
            title: "Failed to save quotation",
            type: "error",
          });
        }
      }, 1000); // Debounce save by 1 second

      return () => clearTimeout(timeoutId);
    }
  }, [formData, saveQuotation, add]);

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
        <div className="flex items-center gap-3">
          <h2 className="text-2xl">
            {quotationId === "new" ? "Create Quotation" : "Edit Quotation"}
          </h2>
          <SaveIndicator show={isSaving} />
          <Link to="/quotation">
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
            <Link to="/quotation/preview">
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
