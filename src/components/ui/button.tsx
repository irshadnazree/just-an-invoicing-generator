import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost";
  size?: "sm" | "default";
  icon?: React.ReactNode;
};

const buttonVariants = cva(
  "flex cursor-pointer items-center rounded-md transition-all duration-300 ease-out-cubic hover:duration-100 focus:outline-none focus:ring-0",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-foreground hover:ring-1 hover:ring-primary/50 dark:bg-foreground dark:text-primary",
        ghost: "bg-transparent text-primary hover:bg-foreground/50",
      },
      size: {
        sm: "gap-2 px-3 py-1 font-semibold text-sm",
        default: "gap-3 px-4 py-2 text-base text-sm xl:px-7 xl:py-3",
      },
      iconSize: {
        sm: "size-fit p-1.5",
        default: "size-fit px-2 xl:p-3",
        none: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      iconSize: "none",
    },
  }
);

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "default",
  icon,
}: ButtonProps) {
  let iconSize: "none" | "sm" | "default" = "default";
  if (children) {
    iconSize = "none";
  } else if (size === "sm") {
    iconSize = "sm";
  } else {
    iconSize = "default";
  }

  return (
    <button
      className={cn(buttonVariants({ size, iconSize, variant }))}
      onClick={onClick}
      type="button"
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
