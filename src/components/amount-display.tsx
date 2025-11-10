import type { ReactNode } from "react";

export type AmountDisplayProps = {
  label: ReactNode;
  id: string;
  value: string | number;
  prefix?: string;
  className?: string;
  fullWidth?: boolean;
};

export function AmountDisplay({
  label,
  id,
  value,
  prefix,
  className = "",
  fullWidth = true,
}: AmountDisplayProps) {
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <div className={className}>
      <label className="mb-2 block font-medium text-sm" htmlFor={id}>
        {label}
      </label>
      <div
        className={`border border-gray-300 bg-gray-100 px-4 py-2 font-semibold text-gray-700 ${widthClass}`}
        id={id}
      >
        {prefix} {value}
      </div>
    </div>
  );
}
