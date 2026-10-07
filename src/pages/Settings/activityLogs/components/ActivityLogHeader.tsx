import { useEffect, useRef, useState } from "react";
import { endOfDay, startOfDay } from "date-fns";
import { Search, X } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import { ACTION_CONFIG } from "../config/action.config";
import { ENTITY_CONFIG } from "../config/entity.config";

export type ActivityLogFilters = {
  search: string;
  entityType: string;
  action: string;
  dateRange: DateRange | undefined;
};

type ActivityLogHeaderProps = {
  filters: ActivityLogFilters;
  totalDocs: number;
  onChange: (filters: ActivityLogFilters) => void;
};

const ALL = "all";

export const ActivityLogHeader = ({
  filters,
  totalDocs,
  onChange,
}: ActivityLogHeaderProps) => {
  const [search, setSearch] = useState(filters.search);
  const filtersRef = useRef(filters);
  const onChangeRef = useRef(onChange);
  filtersRef.current = filters;
  onChangeRef.current = onChange;

  useEffect(() => {
    setSearch(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (search === filtersRef.current.search) return;
      onChangeRef.current({ ...filtersRef.current, search });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search]);

  const hasFilters = Boolean(
    filters.search || filters.entityType || filters.action || filters.dateRange?.from,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-slate-900">Activity Timeline</h1>
          <p className="text-sm text-slate-500">
            {totalDocs} {totalDocs === 1 ? "event" : "events"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, action, or record"
            className="input-field h-10 border bg-white pr-3 pl-9 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        <Select
          value={filters.entityType || ALL}
          onValueChange={(value) =>
            onChange({ ...filters, entityType: value === ALL ? "" : value })
          }
        >
          <SelectTrigger className="input-field h-10 w-full bg-white text-sm lg:w-44">
            <SelectValue placeholder="All records" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All records</SelectItem>
            {Object.entries(ENTITY_CONFIG).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.action || ALL}
          onValueChange={(value) =>
            onChange({ ...filters, action: value === ALL ? "" : value })
          }
        >
          <SelectTrigger className="input-field h-10 w-full bg-white text-sm lg:w-40">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All actions</SelectItem>
            {Object.entries(ACTION_CONFIG).map(([value, config]) => (
              <SelectItem key={value} value={value}>
                {config.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker
          dateRange={filters.dateRange}
          onDateRangeChange={(range) => onChange({ ...filters, dateRange: range })}
        />

        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => {
              setSearch("");
              onChange({
                search: "",
                entityType: "",
                action: "",
                dateRange: undefined,
              });
            }}
          >
            <X className="size-4" />
            Clear
          </Button>
        ) : null}
      </div>
    </div>
  );
};

export const toActivityQueryDates = (range: DateRange | undefined) => {
  if (!range?.from) return { startDate: "", endDate: "" };
  const end = range.to || range.from;
  return {
    startDate: startOfDay(range.from).toISOString(),
    endDate: endOfDay(end).toISOString(),
  };
};
