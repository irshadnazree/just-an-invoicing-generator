import type { ReactNode } from "react";

export type TableProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className = "" }: TableProps) {
  return <table className={`w-full ${className}`}>{children}</table>;
}

export type TableHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function TableHeader({ children, className = "" }: TableHeaderProps) {
  return (
    <thead className={`border-black border-b-2 bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
}

export type TableRowProps = {
  children: ReactNode;
  className?: string;
};

export function TableRow({ children, className = "" }: TableRowProps) {
  return <tr className={`border-black border-b ${className}`}>{children}</tr>;
}

export type TableCellProps = {
  children: ReactNode;
  className?: string;
  colSpan?: number;
  width?: string;
  align?: "left" | "center" | "right";
};

export function TableCell({
  children,
  className = "",
  colSpan,
  width,
  align = "left",
}: TableCellProps) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <td
      className={`p-3 ${width ? `w-${width}` : ""} ${alignmentClass} ${className}`}
      colSpan={colSpan}
    >
      {children}
    </td>
  );
}

export type TableHeaderCellProps = {
  children: ReactNode;
  className?: string;
  width?: string;
  align?: "left" | "center" | "right";
};

export function TableHeaderCell({
  children,
  className = "",
  width,
  align = "left",
}: TableHeaderCellProps) {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align];

  return (
    <th
      className={`border-black border-r p-3 font-bold ${alignmentClass} ${className}`}
      style={width ? { width } : undefined}
    >
      {children}
    </th>
  );
}
