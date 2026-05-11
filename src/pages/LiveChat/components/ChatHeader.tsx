import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { EllipsisVertical, Phone } from "lucide-react";
import { MdOutlinePeopleOutline } from "react-icons/md";

type ChatHeaderProps = {
  name: string;
  img?: string;
  platform:
    | "whatsapp"
    | "instagram"
    | "chatbot"
    | "messenger"
    | "telegram"
    | "email";
};

const ChatHeader = ({ name, img, platform }: ChatHeaderProps) => {
  return (
    <div className="bg-white px-3 py-2 border-l border-r border-gray-200">
      <div className="flex items-center gap-4">
        {img ? (
          <Avatar className="h-12 w-12 flex items-center justify-center bg-gray-100">
            <AvatarImage
              className="object-cover bg-orange-600 text-white"
              src={"https://ai-avatar-generator.com/avatars3/nature.png"}
            />
            <AvatarFallback className="bg-orange-600 text-white">
              {getFirstWordOfSentence("Ahadgf") || "A"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="size-12 bg-gray-100 rounded-full border border-primary/20 flex justify-center items-center shadow">
            <MdOutlinePeopleOutline size={24} className="text-gray-400" />
          </div>
        )}

        <div className="">
          <h1 className="text-lg font-semibold">{name}</h1>
          <p className="text-gray-500 text-sm flex items-center">
            {/* <span className="bg-green-500 rounded-full w-2 h-2 mr-2" /> */}
            {/* <span>Online</span>
            <Dot /> */}
            <span>{platform}</span>
          </p>
        </div>

        <Phone size={18} className="text-gray-500 ml-auto" />
        <EllipsisVertical size={20} className="text-gray-500" />
      </div>
    </div>
  );
};

export default ChatHeader;
