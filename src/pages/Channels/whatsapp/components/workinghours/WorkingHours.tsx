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
    <div className="rounded-2xl bg-white p-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-md">Working Hours</h2>
          <p className="mt-1 text-sm text-gray-500">
            Configure day-wise working hours for automated replies and auto resolve
          </p>
        </div>
        <Button
          className="rounded-xl bg-teal-900 hover:bg-teal-900/80"
          disabled={saving}
          onClick={onSave}
        >
          {saving ? "Saving..." : "Save hours"}
        </Button>
      </div>

      <div className="mt-5">
        <TimezoneSelect value={timezone} onChange={onTimezoneChange} />
      </div>

      <div className="mt-8 space-y-5">
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
