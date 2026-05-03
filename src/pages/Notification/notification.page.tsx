import { Switch } from "@/components/ui/switch";
import { MdWhatsapp } from "react-icons/md";
import {
    UserPlus,
    MessageCircle,
    Bot,
    AlertTriangle,
    Send,
} from "lucide-react";

const Notification = () => {


    const notificationConfigData = [
        {
            id: 1,
            title: "New lead",
            description:
                "Get notified whenever a new lead is created from any source like website forms, chatbot, ads, or integrations.",
            icon: UserPlus,
            status: true,
        },
        {
            id: 2,
            title: "Direct messages",
            description:
                "Receive alerts when a user sends you a direct message across connected channels so you can respond quickly.",
            icon: MessageCircle,
            status: true,
        },
        {
            id: 3,
            title: "Chatbot",
            description:
                "Stay updated on chatbot activities including new conversations, user replies, and bot interactions.",
            icon: Bot,
            status: false,
        },
        {
            id: 4,
            title: "System alerts",
            description:
                "Get important system-level notifications such as errors, integration issues, or critical updates affecting your account.",
            icon: AlertTriangle,
            status: true,
        },
        {
            id: 5,
            title: "Communication",
            description:
                "Receive all notifications related to communication channels like WhatsApp, Instagram, chatbot messages, and other user interactions.",
            icon: Send,
            status: false,
        },
    ];
    return (
        <div className="bg-linear-to-b from-green-50 to-orange-50 h-screen py-10">

            <div className="max-w-4xl mx-auto bg-white p-4 flex flex-col gap-2 border rounded">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-gray-700 font-semibold text-md">Email notifications</h1>
                        <p className="text-gray-500 text-sm">Email notifications are sent to your registered email address</p>
                    </div>
                    <div>
                        <Switch
                            disabled={false}
                            checked={true}
                            className="cursor-pointer"
                        // onClick={(e) => handleUpdateStatus(e, row.id)}
                        />
                    </div>
                </div>
                <p className="text-gray-500 mt-2">Notify me about...</p>
                <div className="space-y-4 mt-2">
                    {notificationConfigData.map((item) => (
                        <NotificationConfigCard key={item.id} {...item} />
                    ))}
                </div>

            </div>
        </div>

    )
}

export default Notification


interface NotificationConfigProps {
    title: string;
    description: string;
    status: boolean;
    icon: any
}
const NotificationConfigCard = ({ title, description, status, icon }: NotificationConfigProps) => {
    const Icon: any = icon;
    const color = {
        "New lead": "bg-violet-500",
        "Direct messages": "bg-primary",
        "Chatbot": "bg-second",
        "System alerts": "bg-blue-600",
        "Communication": "bg-pink-600"
    }
    return (
        <div className="flex items-center justify-between bg-v">
            <div className="flex items-center gap-5">
                <div className={` ${color[title]} p-3 text-white rounded`}>
                    <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-md font-semibold">{title}</h1>
                    <p className="text-sm text-gray-500">{description}</p>
                </div>
            </div>
            <div>
                <Switch
                    disabled={false}
                    checked={status}
                    className="cursor-pointer"
                // onClick={(e) => handleUpdateStatus(e, row.id)}
                />
            </div>
        </div>
    )
}