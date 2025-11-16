"use client";

import { ReactNode } from "react";
import { buttonRecipe } from "../recipes";

type Variant = "primary" | "secondary" | "warning" | "danger" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

export function Button({ children, variant = "primary", size = "md", className, ...props }: { children: ReactNode; variant?: Variant; size?: Size; className?: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = buttonRecipe({ variant, size });
  return (
    <button className={`${classes} ${className ?? ""}`} {...props}>
      {children}
    </button>
  );
}