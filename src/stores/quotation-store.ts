import { create } from "zustand";
import type {
  QuotationFormData,
  QuotationLineItem,
  QuotationStore,
} from "@/types/quotation";

const initialFormData: QuotationFormData = {
  id: "",
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

export const useQuotationStore = create<QuotationStore>((set, _get) => ({
  formData: initialFormData,

  updateField: (field, value) =>
    set((state) => {
      // If currency is being updated, reset all item currencies to match
      if (field === "currency" && typeof value === "string") {
        return {
          formData: {
            ...state.formData,
            [field]: value,
            items: state.formData.items.map((item) => ({
              ...item,
              currency: value,
            })),
          },
        };
      }
      return {
        formData: { ...state.formData, [field]: value },
      };
    }),

  updateNestedField: (parent, field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        [parent]: { ...state.formData[parent], [field]: value },
      },
    })),

  addItem: () =>
    set((state) => ({
      formData: {
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
      },
    })),

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
      return {
        formData: {
          ...state.formData,
          items: newItems,
        },
      };
    }),

  removeItem: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        items: state.formData.items.filter((_, i) => i !== index),
      },
    })),

  updateItem: (index, field, value) =>
    set((state) => {
      const newItems = [...state.formData.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return {
        formData: { ...state.formData, items: newItems },
      };
    }),

  addItemDetail: (itemIndex) =>
    set((state) => {
      const newItems = [...state.formData.items];
      newItems[itemIndex].details.push("");
      return {
        formData: { ...state.formData, items: newItems },
      };
    }),

  removeItemDetail: (itemIndex, detailIndex) =>
    set((state) => {
      const newItems = [...state.formData.items];
      newItems[itemIndex].details = newItems[itemIndex].details.filter(
        (_, i) => i !== detailIndex
      );
      return {
        formData: { ...state.formData, items: newItems },
      };
    }),

  updateItemDetail: (itemIndex, detailIndex, value) =>
    set((state) => {
      const newItems = [...state.formData.items];
      newItems[itemIndex].details[detailIndex] = value;
      return {
        formData: { ...state.formData, items: newItems },
      };
    }),

  addTerm: () =>
    set((state) => ({
      formData: {
        ...state.formData,
        terms: [...state.formData.terms, ""],
      },
    })),

  duplicateTerm: (index) =>
    set((state) => {
      const termToDuplicate = state.formData.terms[index];
      const newTerms = [...state.formData.terms];
      newTerms.splice(index + 1, 0, termToDuplicate);
      return {
        formData: {
          ...state.formData,
          terms: newTerms,
        },
      };
    }),

  removeTerm: (index) =>
    set((state) => ({
      formData: {
        ...state.formData,
        terms: state.formData.terms.filter((_, i) => i !== index),
      },
    })),
  updateTerm: (index, value) =>
    set((state) => {
      const newTerms = [...state.formData.terms];
      newTerms[index] = value;
      return {
        formData: { ...state.formData, terms: newTerms },
      };
    }),
  importJSON: (jsonData) => {
    set((state) => {
      // Clean items by removing the 'amount' field if present (it's calculated)
      // Also ensure currency is set for each item (default to global currency if missing)
      const cleanedItems =
        jsonData.items?.map(
          (itemWithAmount: QuotationLineItem & { amount?: number }) => {
            const { amount: _amount, ...item } = itemWithAmount;
            return {
              ...item,
              currency:
                item.currency ??
                jsonData.currency ??
                state.formData.currency ??
                "RM",
            };
          }
        ) ?? state.formData.items;

      return {
        formData: {
          ...state.formData,
          ...jsonData,
          items: cleanedItems,
          quotationFrom: jsonData.quotationFrom ?? state.formData.quotationFrom,
          quotationFor: jsonData.quotationFor ?? state.formData.quotationFor,
        },
      };
    });
  },
  resetForm: () => set({ formData: initialFormData }),
}));
