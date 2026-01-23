export const formatVnd = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "0 đ";
  return `${value.toLocaleString("vi-VN")} đ`;
};

export const sumVnd = (...values: number[]) => values.reduce((a, b) => a + b, 0);