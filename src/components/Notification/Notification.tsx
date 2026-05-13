import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import NotificationCard from "./NotificationCard";
import NotificationHeader from "./NotificationHeader";
import { NotificationService } from "@/services/notification.service";
import { useAuthStore } from "@/stores";
import { NOTIFICATION_SOCKET_EVENTS } from "@/constants/socketEvent.constatn";
import { useSocketEvent } from "@/websocket/socket.hook";


export interface INotification {
    organizationId: string;
    image?: string;
    type: string;
    typeId: string;
    channelType: string;
    createdAt: string;
    description: string;
    isPriority: boolean;
    isRead: boolean;
    meta: NotificationMeta;
    title?: string;
    updatedAt: string;
    id: string;
}

interface NotificationMeta {
    accountId: string;
    platform: string;
    visitorId: string;
    identifiers: NotificationIdentifiers;
}
interface NotificationIdentifiers {
    chatbotId: string;
}
const Notification = ({ open, setOpen }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>; }) => {

    const notificationService = new NotificationService();
    const { user } = useAuthStore((state) => state);
    const [actionfilter, setActionFilter] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<INotification[]>([]);


    console.log("kjhg", user)

    // const notifications = [
    //     {
    //         id: 1,
    //         image: "https://ai-avatar-generator.com/avatars3/nature.png",
    //         description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
    //         channelType: "whatsapp",
    //         status: "read",
    //         createdAt: "5 weeks ago",
    //     },
    //     {
    //         id: 2,
    //         image: "https://ai-avatar-generator.com/avatars3/nature.png",
    //         description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
    //         channelType: "whatsapp",
    //         status: "read",
    //         createdAt: "5 weeks ago",
    //     },
    //     {
    //         id: 3,
    //         image: "https://ai-avatar-generator.com/avatars3/nature.png",
    //         description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
    //         channelType: "whatsapp",
    //         status: "read",
    //         createdAt: "5 weeks ago",
    //     },
    //     {
    //         id: 4,
    //         image: "https://ai-avatar-generator.com/avatars3/nature.png",
    //         description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
    //         channelType: "whatsapp",
    //         status: "read",
    //         createdAt: "5 weeks ago",
    //     },
    //     {
    //         id: 5,
    //         image: "https://ai-avatar-generator.com/avatars3/nature.png",
    //         description: "Kyra has stopped working on the WhatsApp Business account Test WhatsApp Business Account.",
    //         channelType: "whatsapp",
    //         status: "read",
    //         createdAt: "5 weeks ago",
    //     },
    // ]



    const fetchNotifications = async () => {
        setLoading(true);
        try {

            console.log("Org ID", user?.organization.id)
            const response = await notificationService.getNotifications(String(user?.organization.id));
            if (response.status === 200) {
                console.log(response.data.docs);
                setNotifications(response.data.docs)
            }
        } catch (error) {
            console.error("Error fetching accounts:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);


    useSocketEvent(
        NOTIFICATION_SOCKET_EVENTS?.NOTIFICATION?.NEW_NOTIFICATION,
        useCallback((data) => {
            console.log(data)
        }, [])
    );
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
                    {notifications?.map(notification => {
                        if (!notification.isPriority) return null;
                        return (
                            <NotificationCard key={notification.id} data={notification} />
                        )
                    })}

                    <div>
                        <h1 className="text-md font-semibold mt-2">Others</h1>
                    </div>

                    {notifications?.map(notification => {
                        if (notification.isPriority) return null;
                        return (
                            <NotificationCard key={notification.id} data={notification} />
                        )
                    })}

                </div>
            </div>
            }
        </>


    )
}

export default Notification