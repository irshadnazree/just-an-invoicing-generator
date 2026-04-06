import { useMemo } from "react";

import {
  useQuotationItems,
  useQuotationPaymentConfig,
} from "@/stores/quotation-store";
import {
  getDepositByCurrency,
  getFinalPaymentByCurrency,
  getSecondPaymentByCurrency,
  getTotalByCurrency,
} from "@/utils/calculations";

export function useQuotationCalculations() {
  const items = useQuotationItems();
  const {
    paymentType,
    depositPercent,
    hasSecondPayment,
    secondPaymentPercent,
  } = useQuotationPaymentConfig();

  const calculations = useMemo(() => {
    const totalsByCurrency = getTotalByCurrency(items);
    const depositsByCurrency = getDepositByCurrency(
      paymentType,
      depositPercent,
      totalsByCurrency
    );
    const secondPaymentsByCurrency = getSecondPaymentByCurrency(
      hasSecondPayment,
      secondPaymentPercent,
      totalsByCurrency
    );
    const finalPaymentsByCurrency = getFinalPaymentByCurrency(
      totalsByCurrency,
      depositsByCurrency,
      secondPaymentsByCurrency
    );

    return {
      totalsByCurrency,
      depositsByCurrency,
      secondPaymentsByCurrency,
      finalPaymentsByCurrency,
      currencies: Object.keys(totalsByCurrency),
    };
  }, [
    items,
    paymentType,
    depositPercent,
    hasSecondPayment,
    secondPaymentPercent,
  ]);

  return calculations;
}
