import { Switch } from '@/components/ui/switch';
import { Whatsapp } from '@/icons/icons';
import { Pencil } from 'lucide-react';


interface OptCardProps {
    responseTitle: string;
    responseDescription: string;
    message: string;
    autoResponseEnabled: boolean;
    onToggle: (value: boolean) => void;
    onConfigure: () => void;
}

const MessageConfig = ({
    responseTitle,
    responseDescription,
    message,
    autoResponseEnabled,
    onToggle,
    onConfigure,
}: OptCardProps) => {
    return (
        <div className="rounded-xl bg-white">
            {/* Right */}
            <div className="">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-md ">{responseTitle}</h2>

                        <p className="mt-2 text-gray-500 text-sm">
                            {responseDescription}
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Switch checked={autoResponseEnabled} onCheckedChange={onToggle} />

                        <button
                            onClick={onConfigure}
                            className="flex items-center gap-2 rounded-xl border border-teal-800 px-2 py-1.5 text-xs text-teal-800"
                        >
                            <Pencil size={16} />
                            Configure
                        </button>
                    </div>
                </div>

                <div className="mt-22 flex justify-center">

                    <div className="max-w-60 rounded-[6px]  relative border bg-white  shadow">
                        <div className="absolute -top-2 -left-2">
                            <Whatsapp h="20px" w="20px" />
                        </div>
                        <p className="text-gray-700 text-xs py-2.5 px-4">{message}</p>
                    </div>
                </div>

                <p className="mt-2 text-center text-gray-500 text-sm">
                    Auto response is{" "}
                    <span className="font-medium">
                        {autoResponseEnabled ? "enabled" : "disabled"}
                    </span>
                </p>
            </div>
        </div>
    )
}

export default MessageConfig