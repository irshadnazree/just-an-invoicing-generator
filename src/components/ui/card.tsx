import type { ReactNode } from "react";

export type CardPadding = "sm" | "md" | "lg";

export type CardProps = {
  children: ReactNode;
  className?: string;
  padding?: CardPadding;
};

const paddingClasses = {
  sm: "p-2",
  md: "p-3",
  lg: "p-4",
};

export function Card({ children, className = "", padding = "lg" }: CardProps) {
  return (
    <div
      className={`border border-border bg-card ${paddingClasses[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
