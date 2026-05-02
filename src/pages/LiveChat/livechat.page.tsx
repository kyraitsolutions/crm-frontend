import ChatArea from "./components/ChatArea";
import ChatFilter from "./components/ChatFilter";
import ChatHeader from "./components/ChatHeader";
import Chatlist from "./components/Chatlist";
import ChatMessagebox from "./components/ChatMessagebox";
import ChatProfile from "./components/ChatProfile";

const LiveChat = () => {
    const chatList = [
        {
            id: 1,
            img: "https://ai.nero.com/image/avatar-coverv4/avatar-generator-professional-female-cover.webp",
            name: "John Doe",
            lastMessage: "Hello, I need help with my order.",
            time: "2:30 PM",
            type: "whatsapp"
        },
        {
            id: 2,
            img: "https://ai-avatar-generator.com/avatars3/nature.png",
            name: "Jane Smith",
            lastMessage: "Can you provide more details about your product?",
            time: "1:15 PM",
            type: "whatsapp"
        },
        {
            id: 3,
            img: "https://ai.nero.com/image/avatar-coverv4/avatar-generator-professional-female-cover.webp",
            name: "Bob Johnson",
            lastMessage: "I want to return an item.",
            time: "12:45 PM",
            type: "chatbot"
        },
        {
            id: 4,
            img: "https://ai-avatar-generator.com/avatars3/nature.png",
            name: "John Doe",
            lastMessage: "Hello, I need help with my order.",
            time: "2:30 PM",
            type: "chatbot"
        },
        {
            id: 5,
            img: "https://ai.nero.com/image/avatar-coverv4/avatar-generator-professional-female-cover.webp",
            name: "Jane Smith",
            lastMessage: "Can you provide more details about your product?",
            time: "1:15 PM",
            type: "instagram"
        },
        {
            id: 6,
            img: "https://ai-avatar-generator.com/avatars3/nature.png",
            name: "Bob Johnson",
            lastMessage: "I want to return an item.",
            time: "12:45 PM",
            type: "instagram"
        },
        {
            id: 7,
            img: "https://ai.nero.com/image/avatar-coverv4/avatar-generator-professional-female-cover.webp",
            name: "John Doe",
            lastMessage: "Hello, I need help with my order.",
            time: "2:30 PM",
            type: "whatsapp"
        },
        {
            id: 8,
            img: "https://ai-avatar-generator.com/avatars3/nature.png",
            name: "Jane Smith",
            lastMessage: "Can you provide more details about your product?",
            time: "1:15 PM",
            type: "whatsapp"
        },
        {
            id: 9,
            img: "",
            name: "Bob Johnson",
            lastMessage: "I want to return an item.",
            time: "12:45 PM",
            type: "chatbot"
        },
        {
            id: 10,
            img: "",
            name: "Bob Johnson",
            lastMessage: "I want to return an item.",
            time: "12:45 PM",
            type: "chatbot"
        },
        {
            id: 11,
            img: "",
            name: "Bob Johnson",
            lastMessage: "I want to return an item.",
            time: "12:45 PM",
            type: "chatbot"
        },

    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_6fr_4fr] ">

            <div className="bg-white  w-full overflow-hidden h-full">
                <ChatFilter />

                <div className="h-[calc(100vh-156px)] overflow-y-auto">

                    <Chatlist chatList={chatList} />
                </div>

            </div>

            <div className="bg-gray-100">
                <ChatHeader />
                <ChatArea />
                <ChatMessagebox />
            </div>
            <div className="bg-white p-4 ">
                <ChatProfile />
            </div>
        </div>
    )
}

export default LiveChat