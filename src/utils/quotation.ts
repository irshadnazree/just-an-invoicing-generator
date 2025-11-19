import type { QuotationFormData } from "@/types/quotation";
import { generateRandomString } from "@/utils/id-helpers";
import {
  findItemById,
  loadFromStorage,
  saveItemToArray,
  saveToStorage,
} from "@/utils/storage-helpers";

const STORAGE_KEY = "quotations";

export function generateId(formData: QuotationFormData): QuotationFormData {
  return {
    ...formData,
    id: formData.id || generateRandomString(10),
    quotationId: formData.quotationId,
  };
}

export function loadQuotationsFromStorage(): QuotationFormData[] {
  return loadFromStorage<QuotationFormData>(STORAGE_KEY);
}

export function saveQuotationsToStorage(quotations: QuotationFormData[]): void {
  saveToStorage(STORAGE_KEY, quotations);
}

export function findQuotationById(id: string): QuotationFormData | null {
  return findItemById<QuotationFormData>(STORAGE_KEY, id);
}

// Validate that quotation has required fields filled
export function isQuotationValid(quotationData: QuotationFormData): boolean {
  // Check required fields are not empty
  const hasQuotationId = quotationData.quotationId.trim() !== "";
  const hasProjectTitle = quotationData.projectTitle.trim() !== "";

  return hasQuotationId && hasProjectTitle;
}

export function saveQuotationToArray(quotationData: QuotationFormData): void {
  saveItemToArray(STORAGE_KEY, quotationData, isQuotationValid);
}
