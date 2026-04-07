import type { InvoiceFormData } from "@/types/invoice";
import { generateRandomString } from "@/utils/id-helpers";
import {
  findItemById,
  loadFromStorage,
  saveItemToArray,
  saveToStorage,
} from "@/utils/storage-helpers";

const STORAGE_KEY = "invoices";

export function generateId(formData: InvoiceFormData): InvoiceFormData {
  const today = new Date().toISOString().split("T")[0];
  return {
    ...formData,
    id: formData.id || generateRandomString(10),
    invoiceId: formData.invoiceId,
    invoiceDate: formData.invoiceDate || today,
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

export function deleteInvoicesFromStorage(ids: string[]): void {
  const idsToDelete = new Set(ids);
  const invoices = loadInvoicesFromStorage();
  const filteredInvoices = invoices.filter(
    (invoice) => !idsToDelete.has(invoice.id)
  );
  saveInvoicesToStorage(filteredInvoices);
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
