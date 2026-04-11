import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitizeFilename(str: string) {
  return str
    .replace(/[^a-z0-9]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();
}

export function formatCurrency(
  amount: number,
  currencySymbol: string,
  decimals = 2
) {
  return `${currencySymbol} ${amount.toFixed(decimals)}`;
}

export function formatDecimal(amount: number, decimals = 2) {
  return amount.toFixed(decimals);
}

type PricedItem = {
  quantity: number;
  rate: number;
};

function calculateItemsTotal(items: PricedItem[]) {
  return items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
}

export function calculateInvoiceTotal(invoice: {
  items: PricedItem[];
  reductionAmount?: number;
}) {
  return calculateItemsTotal(invoice.items) - (invoice.reductionAmount || 0);
}

export function calculateQuotationTotal(quotation: { items: PricedItem[] }) {
  return calculateItemsTotal(quotation.items);
}

export function downloadFile(
  content: string | Blob,
  filename: string,
  type = "application/json"
) {
  const blob =
    content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function exportJSON(data: unknown, filename: string) {
  const dataStr = JSON.stringify(data, null, 2);
  downloadFile(dataStr, filename, "application/json");
}

export async function readJsonFile(file: File): Promise<unknown> {
  try {
    const jsonData = JSON.parse(await file.text()) as unknown;
    return jsonData;
  } catch {
    throw new Error("Failed to parse JSON file. Please check the file format.");
  }
}

export function generatePrintFilename(
  fromCompany: string,
  toCompany: string,
  documentId: string
) {
  const sanitizedFromCompany = sanitizeFilename(
    fromCompany.split(" ")[0] || ""
  );
  const sanitizedToCompany = sanitizeFilename(toCompany.split(" ")[0] || "");
  const sanitizedDocumentId = sanitizeFilename(documentId);

  return `${sanitizedDocumentId}-${sanitizedFromCompany}-${sanitizedToCompany}`;
}
