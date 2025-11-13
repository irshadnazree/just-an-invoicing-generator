import { cn } from "@/lib/utils";

export type TextareaProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  className?: string;
  disabled?: boolean;
};

const baseTextareaClasses =
  "w-full flex-1 h-24 border border-input bg-background px-3 py-2 focus:outline-none focus:ring-1 focus:ring-text/80 disabled:cursor-not-allowed disabled:opacity-50 resize-none";

export function Textarea({
  id,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  className = "",
  disabled = false,
}: TextareaProps) {
  return (
    <textarea
      className={cn(baseTextareaClasses, className)}
      disabled={disabled}
      id={id}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      rows={rows}
      value={value}
    />
  );
}
