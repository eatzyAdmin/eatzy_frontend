/**
 * Formats a number as Vietnamese currency with "đ" symbol (simple format)
 * Example: 1000000 -> "1,000,000 đ"
 */
export const formatVnd = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "0 đ";
  return `${value.toLocaleString("vi-VN")} đ`;
};

/**
 * Formats a number as Vietnamese currency with full "₫" symbol using Intl.NumberFormat
 * Example: 1000000 -> "1.000.000 ₫"
 */
export const formatCurrency = (amount: number | null | undefined, currency: string = 'VND'): string => {
  if (amount === null || amount === undefined) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(amount);
};

export const sumVnd = (...values: number[]) => values.reduce((a, b) => a + b, 0);