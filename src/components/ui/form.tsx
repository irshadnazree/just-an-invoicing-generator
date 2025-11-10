import { cn } from "@/lib/utils";

export type FormFieldProps = {
  children: React.ReactNode;
  className?: string;
};

function FormField({ children, className }: FormFieldProps) {
  return (
    <div
      className={cn("flex w-full flex-1 flex-col items-start gap-1", className)}
    >
      {children}
    </div>
  );
}

type FormLabelProps = {
  id: string;
  label: string;
};

function FormLabel({ id, label }: FormLabelProps) {
  return (
    <label className="block font-medium text-base" htmlFor={id}>
      {label}
    </label>
  );
}

export { FormField, FormLabel };
