import * as React from "react";
import { endOfDay, startOfDay, subDays } from "date-fns";
import type { DateRange } from "react-day-picker";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/common/DateRangePicker";

import type { RangeOption } from "../types/dashboard.type";
import {
  DASHBOARD_DATE_PRESETS,
  MODULE_OPTIONS,
} from "../constants/dashboard.constants";
import { useDashboardStore } from "../store/dashboard.store";
import { useAuthStore } from "@/stores";

const defaultDateRange = (): DateRange => ({
  from: startOfDay(subDays(new Date(), 6)),
  to: endOfDay(new Date()),
});

export function DashboardHeader() {
  const { user } = useAuthStore((state) => state);
  const { setFilters } = useDashboardStore((state) => state);
  const [selectedModule, setSelectedModule] = React.useState("overview");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(defaultDateRange);

  const handleDateRangeChange = (range: DateRange | undefined, preset?: string) => {
    setDateRange(range);

    if (preset && preset !== "custom") {
      setFilters({
        range: preset as RangeOption,
        startDate: undefined,
        endDate: undefined,
      });
      return;
    }

    if (!range?.from || !range?.to) return;

    setFilters({
      range: "custom",
      startDate: startOfDay(range.from).toISOString(),
      endDate: endOfDay(range.to).toISOString(),
    });
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    setFilters({ module: value });
  };

  return (
    <header className="flex flex-col gap-4 bg-white px-4 py-1.5 md:flex-row md:items-center  md:justify-between">
      <div className="flex items-start gap-4">
        <div>
          <h1 className="text-base font-semibold text-neutral-900">
            Dashboard
          </h1>
          {user && (
            <p className="text-sm text-neutral-500">
              Welcome back, {user?.userProfile?.firstName}! 👋
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={selectedModule}
          onValueChange={(value) => handleModuleChange(value)}
        >
          <SelectTrigger className="h-8! input-field border-gray-200! cursor-pointer shadow-sm">
            <div>
              <SelectValue placeholder="Select module" />
            </div>
          </SelectTrigger>

          <SelectContent className="rounded-2xl shadow-sm">
            {MODULE_OPTIONS.map((item) => (
              <SelectItem
                className="text-sm hover:bg-gray-100! data-[state=checked]:bg-gray-200/70 data-[state=checked]:text-primary"
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker
          dateRange={dateRange}
          onDateRangeChange={handleDateRangeChange}
          presets={DASHBOARD_DATE_PRESETS}
        />
      </div>
    </header>
  );
}
