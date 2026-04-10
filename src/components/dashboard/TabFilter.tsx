import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
};

type TabFilterProps = {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  tabs: Tab[];
};

const tabVariants = cva(
  "relative px-4 py-2 font-medium text-sm transition-colors duration-200",
  {
    variants: {
      isActive: {
        true: "text-primary",
        false: "text-muted hover:text-text",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  }
);

export function TabFilter({ activeTab, onTabChange, tabs }: TabFilterProps) {
  return (
    <div
      aria-label="Filter documents by type"
      className="flex items-center gap-1 border border-text/20 bg-foreground/50 p-1"
      role="tablist"
    >
      {tabs.map((tab) => (
        <button
          aria-selected={activeTab === tab.id}
          className={cn(
            tabVariants({ isActive: activeTab === tab.id }),
            activeTab === tab.id && "bg-background shadow-sm"
          )}
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          role="tab"
          type="button"
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
