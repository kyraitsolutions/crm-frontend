import { useMemo, useState } from "react";
import { getDateRange } from "@/utils/date-utils";

export interface LocalFilters {
    source: string;
    status: string;
    stage?: string;
    read?: boolean | null;
    startDate: string | null;
    endDate: string | null;
}

interface EnableFilter {
    stage?: boolean,
    read?: boolean
}
interface FilterProps {
    enable: EnableFilter,
    openFilter: boolean;
    setOpenFilter: (open: boolean) => void;
    initialFilters: LocalFilters;

    onApply: (filters: {
        source: string;
        status: string;
        stage?: string;
        read?: boolean | null;
        dateRange: {
            startDate: string;
            endDate: string;
        };
    }) => void;

    onReset: () => void;

    statusOptions?: { label: string; value: string }[];
    sourceOptions?: { label: string; value: string }[];
    stageOptions?: { label: string; value: string }[];
}

const DATE_PRESETS = [1, 7, 15, 30, 90];

const EMPTY_FILTERS: LocalFilters = {
    source: "",
    status: "",
    stage: "",
    read: null,
    startDate: null,
    endDate: null,
};

const Filter = ({
    enable,
    openFilter,
    setOpenFilter,
    initialFilters,
    onApply,
    onReset,
    statusOptions = [],
    sourceOptions = [],
    stageOptions = [],
}: FilterProps) => {
    const [selectedDays, setSelectedDays] = useState<number>();
    const [localFilters, setLocalFilters] = useState<LocalFilters>(initialFilters);

    const { computedStartDate, computedEndDate } = useMemo(() => {
        if (selectedDays !== undefined) {
            const { startDate, endDate } =
                getDateRange({ days: selectedDays });

            return {
                computedStartDate: startDate,
                computedEndDate: endDate,
            };
        }

        return {
            computedStartDate: localFilters.startDate ?? "",
            computedEndDate: localFilters.endDate ?? "",
        };
    }, [
        selectedDays,
        localFilters.startDate,
        localFilters.endDate,
    ]);

    const updateFilter = <K extends keyof LocalFilters>(key: K, value: LocalFilters[K]) => {
        setLocalFilters((prev) => ({
            ...prev, [key]: value,
        }));

        if (["startDate", "endDate"].includes(key) && selectedDays !== undefined) {
            setSelectedDays(undefined);
        }
    };

    const handleApplyFilter = () => {
        const dateRange = selectedDays !== undefined
            ? getDateRange({ days: selectedDays })
            : {
                startDate: localFilters.startDate ?? "",
                endDate: localFilters.endDate ?? "",
            };

        onApply({
            source: localFilters.source,
            status: localFilters.status,
            stage: localFilters.stage,
            read: localFilters.read,
            dateRange,
        });

        setOpenFilter(false);
    };

    const handleReset = () => {
        setLocalFilters(EMPTY_FILTERS);
        setSelectedDays(undefined);
        onReset();
    };

    const hasActiveFilters =
        !!localFilters.source ||
        !!localFilters.status ||
        !!localFilters.stage ||
        localFilters.read !== null ||
        !!localFilters.startDate ||
        !!localFilters.endDate;

    if (!openFilter) return null;

    return (
        <div
            className="absolute inset-0 z-50"
            onClick={() => setOpenFilter(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative mt-10 w-[470px] rounded-xl border border-primary bg-white p-5 shadow-xl"
            >
                <div className="absolute -top-[12px] left-8 h-5.5 w-5.5 rotate-45 rounded-sm border-l border-t border-primary bg-white" />

                <h3 className="mb-4 text-sm font-semibold text-start">
                    Filters
                </h3>

                <div className="space-y-3">
                    <div>
                        <label className="mb-2 text-start block text-sm font-medium">
                            Date Range
                        </label>

                        <div className="flex flex-wrap gap-2">
                            {DATE_PRESETS.map((day) => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDays(day)}
                                    className={`flex-1 whitespace-nowrap rounded-xl border px-3 py-1.5 text-sm transition ${selectedDays === day
                                        ? "border-primary bg-primary text-white"
                                        : "hover:border-primary"
                                        }`}
                                >
                                    {day === 1 ? "Today's" : `${day} Days`}
                                </button>
                            ))}
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-3">
                            <input
                                type="date"
                                value={computedStartDate}
                                onChange={(e) =>
                                    updateFilter("startDate", e.target.value)
                                }
                                className="rounded-xl border px-3 py-2 text-sm"
                            />

                            <input
                                type="date"
                                value={computedEndDate}
                                onChange={(e) =>
                                    updateFilter("endDate", e.target.value)
                                }
                                className="rounded-xl border px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <select
                            value={localFilters.status}
                            onChange={(e) =>
                                updateFilter("status", e.target.value)
                            }
                            className="w-full rounded-xl border px-3 py-2 text-sm"
                        >
                            <option value="">All Status</option>
                            {statusOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={localFilters.source}
                            onChange={(e) =>
                                updateFilter("source", e.target.value)
                            }
                            className="w-full rounded-xl border px-3 py-2 text-sm"
                        >
                            <option value="">All Sources</option>
                            {sourceOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(enable?.stage || enable?.read) && <div className="flex gap-2">
                        {enable?.stage && <select
                            value={localFilters.stage}
                            onChange={(e) =>
                                updateFilter("stage", e.target.value)
                            }
                            className="w-full rounded-xl border px-3 py-2 text-sm"
                        >
                            <option value="">All Stages</option>
                            {stageOptions.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>}

                        {enable?.read && <select
                            value={
                                localFilters.read === null
                                    ? ""
                                    : String(localFilters.read)
                            }
                            onChange={(e) =>
                                updateFilter(
                                    "read",
                                    e.target.value === ""
                                        ? null
                                        : e.target.value === "true"
                                )
                            }
                            className="w-full rounded-xl border px-3 py-2 text-sm"
                        >
                            <option value="">All</option>
                            <option value="true">Read</option>
                            <option value="false">Unread</option>
                        </select>}
                    </div>
                    }

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            onClick={() => setOpenFilter(false)}
                            className="rounded-xl border px-4 py-1.5 text-sm"
                        >
                            Cancel
                        </button>

                        {hasActiveFilters && (
                            <button
                                onClick={handleReset}
                                className="rounded-xl bg-primary px-4 py-1.5 text-sm text-white"
                            >
                                Reset
                            </button>
                        )}

                        <button
                            onClick={handleApplyFilter}
                            className="rounded-xl bg-primary px-4 py-1.5 text-sm text-white"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Filter;