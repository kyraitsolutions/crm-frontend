"use client";

import * as React from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";

type RangeOption = "today" | "7days" | "30days" | "custom";

export function DashboardHeader() {
  const [selectedRange, setSelectedRange] =
    React.useState<RangeOption>("7days");

  const [showDropdown, setShowDropdown] = React.useState(false);

  const [showCustomPicker, setShowCustomPicker] = React.useState(false);

  const [startDate, setStartDate] = React.useState("2025-05-12");
  const [endDate, setEndDate] = React.useState("2025-05-18");

  const handleSelect = (value: RangeOption) => {
    setSelectedRange(value);
    setShowDropdown(false);

    if (value === "custom") {
      setShowCustomPicker(true);
    } else {
      setShowCustomPicker(false);
    }
  };

  const getRangeLabel = () => {
    switch (selectedRange) {
      case "today":
        return "Today";

      case "7days":
        return "Last 7 Days";

      case "30days":
        return "Last 30 Days";

      case "custom":
        return `${startDate} - ${endDate}`;

      default:
        return "Select Range";
    }
  };

  return (
    <header className="bg-white px-4 py-2">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* LEFT */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-md font-semibold tracking-tight text-neutral-900">
              Dashboard
            </h1>

            <p className="text-xs text-neutral-500">Welcome back, John! 👋</p>
          </div>

          {/* MODULE DROPDOWN */}
          <div className="relative">
            <button className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-1 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50">
              Overview
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* Example Dropdown */}
            {/* <div className="absolute left-0 top-12 z-50 min-w-[180px] rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
              <button className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-neutral-100">
                All Modules
              </button>

              <button className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-neutral-100">
                Leads
              </button>

              <button className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-neutral-100">
                Revenue
              </button>

              <button className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-neutral-100">
                Analytics
              </button>
            </div> */}
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown((prev) => !prev)}
            className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50"
          >
            <CalendarIcon size={14} className="text-neutral-500" />

            <span>{getRangeLabel()}</span>

            <ChevronDown className="text-neutral-500" />
          </button>

          {/* RANGE DROPDOWN */}
          {showDropdown && (
            <div className="absolute right-0 top-14 z-50 w-[240px] rounded-2xl border border-neutral-200 bg-white p-2 shadow-2xl">
              <button
                onClick={() => handleSelect("today")}
                className="w-full rounded-xl px-4 py-3 text-left text-sm transition hover:bg-neutral-100"
              >
                Today
              </button>

              <button
                onClick={() => handleSelect("7days")}
                className="w-full rounded-xl px-4 py-3 text-left text-sm transition hover:bg-neutral-100"
              >
                Last 7 Days
              </button>

              <button
                onClick={() => handleSelect("30days")}
                className="w-full rounded-xl px-4 py-3 text-left text-sm transition hover:bg-neutral-100"
              >
                Last 30 Days
              </button>

              <button
                onClick={() => handleSelect("custom")}
                className="w-full rounded-xl px-4 py-3 text-left text-sm transition hover:bg-neutral-100"
              >
                Custom Range
              </button>

              {/* CUSTOM PICKER */}
              {showCustomPicker && (
                <div className="mt-3 space-y-3 border-t pt-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-500">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-neutral-500">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                    />
                  </div>

                  <button
                    onClick={() => setShowDropdown(false)}
                    className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Apply Range
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// export function DashboardHeader() {
//   return (
//     <header className="bg-black/20 p-2">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <h1 className="text-base font-medium">Documents</h1>
//         <div className="ml-auto flex items-center gap-2"></div>
//       </div>
//     </header>
//   );
// }
