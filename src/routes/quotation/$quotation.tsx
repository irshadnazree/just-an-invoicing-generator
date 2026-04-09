import {
  ArrowUUpLeftIcon,
  DownloadIcon,
  EyeIcon,
  UploadIcon,
} from "@phosphor-icons/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";

import { useNavigationWarning } from "@/components/hooks/use-navigation-warning";
import FormWrapper from "@/components/page/quotation/form-wrapper";
import { Button } from "@/components/ui/Button";
import { ConfirmationDialog } from "@/components/ui/Dialog";
import { SaveIndicator } from "@/components/ui/SaveIndicator";
import { useToastManager } from "@/lib/provider/toast-provider";
import { exportJSON, readJsonFile } from "@/lib/utils";
import { useQuotationStore } from "@/stores/quotation-store";
import { isQuotationValid } from "@/utils/quotation";

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

  // Check if form has unsaved changes (has some data but not valid/saved)
  const hasUnsavedChanges = Boolean(
    formData.id &&
    formData.id !== "" &&
    !isQuotationValid(formData) &&
    (formData.quotationId.trim() !== "" ||
      formData.projectTitle.trim() !== "" ||
      formData.items.length > 0)
  );

  // Setup navigation warning
  const {
    isDialogOpen,
    confirmNavigation,
    cancelNavigation,
    title,
    description,
    confirmLabel,
    cancelLabel,
  } = useNavigationWarning({
    enabled: hasUnsavedChanges,
    title: "Unsaved Changes",
    description:
      "You have started filling out this quotation but haven't saved it yet. If you leave now, your progress will be lost.",
    confirmLabel: "Leave",
    cancelLabel: "Stay",
  });

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

        // Only show toast on error, success is shown via SaveIndicator
        if (!success) {
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
          <h1 className="text-3xl font-bold">
            {quotationId === "new" ? "Create Quotation" : "Edit Quotation"}
          </h1>
          <Link to="/quotation">
            <Button
              aria-label="Go back"
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
          <SaveIndicator show={isSaving} />
        </div>
        <div className="flex items-center gap-1 xl:gap-2">
          {formData.id && formData.id !== "" && (
            <Link to="/quotation/preview">
              <Button
                aria-label="Preview"
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
            aria-label="Import JSON"
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
            aria-label="Export JSON"
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

      <ConfirmationDialog
        cancelLabel={cancelLabel}
        confirmLabel={confirmLabel}
        description={description}
        onCancel={cancelNavigation}
        onConfirm={confirmNavigation}
        open={isDialogOpen}
        title={title}
        variant="warning"
        onOpenChange={(open) => {
          if (!open) {
            cancelNavigation();
          }
        }}
      />
    </section>
  );
}
