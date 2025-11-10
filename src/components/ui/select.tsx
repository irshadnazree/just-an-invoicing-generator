import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  className?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
};

const selectVariants = cva(
  "h-10.5 w-full border border-input bg-background px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {},
  }
);

export function Select({
  id,
  value,
  onChange,
  options,
  required = false,
  className = "",
  disabled = false,
  placeholder,
}: SelectProps) {
  return (
    <select
      className={cn(selectVariants({ className }))}
      disabled={disabled}
      id={id}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      value={value}
    >
      {placeholder && (
        <option disabled value="">
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
