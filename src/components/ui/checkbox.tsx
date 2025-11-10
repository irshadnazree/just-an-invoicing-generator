import type { ReactNode } from "react";

export type CheckboxProps = {
  id: string;
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
};

export function Checkbox({
  id,
  label,
  checked,
  onChange,
  className = "",
  disabled = false,
}: CheckboxProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        checked={checked}
        className="h-4 w-4 cursor-pointer disabled:cursor-not-allowed"
        disabled={disabled}
        id={id}
        onChange={(e) => onChange(e.target.checked)}
        type="checkbox"
      />
      <label className="cursor-pointer font-medium text-sm" htmlFor={id}>
        {label}
      </label>
    </div>
  );
}
