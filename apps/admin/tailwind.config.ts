import type { Config } from "tailwindcss";
import { colorRgb, colors } from "../../packages/ui/src/tokens/colors";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
      colors: {
        primary: `rgb(${colorRgb.primary} / <alpha-value>)`,
        secondary: `rgb(${colorRgb.secondary} / <alpha-value>)`,
        warning: `rgb(${colorRgb.warning} / <alpha-value>)`,
        danger: `rgb(${colorRgb.danger} / <alpha-value>)`,
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    ({ addBase }: any) => {
      addBase({
        ':root': {
          '--primary': colors.primary,
          '--secondary': colors.secondary,
          '--warning': colors.warning,
          '--danger': colors.danger,
          '--primary-rgb': colorRgb.primary,
        },
      });
    },
  ],
};
export default config;
