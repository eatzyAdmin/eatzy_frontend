// Helper to convert hex to RGB components for Tailwind alpha support
const hexToRgb = (hex: string) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r} ${g} ${b}`;
};

export const colors = {
  primary: "#78C841",
  secondary: "#B4E50D",
  warning: "#FF9B2F",
  danger: "#FB4141",
};

export const colorRgb = {
  primary: hexToRgb(colors.primary),
  secondary: hexToRgb(colors.secondary),
  warning: hexToRgb(colors.warning),
  danger: hexToRgb(colors.danger),
};