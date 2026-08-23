import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { EllipsisVertical, Phone } from "lucide-react";
import { MdOutlinePeopleOutline } from "react-icons/md";
import ChatTags from "./Tags";

type ChatHeaderProps = {
  name: string;
  img?: string;
  platform?:
    | "whatsapp"
    | "instagram"
    | "chatbot"
    | "messenger"
    | "telegram"
    | "email";
};

const ChatHeader = ({ name, img }: ChatHeaderProps) => {
  return (
    <div className="bg-white px-3 py-2 drop-shadow-xs border-gray-200 relative">
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
          <div className="size-12 bg-primary/10 rounded-full flex justify-center items-center shadow">
            <MdOutlinePeopleOutline size={24} className="text-primary" />
          </div>
        )}

        <div className="relative">
          <h1 className="text-sm font-semibold">
            {name}
            {/* <span>{platform}</span> */}
          </h1>
          <ChatTags />
        </div>

        <Phone size={18} className="text-gray-500 ml-auto" />
        <EllipsisVertical size={20} className="text-gray-500" />
      </div>
    </div>
  );
};

export default ChatHeader;

// {
//       "id": "1187884421075503",
//       "name": "Fort Chandragupt, Jaipur",
//       "access_token": "EAALT8SAnyZAgBSFz9VCZCxgyqZCEspTukEZABzpfhbycaVIidwv7ZApdDTvor5iKCb1ZBqZCEH5XXttlZB1B5CtXlIbL68dBcQbokcFWhGQHrzUk5Pv63vNY5uB3zN7wGNGcnTCtTZBA61sF1DnhErWZCyuUZCU8nEJwZCq9b97Fy4WHa0fvfWBJKnn7Aspn65PlvIAlku6B",
//       "category": "Hotel",
//       "picture": {
//         "data": {
//           "height": 50,
//           "is_silhouette": false,
//           "url": "https://scontent-den2-1.xx.fbcdn.net/v/t39.30808-1/734685156_122095668891391065_8092299469902230741_n.jpg?stp=c137.0.550.550a_cp0_dst-jpg_s50x50_tt6&_nc_cat=106&ccb=1-7&_nc_sid=f907e8&_nc_ohc=3oZ7pjBiU9UQ7kNvwGmaq1G&_nc_oc=AdpTO5iO0l7OfaEukxx8E3RSfgWsMXSqTtyjwMb87PbhKLrlJbM-1zEL20Qia0XUlsw&_nc_zt=24&_nc_ht=scontent-den2-1.xx&edm=AJdBtusEAAAA&_nc_gid=7liKy24JsQIHxFzI-BJ4fw&_nc_tpa=Q5bMBQGPBxlnISrXcB0pONyZ28wsnTq4n0KoAskc1oFVdTy19_ciw4qzBdmJTdKIfkF5EcpNFlNNWCTI&oh=00_AQH0E4ggdXWi8_aetmjGcVUdmGsLD0MYTOOjEu4uqkuCSA&oe=6A765B37",
//           "width": 50
//         }
//       },
//       "_id": {
//         "$oid": "6a7077187ab59bdf315977e2"
//       }
//     },
