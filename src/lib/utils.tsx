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

export function readJsonFile(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target?.result as string);
        resolve(jsonData);
      } catch {
        reject(
          new Error("Failed to parse JSON file. Please check the file format.")
        );
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}

export function generatePrintFilename(
  quotationFromCompany: string,
  quotationForCompany: string,
  quotationId: string
) {
  const fromCompany = sanitizeFilename(
    quotationFromCompany.split(" ")[0] || ""
  );
  const toCompany = sanitizeFilename(quotationForCompany.split(" ")[0] || "");
  const quotationNo = sanitizeFilename(quotationId);
  return `${quotationNo}-${fromCompany}-${toCompany}`;
}
