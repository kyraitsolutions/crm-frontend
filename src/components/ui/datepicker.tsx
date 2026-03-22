import { cn } from "@/lib/utils";
import React from "react";

type DatepickerProps = {
  value?: Date | { from?: Date; to?: Date };
  onChange?: (value: any) => void;
  mode?: "single" | "range";
} & React.HTMLAttributes<HTMLDivElement>;

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

const Datepicker = ({
  value,
  onChange,
  mode = "single",
  className,
  ...rest
}: DatepickerProps) => {
  const today = new Date();

  // SINGLE calendar state
  const [month1, setMonth1] = React.useState(today.getMonth());
  const [year1, setYear1] = React.useState(today.getFullYear());

  // SECOND calendar (for range)
  const [month2, setMonth2] = React.useState(today.getMonth() + 1);
  const [year2, setYear2] = React.useState(today.getFullYear());

  const [open, setOpen] = React.useState(false);

  const [range, setRange] = React.useState<{
    from?: Date;
    to?: Date;
  }>({});

  // 🧠 Generate days
  function generate(year: number, month: number) {
    const first = new Date(year, month, 1).getDay();
    const last = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < first; i++) days.push(null);
    for (let i = 1; i <= last; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  }

  // 🧠 Selection
  function handleSelect(date: Date) {
    if (mode === "single") {
      onChange?.(date);
      setOpen(false);
      return;
    }

    if (!range.from) {
      setRange({ from: date });
    } else if (!range.to) {
      // ❌ block reverse selection
      if (date < range.from) return;

      const newRange = { from: range.from, to: date };
      setRange(newRange);
      onChange?.(newRange);
    } else {
      // reset
      setRange({ from: date, to: undefined });
    }
  }

  function isSame(a?: Date, b?: Date) {
    return a?.toDateString() === b?.toDateString();
  }

  function inRange(d: Date) {
    if (!range.from || !range.to) return false;
    return d > range.from && d < range.to;
  }

  // 🧠 Navigation helpers
  function next(m: number, y: number, setM: any, setY: any) {
    if (m === 11) {
      setM(0);
      setY(y + 1);
    } else setM(m + 1);
  }

  function prev(m: number, y: number, setM: any, setY: any) {
    if (m === 0) {
      setM(11);
      setY(y - 1);
    } else setM(m - 1);
  }

  // 🧠 Calendar UI
  const Calendar = (month: number, year: number, setM: any, setY: any) => {
    const days = generate(year, month);

    return (
      <div className="w-[220px]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => prev(month, year, setM, setY)}>◀</button>
          <span className="font-medium">
            {months[month]} {year}
          </span>
          <button onClick={() => next(month, year, setM, setY)}>▶</button>
        </div>

        {/* WEEK */}
        <div className="grid grid-cols-7 text-xs text-center mb-1">
          {weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        {/* DAYS */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) =>
            d ? (
              <button
                key={i}
                onClick={() => handleSelect(d)}
                className={cn(
                  "p-2 text-sm rounded-md",

                  isSame(d, range.from) && "bg-blue-600 text-white",

                  isSame(d, range.to) && "bg-blue-600 text-white",

                  inRange(d) && "bg-blue-100",
                )}
              >
                {d.getDate()}
              </button>
            ) : (
              <div key={i} />
            ),
          )}
        </div>
      </div>
    );
  };

  return (
    <div {...rest} className={cn("relative", className)}>
      {/* INPUT */}
      <div
        onClick={() => setOpen(!open)}
        className="border p-2 rounded cursor-pointer"
      >
        {mode === "single"
          ? (value as Date)?.toDateString() || "Select date"
          : `${range.from?.toDateString() || "Start"} → ${
              range.to?.toDateString() || "End"
            }`}
      </div>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute top-full mt-2 bg-white p-4 border rounded shadow flex gap-6">
          {/* SINGLE */}
          {mode === "single" && Calendar(month1, year1, setMonth1, setYear1)}

          {/* RANGE */}
          {mode === "range" && (
            <>
              {Calendar(month1, year1, setMonth1, setYear1)}
              {Calendar(month2, year2, setMonth2, setYear2)}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Datepicker;
