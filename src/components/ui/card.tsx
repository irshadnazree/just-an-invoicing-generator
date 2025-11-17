import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type CardProps = {
  children: ReactNode;
  className?: string;
  variant?: "default" | "placeholder";
  size?: "sm" | "md" | "lg";
};

const cardVariants = cva("border border-text", {
  variants: {
    variant: {
      default: "bg-foreground/50",
      placeholder: "border-dashed bg-foreground/50 text-text/50",
    },
    size: {
      sm: "p-2",
      md: "p-3",
      lg: "p-4",
    },
  },

  defaultVariants: {
    variant: "default",
    size: "lg",
  },
});

export function Card({
  children,
  className = "",
  size = "lg",
  variant = "default",
}: CardProps) {
  return (
    <div className={cn(cardVariants({ size, variant, className }))}>
      {children}
    </div>
  );
}
