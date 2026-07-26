import { Switch } from "@/components/ui/switch";
import TimePickerInput from "./TimePickerInput";
import type { DaySchedule } from "../../utils/defaultSchedule";

interface Props {
    data: DaySchedule;
    onChange: (value: Partial<DaySchedule>) => void;
}

const WeekCard = ({ data, onChange }: Props) => {
    return (
        <div className="grid grid-cols-[70px_50px_220px_40px_220px] items-center gap-4">
            <p className="font-medium">{data.day}</p>

            <Switch
                checked={data.enabled}
                onCheckedChange={(checked) =>
                    onChange({ enabled: checked })
                }
            />

            {data.enabled ? (
                <>
                    <TimePickerInput
                        value={data.from}
                        onClick={() => { }}
                    />

                    <span className="text-center text-sm">To</span>

                    <TimePickerInput
                        value={data.to}
                        onClick={() => { }}
                    />
                </>
            ) : (
                <div className="flex justify-center col-span-3 text-sm text-gray-400">
                    Closed
                </div>
            )}
        </div>
    );
};

export default WeekCard;