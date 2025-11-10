import { create } from "zustand";

type QuotationItem = {
  name: string;
  details: string[];
  quantity: number;
  rate: number;
  currency: string;
};

type CompanyInfo = {
  company: string;
  country: string;
};

type QuotationFormData = {
  quotationNumber: string;
  quotationDate: string;
  bankAccount: string;
  quotationFrom: CompanyInfo;
  quotationFor: CompanyInfo;
  projectTitle: string;
  paymentType: string;
  items: QuotationItem[];
  currency: string;
  depositPercent: number;
  hasSecondPayment: boolean;
  secondPaymentPercent: number;
  terms: string[];
};

type QuotationStore = {
  formData: QuotationFormData;
  updateField: <K extends keyof QuotationFormData>(
    field: K,
    value: QuotationFormData[K]
  ) => void;
  updateNestedField: (
    parent: "quotationFrom" | "quotationFor",
    field: keyof CompanyInfo,
    value: string
  ) => void;
  addItem: () => void;
  duplicateItem: (index: number) => void;
  removeItem: (index: number) => void;
  updateItem: (
    index: number,
    field: keyof QuotationItem,
    value: unknown
  ) => void;
  addItemDetail: (itemIndex: number) => void;
  removeItemDetail: (itemIndex: number, detailIndex: number) => void;
  updateItemDetail: (
    itemIndex: number,
    detailIndex: number,
    value: string
  ) => void;
  addTerm: () => void;
  duplicateTerm: (index: number) => void;
  removeTerm: (index: number) => void;
  updateTerm: (index: number, value: string) => void;
  calculateTotal: () => number;
  calculateTotalByCurrency: () => Record<string, number>;
  calculateDeposit: () => number;
  calculateDepositByCurrency: () => Record<string, number>;
  calculateSecondPayment: () => number;
  calculateSecondPaymentByCurrency: () => Record<string, number>;
  calculateFinalPayment: () => number;
  calculateFinalPaymentByCurrency: () => Record<string, number>;
  importJSON: (
    jsonData: Partial<QuotationFormData> & {
      items?: Array<QuotationItem & { amount?: number }>;
    }
  ) => void;
};

const initialFormData: QuotationFormData = {
  quotationNumber: "",
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
      const duplicatedItem: QuotationItem = {
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

  calculateTotal: () => {
    const state = get();
    return state.formData.items.reduce(
      (sum, item) => sum + item.quantity * item.rate,
      0
    );
  },

  calculateTotalByCurrency: () => {
    const state = get();
    const totals: Record<string, number> = {};
    for (const item of state.formData.items) {
      const currency = item.currency || state.formData.currency || "RM";
      const amount = item.quantity * item.rate;
      totals[currency] = (totals[currency] || 0) + amount;
    }
    return totals;
  },

  calculateDeposit: () => {
    const state = get();
    if (state.formData.paymentType === "Recurring payment") {
      return 0;
    }
    const total = state.calculateTotal();
    return (total * state.formData.depositPercent) / 100;
  },

  calculateDepositByCurrency: () => {
    const state = get();
    if (state.formData.paymentType === "Recurring payment") {
      return {};
    }
    const totalsByCurrency = state.calculateTotalByCurrency();
    const deposits: Record<string, number> = {};
    for (const currency of Object.keys(totalsByCurrency)) {
      deposits[currency] =
        (totalsByCurrency[currency] * state.formData.depositPercent) / 100;
    }
    return deposits;
  },

  calculateSecondPayment: () => {
    const state = get();
    if (!state.formData.hasSecondPayment) {
      return 0;
    }
    const total = state.calculateTotal();
    return (total * state.formData.secondPaymentPercent) / 100;
  },

  calculateSecondPaymentByCurrency: () => {
    const state = get();
    if (!state.formData.hasSecondPayment) {
      return {};
    }
    const totalsByCurrency = state.calculateTotalByCurrency();
    const secondPayments: Record<string, number> = {};
    for (const currency of Object.keys(totalsByCurrency)) {
      secondPayments[currency] =
        (totalsByCurrency[currency] * state.formData.secondPaymentPercent) /
        100;
    }
    return secondPayments;
  },

  calculateFinalPayment: () => {
    const state = get();
    const total = state.calculateTotal();
    const deposit = state.calculateDeposit();
    const secondPayment = state.calculateSecondPayment();
    return total - deposit - secondPayment;
  },

  calculateFinalPaymentByCurrency: () => {
    const state = get();
    const totalsByCurrency = state.calculateTotalByCurrency();
    const depositsByCurrency = state.calculateDepositByCurrency();
    const secondPaymentsByCurrency = state.calculateSecondPaymentByCurrency();
    const finalPayments: Record<string, number> = {};
    for (const currency of Object.keys(totalsByCurrency)) {
      const total = totalsByCurrency[currency];
      const deposit = depositsByCurrency[currency] || 0;
      const secondPayment = secondPaymentsByCurrency[currency] || 0;
      finalPayments[currency] = total - deposit - secondPayment;
    }
    return finalPayments;
  },

  importJSON: (jsonData) => {
    set((state) => {
      // Clean items by removing the 'amount' field if present (it's calculated)
      // Also ensure currency is set for each item (default to global currency if missing)
      const cleanedItems =
        jsonData.items?.map(
          (itemWithAmount: QuotationItem & { amount?: number }) => {
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
          // Ensure nested objects are properly merged
          quotationFrom: jsonData.quotationFrom ?? state.formData.quotationFrom,
          quotationFor: jsonData.quotationFor ?? state.formData.quotationFor,
        },
      };
    });
  },
}));
