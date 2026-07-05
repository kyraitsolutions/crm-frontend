import * as React from "react";

import { CalendarIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { RangeOption } from "../types/dashboard.type";
import {
  DATE_RANGE_OPTIONS,
  MODULE_OPTIONS,
} from "../constants/dashboard.constants";
import { useDashboardStore } from "../store/dashboard.store";
import { useAuthStore } from "@/stores";

export function DashboardHeader() {
  const { user } = useAuthStore((state) => state);
  const { setFilters } = useDashboardStore((state) => state);
  const [selectedModule, setSelectedModule] = React.useState("overview");

  const [selectedRange, setSelectedRange] =
    React.useState<RangeOption>("7days");

  // const [startDate, setStartDate] = React.useState("");
  // const [endDate, setEndDate] = React.useState("");
  // const isCustomRange = selectedRange === "custom";

  const handleDateRangeChange = (value: RangeOption) => {
    setSelectedRange(value);

    if (value === "custom") return;
    setFilters({ range: value });
  };

  const handleModuleChange = (value: string) => {
    setSelectedModule(value);
    setFilters({ module: value });
  };

  console.log("user", user);

  return (
    <header className="flex flex-col gap-4 bg-white px-4 py-1.5 md:flex-row md:items-center  md:justify-between">
      {/* LEFT */}
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

      {/* RIGHT */}
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

          <SelectContent className="rounded-xl shadow-sm">
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

        <Select
          value={selectedRange}
          onValueChange={(value) => handleDateRangeChange(value as RangeOption)}
        >
          <SelectTrigger className="h-8! input-field border-gray-200! cursor-pointer shadow-sm">
            <div className="flex items-center gap-2 input-field rounded-2xl!">
              <CalendarIcon size={14} />
              <SelectValue />
            </div>
          </SelectTrigger>

          <SelectContent>
            {DATE_RANGE_OPTIONS.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* {isCustomRange && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="rounded-md border px-3 py-2 text-sm"
            />
          </div>
        )} */}
      </div>
    </header>
  );
}
