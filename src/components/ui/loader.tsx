import { cn } from "@/lib/utils";

export type LoaderProps = {
  size?: "sm" | "default" | "lg";
  className?: string;
  text?: string;
};

export function Loader({ size = "default", className, text }: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const textSizes = {
    sm: "text-sm",
    default: "text-base",
    lg: "text-lg",
  };

  return (
    <output
      aria-label={text || "Loading"}
      aria-live="polite"
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "animate-spin rounded-full border-2 border-primary/20 border-t-primary",
          sizeClasses[size]
        )}
      />
      {text && (
        <span className={cn("text-text/80", textSizes[size])}>{text}</span>
      )}
      <span className="sr-only">{text || "Loading content, please wait"}</span>
    </output>
  );
}
