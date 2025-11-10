import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

export type InputType = "text" | "number" | "date" | "email";

export type InputProps = {
  id: string;
  type?: InputType;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
};

const inputVariants = cva(
  "w-full flex-1 border border-gray-300 px-4 py-2 focus:border-transparent disabled:cursor-not-allowed disabled:bg-gray-100",
  {
    variants: {},
  }
);

export function Input({
  id,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
  disabled = false,
  min,
  max,
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === "number") {
      const newValue =
        e.target.value === "" ? 0 : Number.parseInt(e.target.value, 10) || 0;
      onChange(newValue);
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <input
      className={cn(inputVariants({ className }))}
      disabled={disabled}
      id={id}
      max={max}
      min={min}
      onChange={handleChange}
      placeholder={placeholder}
      required={required}
      type={type}
      value={value}
    />
  );
}
