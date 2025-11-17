import { create } from "zustand";
import { generateRandomString, incrementCodeFlexible } from "@/lib/utils";
import type {
  QuotationFormData,
  QuotationLineItem,
  QuotationStore,
} from "@/types/quotation";
import {
  findQuotationById,
  generateId,
  isQuotationValid,
  loadQuotationsFromStorage,
  saveQuotationsToStorage,
  saveQuotationToArray,
} from "@/utils/quotation";

export const initialFormData: QuotationFormData = {
  id: "",
  createdAt: "",
  updatedAt: "",
  quotationId: "",
  quotationDate: "",
  bankAccount: "",
  quotationFrom: {
    company: "",
    country: "",
  },
  quotationFor: {
    company: "",
    country: "",
  },
  projectTitle: "",
  paymentType: "",
  items: [],
  currency: "",
  depositPercent: 0,
  hasSecondPayment: false,
  secondPaymentPercent: 0,
  terms: [],
};

export const useQuotationStore = create<QuotationStore>((set, get) => ({
  formData: initialFormData,

  updateField: (field, value) =>
    set((state) => {
      let updatedFormData = { ...state.formData, [field]: value };

      // If currency is being updated, reset all item currencies to match
      if (field === "currency" && typeof value === "string") {
        updatedFormData = {
          ...updatedFormData,
          items: state.formData.items.map((item) => ({
            ...item,
            currency: value,
          })),
        };
      }

      return {
        formData: updatedFormData,
      };
    }),

  updateNestedField: (parent, field, value) =>
    set((state) => {
      const updatedFormData = {
        ...state.formData,
        [parent]: { ...state.formData[parent], [field]: value },
      };

      return {
        formData: updatedFormData,
      };
    }),

  addItem: () =>
    set((state) => {
      const updatedFormData = {
        ...state.formData,
        items: [
          ...state.formData.items,
          {
            name: "",
            details: [],
            quantity: 1,
            rate: 550,
            currency: state.formData.currency || "RM",
          },
        ],
      };

      return {
        formData: updatedFormData,
      };
    }),

  duplicateItem: (index) =>
    set((state) => {
      const itemToDuplicate = state.formData.items[index];
      const duplicatedItem: QuotationLineItem = {
        name: itemToDuplicate.name,
        details: [...itemToDuplicate.details],
        quantity: itemToDuplicate.quantity,
        rate: itemToDuplicate.rate,
        currency: itemToDuplicate.currency,
      };
      const newItems = [...state.formData.items];
      newItems.splice(index + 1, 0, duplicatedItem);
      const updatedFormData = {
        ...state.formData,
        items: newItems,
      };

      return {
        formData: updatedFormData,
      };
    }),

  removeItem: (index) =>
    set((state) => {
      const updatedFormData = {
        ...state.formData,
        items: state.formData.items.filter((_, i) => i !== index),
      };

      return {
        formData: updatedFormData,
      };
    }),

  updateItem: (index, field, value) =>
    set((state) => {
      const newItems = [...state.formData.items];
      newItems[index] = { ...newItems[index], [field]: value };
      const updatedFormData = { ...state.formData, items: newItems };

      return {
        formData: updatedFormData,
      };
    }),

  addItemDetail: (itemIndex) =>
    set((state) => {
      const newItems = [...state.formData.items];
      newItems[itemIndex].details.push("");
      const updatedFormData = { ...state.formData, items: newItems };

      return {
        formData: updatedFormData,
      };
    }),

  removeItemDetail: (itemIndex, detailIndex) =>
    set((state) => {
      const newItems = [...state.formData.items];
      newItems[itemIndex].details = newItems[itemIndex].details.filter(
        (_, i) => i !== detailIndex
      );
      const updatedFormData = { ...state.formData, items: newItems };

      return {
        formData: updatedFormData,
      };
    }),

  updateItemDetail: (itemIndex, detailIndex, value) =>
    set((state) => {
      const newItems = [...state.formData.items];
      newItems[itemIndex].details[detailIndex] = value;
      const updatedFormData = { ...state.formData, items: newItems };

      return {
        formData: updatedFormData,
      };
    }),

  addTerm: () =>
    set((state) => {
      const updatedFormData = {
        ...state.formData,
        terms: [...state.formData.terms, ""],
      };

      return {
        formData: updatedFormData,
      };
    }),

  duplicateTerm: (index) =>
    set((state) => {
      const termToDuplicate = state.formData.terms[index];
      const newTerms = [...state.formData.terms];
      newTerms.splice(index + 1, 0, termToDuplicate);
      const updatedFormData = {
        ...state.formData,
        terms: newTerms,
      };

      return {
        formData: updatedFormData,
      };
    }),

  removeTerm: (index) =>
    set((state) => {
      const updatedFormData = {
        ...state.formData,
        terms: state.formData.terms.filter((_, i) => i !== index),
      };

      return {
        formData: updatedFormData,
      };
    }),
  updateTerm: (index, value) =>
    set((state) => {
      const newTerms = [...state.formData.terms];
      newTerms[index] = value;
      const updatedFormData = { ...state.formData, terms: newTerms };

      return {
        formData: updatedFormData,
      };
    }),
  importJSON: (jsonData) => {
    set((state) => {
      const updatedFormData = {
        ...state.formData,
        ...jsonData,
        id: generateRandomString(10),
        items: jsonData.items ?? state.formData.items,
        quotationFrom: jsonData.quotationFrom ?? state.formData.quotationFrom,
        quotationFor: jsonData.quotationFor ?? state.formData.quotationFor,
      };

      return {
        formData: updatedFormData,
      };
    });
  },

  initializeQuotation: () => {
    const newQuotation = generateId(initialFormData);
    set({ formData: newQuotation });
  },

  getAllQuotations: () => loadQuotationsFromStorage(),

  getAllQuotationsAsync: async () => {
    try {
      // Simulate a small delay to ensure consistent loading state
      await new Promise((resolve) => setTimeout(resolve, 50));
      return loadQuotationsFromStorage();
    } catch (error) {
      console.warn("Failed to load quotations from storage:", error);
      return [];
    }
  },

  isValidQuotation: () => {
    const formData = get().formData;
    return isQuotationValid(formData);
  },

  saveQuotation: () => {
    const formData = get().formData;
    if (formData.id) {
      saveQuotationToArray(formData);
    }
  },

  loadQuotation: (id: string) => {
    const quotation = findQuotationById(id);
    if (quotation) {
      set({ formData: quotation });
      return true;
    }
    return false;
  },

  deleteQuotation: (id: string) => {
    const quotations = loadQuotationsFromStorage();
    const filteredQuotations = quotations.filter((q) => q.id !== id);
    saveQuotationsToStorage(filteredQuotations);
  },

  duplicateQuotation: (id: string) => {
    const quotation = findQuotationById(id);

    if (quotation) {
      const duplicatedQuotation = {
        ...quotation,
        id: generateRandomString(10),
        quotationId: incrementCodeFlexible(quotation.quotationId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        // Save the duplicated quotation to localStorage array
        saveQuotationToArray(duplicatedQuotation);
        set({ formData: duplicatedQuotation });
        return duplicatedQuotation.id; // Return the new ID for navigation
      } catch (error) {
        console.error("Failed to duplicate quotation:", error);
        throw new Error("Failed to duplicate quotation");
      }
    }
    return null;
  },

  resetForm: () => set({ formData: initialFormData }),
}));
