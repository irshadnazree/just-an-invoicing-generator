import { Toast } from "@base-ui/react/toast";
import { CheckCircle, X, XCircle } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type ToastViewportProps = {
  className?: string;
};

export function ToastViewport({ className }: ToastViewportProps) {
  return (
    <Toast.Portal>
      <Toast.Viewport
        className={cn(
          "fixed top-4 right-4 z-[100] flex flex-col gap-2 focus:outline-none",
          className
        )}
      />
    </Toast.Portal>
  );
}

export type ToastItemProps = {
  toast: {
    id: string;
    title?: ReactNode;
    description?: ReactNode;
    type?: "success" | "error";
  };
};

export function ToastItem({ toast }: ToastItemProps) {
  const isSuccess = toast.type === "success";

  return (
    <Toast.Root
      className={cn(
        "group pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg px-4 py-3 shadow-lg ring-1 ring-black/5 transition-all duration-300",
        isSuccess ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
      )}
      toast={toast}
    >
      {isSuccess ? (
        <CheckCircle className="size-5 shrink-0" weight="fill" />
      ) : (
        <XCircle className="size-5 shrink-0" weight="fill" />
      )}
      <div className="flex flex-1 flex-col gap-1">
        {toast.title && (
          <Toast.Title className="font-semibold text-sm">
            {toast.title}
          </Toast.Title>
        )}
        {toast.description && (
          <Toast.Description className="text-sm opacity-90">
            {toast.description}
          </Toast.Description>
        )}
      </div>
      <Toast.Close className="flex shrink-0 cursor-pointer items-center justify-center rounded p-1 transition-colors hover:bg-white/20">
        <X className="size-4" weight="bold" />
      </Toast.Close>
    </Toast.Root>
  );
}
