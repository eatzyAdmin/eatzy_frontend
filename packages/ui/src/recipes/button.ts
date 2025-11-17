import { createRecipe } from "./createRecipe";

export const buttonRecipe = createRecipe({
  base: "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-sm hover:shadow-md active:scale-[0.98]",
  variants: {
    variant: {
      primary: "text-white bg-[var(--primary)] hover:brightness-105 focus:ring-[var(--primary)]",
      secondary: "text-white bg-[var(--secondary)] hover:brightness-105 focus:ring-[var(--secondary)]",
      warning: "text-white bg-[var(--warning)] hover:brightness-105 focus:ring-[var(--warning)]",
      danger: "text-white bg-[var(--danger)] hover:brightness-105 focus:ring-[var(--danger)]",
      outline: "bg-transparent border border-current",
      ghost: "bg-transparent",
      glass: "text-gray-800 bg-white/30 backdrop-blur-lg border border-white/40 hover:bg-white/40",
    },
    size: {
      sm: "h-9 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
  compoundVariants: [
    { when: { variant: "outline" }, classes: "text-current" },
    { when: { size: "icon" }, classes: "p-0" },
  ],
});