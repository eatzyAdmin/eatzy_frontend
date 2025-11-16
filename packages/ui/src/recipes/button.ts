import { createRecipe } from "./createRecipe";

export const buttonRecipe = createRecipe({
  base: "inline-flex items-center justify-center rounded-lg font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  variants: {
    variant: {
      primary: "bg-[var(--primary)] focus:ring-[var(--primary)]",
      secondary: "bg-[var(--secondary)] focus:ring-[var(--secondary)]",
      warning: "bg-[var(--warning)] focus:ring-[var(--warning)]",
      danger: "bg-[var(--danger)] focus:ring-[var(--danger)]",
      outline: "bg-transparent text-current border",
      ghost: "bg-transparent text-current",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
  compoundVariants: [
    { when: { variant: "outline" }, classes: "border-current" },
  ],
});