import { cva } from "class-variance-authority";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "text";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

export type ButtonProps = {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
  title?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
};

const buttonVariants = cva(
  "flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded font-medium transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
        text: "font-semibold text-primary hover:text-primary/80",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
        icon: "p-2",
      },
    },
  }
);

export function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  className = "",
  disabled = false,
  title,
  icon,
  fullWidth = false,
}: ButtonProps) {
  const widthClass = fullWidth ? "flex-1" : "";

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }), widthClass)}
      disabled={disabled}
      onClick={onClick}
      title={title}
      type={type}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
