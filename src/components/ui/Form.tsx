import type * as React from "react";

import { cn } from "@/lib/utils";

export type FormFieldProps = {
  children: React.ReactNode;
  className?: string;
  invalid?: boolean;
  error?: string;
};

export function FormField({
  children,
  className,
  invalid = false,
  error,
}: FormFieldProps) {
  return (
    <div
      className={cn("flex w-full flex-1 flex-col items-start gap-1", className)}
      data-invalid={invalid || undefined}
    >
      {children}
      {invalid && error && (
        <span className="text-sm text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

export type FormLabelProps = {
  id?: string;
  label: string;
  required?: boolean;
};

export function FormLabel({ id, label, required = false }: FormLabelProps) {
  return (
    <label className="block text-base" htmlFor={id}>
      {label}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

export type FormDescriptionProps = {
  children: React.ReactNode;
};

export function FormDescription({ children }: FormDescriptionProps) {
  return <span className="text-sm text-text/60">{children}</span>;
}
