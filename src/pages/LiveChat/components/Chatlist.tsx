import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Chatbot, Instagram } from '@/icons/icons';
import { getFirstWordOfSentence } from '@/utils/typography.utils';
import { useState } from 'react';
import { MdChatBubble, MdOutlinePeopleOutline } from 'react-icons/md';

interface ChatListProps {
    chatList: {
        id: number;
        img: string;
        name: string;
        lastMessage: string;
        time: string;
        type: string;
    }[];
}
const Chatlist = ({ chatList }: ChatListProps) => {
    const [activeChat, setActiveChat] = useState<number | null>(null);
    return (
        <>
            {chatList.map((chat) => (
                <div key={chat.id} onClick={() => setActiveChat(chat.id)} className={` ${activeChat === chat.id ? 'bg-primary/10' : ''}  hover:bg-primary/10 cursor-pointer group flex items-center w-full! py-4 px-4`}>
                    <div className="relative">

                        <Avatar className="h-12 w-12 flex items-center justify-center bg-gray-100">
                            {chat.img ? (
                                <AvatarImage className="object-cover bg-orange-600 text-white" src={chat.img} />
                            ) : <MdOutlinePeopleOutline size={32} className='text-gray-400' />
                            }
                            {/* <AvatarFallback className="bg-orange-600 text-white">
                                {getFirstWordOfSentence(chat.name || "") || "A"}
                            </AvatarFallback> */}
                        </Avatar>

                        <span className="absolute -bottom-2 -right-2 h-6 w-6 flex items-center justify-center rounded-full ring-2 ring-white bg-green-400 z-50">
                            {chat.type === "chatbot" ? <Chatbot /> : chat.type === "instagram" ?
                                <Instagram />
                                : chat.type === "whatsapp" ? <MdChatBubble size={14} color='#ffffff' /> : null}
                        </span>
                    </div>

                    <div className="ml-3 w-full">
                        <div className="flex items-center gap-2 justify-between">
                            <h3 className={`${activeChat === chat.id ? 'font-semibold' : 'font-medium'} group-active:font-semibold md:group-hover:font-semibold duration-75 transition-all ease-linear text-gray-900`}>{chat.name}</h3>
                            <span className="text-sm font-normal text-gray-400">{chat.time}</span>
                        </div>


                        <p className="text-sm font-medium text-gray-500">{chat.lastMessage.substring(0, 25)}...</p>
                    </div>
                </div>
            ))}
        </>
    )
}

export default Chatlist