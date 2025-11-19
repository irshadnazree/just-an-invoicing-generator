import { generateRandomString } from "@/utils/id-helpers";
import type { InvoiceFormData } from "@/types/invoice";
import {
  loadFromStorage,
  saveToStorage,
  findItemById,
  saveItemToArray,
} from "@/utils/storage-helpers";

const STORAGE_KEY = "invoices";

export function generateId(formData: InvoiceFormData): InvoiceFormData {
  return {
    ...formData,
    id: formData.id || generateRandomString(10),
    invoiceId: formData.invoiceId,
  };
}

export function loadInvoicesFromStorage(): InvoiceFormData[] {
  return loadFromStorage<InvoiceFormData>(STORAGE_KEY);
}

export function saveInvoicesToStorage(invoices: InvoiceFormData[]): void {
  saveToStorage(STORAGE_KEY, invoices);
}

export function findInvoiceById(id: string): InvoiceFormData | null {
  return findItemById<InvoiceFormData>(STORAGE_KEY, id);
}

// Validate that invoice has required fields filled
export function isInvoiceValid(invoiceData: InvoiceFormData): boolean {
  // Check required fields are not empty
  const hasInvoiceId = invoiceData.invoiceId.trim() !== "";
  // Add more validation if needed
  return hasInvoiceId;
}

export function saveInvoiceToArray(invoiceData: InvoiceFormData): void {
  saveItemToArray(STORAGE_KEY, invoiceData, isInvoiceValid);
}

