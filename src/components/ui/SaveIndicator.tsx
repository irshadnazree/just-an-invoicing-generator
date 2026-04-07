import { SpinnerIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type SaveIndicatorProps = {
  show: boolean;
  className?: string;
};

export function SaveIndicator({
  show,
  className,
}: SaveIndicatorProps): ReactNode {
  if (!show) {
    return null;
  }

  return (
    <div
      className={cn(
        "animate-in fade-in flex items-center gap-2 text-sm text-muted-foreground duration-200",
        className
      )}
    >
      <SpinnerIcon icon="spinner" className="size-4 animate-spin" />
      <span>Saving...</span>
    </div>
  );
}
