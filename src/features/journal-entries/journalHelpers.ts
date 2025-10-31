import type { LineItem } from "../../types";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export const calculateTotals = (lineItems: LineItem[]) => {
  const totalDebits = lineItems.reduce((sum, item) => sum + item.debit, 0);
  const totalCredits = lineItems.reduce((sum, item) => sum + item.credit, 0);
  return {
    totalDebits,
    totalCredits,
    isBalanced: totalDebits === totalCredits,
  };
};

