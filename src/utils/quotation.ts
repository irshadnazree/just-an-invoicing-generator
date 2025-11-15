import { generateRandomString } from "@/lib/utils";
import type { QuotationFormData } from "@/types/quotation";

const STORAGE_KEY = "quotations";

export function generateId(formData: QuotationFormData): QuotationFormData {
  return {
    ...formData,
    id: formData.id || generateRandomString(10),
    quotationId: formData.quotationId,
  };
}

export function loadQuotationsFromStorage(): QuotationFormData[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveQuotationsToStorage(quotations: QuotationFormData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotations));
  } catch {
    // Handle storage quota exceeded or other errors
    console.warn("Failed to save quotations to localStorage");
  }
}

export function findQuotationById(id: string): QuotationFormData | null {
  const quotations = loadQuotationsFromStorage();
  return quotations.find((q) => q.id === id) || null;
}

// Validate that quotation has required fields filled
export function isQuotationValid(quotationData: QuotationFormData): boolean {
  // Check required fields are not empty
  const hasQuotationId = quotationData.quotationId.trim() !== "";
  const hasProjectTitle = quotationData.projectTitle.trim() !== "";

  return hasQuotationId && hasProjectTitle;
}

export function saveQuotationToArray(quotationData: QuotationFormData): void {
  // Only save if quotation has required data
  if (!isQuotationValid(quotationData)) {
    return;
  }

  const quotations = loadQuotationsFromStorage();
  const existingIndex = quotations.findIndex((q) => q.id === quotationData.id);

  const quotationWithTimestamps = {
    ...quotationData,
    createdAt: quotationData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    // Update existing quotation
    quotations[existingIndex] = quotationWithTimestamps;
  } else {
    // Add new quotation at the beginning (newest first)
    quotations.unshift(quotationWithTimestamps);
  }

  // Limit to prevent localStorage overflow (keep last 100 quotations)
  if (quotations.length > 100) {
    quotations.splice(100);
  }

  saveQuotationsToStorage(quotations);
}
