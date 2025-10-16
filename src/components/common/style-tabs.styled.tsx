"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
};

type TabsProps = {
  tabs: Tab[];
  value: string;
  onChange: (val: string) => void;
  children: ReactNode;
  className?: string;
};

export function StyledTabs({
  tabs,
  value,
  onChange,
  children,
  className,
}: TabsProps) {
  return (
    <div className={cn("flex flex-col gap-4 lg:flex-row h-full", className)}>
      {/* Tab List */}
      <div
        className={cn(
          "hide-scrollbar min-h-11 flex gap-2 rounded-lg bg-muted/50 p-2",
          "overflow-x-auto w-full", 
          "lg:flex lg:flex-col lg:w-48 lg:h-fit lg:overflow-visible" 
        )}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                " flex items-center gap-2 px-4 py-2 text-sm font-medium transition whitespace-nowrap",
                "hover:bg-muted/80",
                value === tab.id
                  ? "bg-background shadow-sm rounded-full lg:rounded-md"
                  : "text-muted-foreground rounded-full lg:rounded-md",
                "lg:justify-start lg:w-full"
              )}
            >
              {Icon && <Icon className="h-4 w-4 shrink-0" />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="flex-1 h-full pr-2">
        {Array.isArray(children)
          ? children.map((child: any) =>
              child.props.value === value ? (
                <div key={child.props.value}>{child}</div>
              ) : null
            )
          : children}
      </div>
    </div>
  );
}

export function StyledTabPanel({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
