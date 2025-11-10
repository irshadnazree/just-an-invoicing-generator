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
  "border border-gray-300 px-4 py-2 w-full flex-1 focus:border-transparent focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";

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
