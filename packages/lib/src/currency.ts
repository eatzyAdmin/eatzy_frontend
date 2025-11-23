export const formatVnd = (value: number) => `${value.toLocaleString("vi-VN")} đ`;

export const sumVnd = (...values: number[]) => values.reduce((a, b) => a + b, 0);