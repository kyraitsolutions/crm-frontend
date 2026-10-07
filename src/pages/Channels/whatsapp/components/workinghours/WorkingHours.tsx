import { Button } from "@/components/ui/button";
import TimezoneSelect from "./TimezoneSelect";
import { defaultSchedule, type DaySchedule } from "../../utils/defaultSchedule";
import WeekCard from "./WeekCard";

type Props = {
  timezone: string;
  schedule: DaySchedule[];
  saving?: boolean;
  onTimezoneChange: (value: string) => void;
  onScheduleChange: (value: DaySchedule[]) => void;
  onSave: () => void;
};

const WorkingHours = ({
  timezone,
  schedule,
  saving,
  onTimezoneChange,
  onScheduleChange,
  onSave,
}: Props) => {
  const days = schedule.length ? schedule : defaultSchedule;

  const updateDay = (index: number, value: Partial<DaySchedule>) => {
    onScheduleChange(
      days.map((item, i) => (i === index ? { ...item, ...value } : item)),
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Working Hours</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure day-wise hours for automated replies and auto resolve.
          </p>
        </div>
        <Button
          className="rounded-xl! bg-teal-900 hover:bg-teal-900/80 shrink-0"
          disabled={saving}
          onClick={onSave}
        >
          {saving ? "Saving..." : "Save hours"}
        </Button>
      </div>

      <div className="mt-4">
        <TimezoneSelect value={timezone} onChange={onTimezoneChange} />
      </div>

      <div className="mt-5 space-y-3">
        {days.map((day, index) => (
          <WeekCard
            key={day.day}
            data={day}
            onChange={(value) => updateDay(index, value)}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkingHours;
