import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Props {
    value: string;
    onChange: (value: string) => void;
}

const TimezoneSelect = ({ value, onChange }: Props) => {
    return (
        <div className="w-full flex items-center gap-6">
            <label className="text-sm">Timezone</label>

            <Select value={value} onValueChange={onChange} >
                <SelectTrigger className="w-full rounded-xl shadow-none max-w-lg">
                    <SelectValue />
                </SelectTrigger>

                <SelectContent className="shadow-none rounded-xl">
                    <SelectItem className="rounded-xl" value="Asia/Kolkata (+05:30)">
                        Asia/Kolkata (+05:30)
                    </SelectItem>

                    <SelectItem className="rounded-xl" value="Europe/London">
                        Europe/London
                    </SelectItem>

                    <SelectItem className="rounded-xl" value="America/New_York">
                        America/New York
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default TimezoneSelect;