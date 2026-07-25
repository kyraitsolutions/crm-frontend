import { useState } from "react";
import TimezoneSelect from "./TimezoneSelect";
import { defaultSchedule } from "../../utils/defaultSchedule";
import WeekCard from "./WeekCard";
const WorkingHours = () => {
    const [timezone, setTimezone] = useState("Asia/Kolkata (+05:30)");
    const [schedule, setSchedule] = useState(defaultSchedule);

    const updateDay = (index: number, value: Partial<(typeof schedule)[0]>) => {
        setSchedule((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, ...value } : item
            )
        );
    };

    return (
        <div className="rounded-xl bg-white p-10">
            <h2 className="text-md">Working Hours</h2>

            <p className="mt-1 text-sm text-gray-500">
                Configure day-wise working hours for automated replies
            </p>

            <div className="mt-5">
                <TimezoneSelect
                    value={timezone}
                    onChange={setTimezone}
                />
            </div>

            <div className="mt-8 space-y-5">
                {schedule.map((day, index) => (
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