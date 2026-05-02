import { useState, type Dispatch, type SetStateAction } from "react";
import NotificationCard from "./NotificationCard";
import NotificationHeader from "./NotificationHeader";

const Notification = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>; }) => {
    const [actionfilter, setActionFilter] = useState(false);

    const notifications = [
        {
            id: 1,
            image: "https://ai-avatar-generator.com/avatars3/nature.png",
            description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
            channelType: "whatsapp",
            status: "read",
            createdAt: "5 weeks ago",
        },
        {
            id: 2,
            image: "https://ai-avatar-generator.com/avatars3/nature.png",
            description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
            channelType: "whatsapp",
            status: "read",
            createdAt: "5 weeks ago",
        },
        {
            id: 3,
            image: "https://ai-avatar-generator.com/avatars3/nature.png",
            description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
            channelType: "whatsapp",
            status: "read",
            createdAt: "5 weeks ago",
        },
        {
            id: 4,
            image: "https://ai-avatar-generator.com/avatars3/nature.png",
            description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
            channelType: "whatsapp",
            status: "read",
            createdAt: "5 weeks ago",
        },
        {
            id: 5,
            image: "https://ai-avatar-generator.com/avatars3/nature.png",
            description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
            channelType: "whatsapp",
            status: "read",
            createdAt: "5 weeks ago",
        },
    ]
    return (
        <>
            {open && <div onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
            }} className="absolute h-screen w-screen bg-black/40 top-0 right-0 z-10 flex justify- ">
                <div className="bg-linear-to-b from-green-50 to-orange-50 w-100 h-full px-4 overflow-y-scroll hide-scrollbar">

                    <div className="">
                        <NotificationHeader />
                    </div>

                    <div>
                        <h1 className="text-md font-semibold mt-2">High priority</h1>
                    </div>
                    {notifications.map(notification => (
                        <NotificationCard key={notification.id} {...notification} />
                    ))}

                    <div>
                        <h1 className="text-md font-semibold mt-2">Others</h1>
                    </div>

                    {notifications.map(notification => (
                        <NotificationCard key={notification.id} {...notification} />
                    ))}

                </div>
            </div>
            }
        </>


    )
}

export default Notification