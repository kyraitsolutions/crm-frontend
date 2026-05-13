import { Chatbot } from "@/icons/icons";
import { Avatar, AvatarImage } from "../ui/avatar";
import { MdOutlinePeopleOutline } from "react-icons/md";
import { TbNotification } from "react-icons/tb";
import { formatDate } from "@/utils/date-utils";
import type { INotification } from "./Notification";

const NotificationCard = ({ data }: { data: INotification }) => {
    return (
        <div className="flex gap-4 items-center mt-4">
            <div className="relative w-12 h-12">

                <Avatar className="h-12 w-12 flex items-center justify-center bg-gray-100">

                    <AvatarImage className="object-cover bg-orange-600 text-white" src={data?.image || ""} />
                    <MdOutlinePeopleOutline size={32} className='text-gray-400' />

                </Avatar>

                <span className="absolute -bottom-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full ring-2 ring-white bg-green-400 z-50">
                    <Chatbot />
                </span>
            </div>
            <div className="w-full flex flex-col gap-1">
                <p className="text-sm text-primary font-semibold">{data.title}</p>
                <p className="text-xs">{data.description}</p>
                <p className="flex text-sm items-center gap-1 text-gray-500"><TbNotification size={18} /> {formatDate(data.createdAt)}</p>
            </div>
        </div>
    )
}

export default NotificationCard