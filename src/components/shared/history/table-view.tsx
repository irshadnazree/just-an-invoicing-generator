import { CopyIcon, PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";

export type TableColumn<TItem> = {
  key: string;
  label: string;
  width: string;
  cellClassName?: string;
  renderCell: (item: TItem) => ReactNode;
};

type TableViewProps<TItem extends { id: string }, TStoredItem> = {
  items: TItem[];
  columns: TableColumn<TItem>[];
  setItems: (items: TStoredItem[]) => void;
  selectedItems: Set<string>;
  setSelectedItems: (selectedItems: Set<string>) => void;
  setPendingDeleteId: (pendingDeleteId: string | null) => void;
  loadItems: () => Promise<TStoredItem[]>;
  duplicateItem: (id: string) => string | null;
  openItem: (id: string) => void;
  actionColumnWidth?: string;
  getItemLabel?: (item: TItem) => string;
};

export default function TableView<TItem extends { id: string }, TStoredItem>({
  items,
  columns,
  setItems,
  selectedItems,
  setSelectedItems,
  setPendingDeleteId,
  loadItems,
  duplicateItem,
  openItem,
  actionColumnWidth = "w-[12%]",
  getItemLabel,
}: TableViewProps<TItem, TStoredItem>) {
  function toggleSelection(id: string) {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedItems(newSelection);
  }

  function toggleSelectAll() {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  }

  async function handleDuplicateItem(id: string) {
    const newId = duplicateItem(id);
    if (newId) {
      setItems(await loadItems());
      openItem(newId);
    }
  }

  function handleDeleteItem(id: string) {
    setPendingDeleteId(id);
  }

  return (
    <table className="w-full table-fixed divide-y divide-text/50 bg-foreground/80">
      <thead>
        <tr>
          <th className="w-[4%] px-2 py-2 text-left" scope="col">
            <Checkbox
              checked={selectedItems.size === items.length && items.length > 0}
              className="m-0"
              id="select-all"
              label={<span className="sr-only">Select all</span>}
              onChange={toggleSelectAll}
            />
          </th>

          {columns.map((column) => (
            <th
              className={cn(
                "overflow-hidden px-4 py-2 text-left font-medium text-text text-xs uppercase tracking-wider",
                column.width
              )}
              key={column.key}
              scope="col"
            >
              {column.label}
            </th>
          ))}

          <th
            className={cn(
              "overflow-hidden px-4 py-2 text-left font-medium text-text text-xs uppercase tracking-wider",
              actionColumnWidth
            )}
            scope="col"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const itemLabel = getItemLabel?.(item) ?? item.id;

          return (
            <tr className="hover:bg-foreground" key={item.id}>
              <td className="w-[4%] whitespace-nowrap px-2 py-2">
                <Checkbox
                  checked={selectedItems.has(item.id)}
                  className="m-0"
                  id={`select-${item.id}`}
                  label={
                    <span className="sr-only">Select row {itemLabel}</span>
                  }
                  onChange={() => toggleSelection(item.id)}
                />
              </td>

              {columns.map((column) => (
                <td
                  className={cn(
                    "overflow-hidden px-4 py-2 text-sm align-middle",
                    column.width,
                    column.cellClassName
                  )}
                  key={column.key}
                >
                  {column.renderCell(item)}
                </td>
              ))}

              <td
                className={cn(
                  "whitespace-nowrap px-4 py-2 text-right font-medium text-sm",
                  actionColumnWidth
                )}
              >
                <div
                  className={cn(
                    "flex justify-start gap-1",
                    selectedItems.size > 0 &&
                      "pointer-events-none cursor-not-allowed opacity-50"
                  )}
                >
                  <Button
                    aria-label={`Edit ${itemLabel}`}
                    icon={<PencilSimpleIcon size={22} />}
                    onClick={() => openItem(item.id)}
                    size="sm"
                    variant="ghost"
                  />
                  <Button
                    aria-label={`Duplicate ${itemLabel}`}
                    icon={<CopyIcon size={22} />}
                    onClick={() => void handleDuplicateItem(item.id)}
                    size="sm"
                    variant="ghost"
                  />

                  <Button
                    aria-label={`Delete ${itemLabel}`}
                    icon={<TrashIcon size={22} />}
                    onClick={() => handleDeleteItem(item.id)}
                    size="sm"
                    variant="ghost"
                  />
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
