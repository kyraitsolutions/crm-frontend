import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getFirstWordOfSentence } from "@/utils/typography.utils"

const ChatArea = () => {
    const messages = [
        {
            id: 1,
            text: "Hi there! I have a question about your product.",
            time: "10:00 AM",
            sender: "customer"
        },
        {
            id: 2,
            text: "Sure! I'd be happy to help. What would you like to know?",
            time: "10:02 AM",
            sender: "agent"
        },
        {
            id: 3,
            text: "Can you provide more details about your product?",
            time: "10:05 AM",
            sender: "customer"
        },
        {
            id: 4,
            text: "Can you provide more details about your product?",
            time: "10:05 AM",
            sender: "agent"
        },
        {
            id: 5,
            text: "Can you provide more details about your product?",
            time: "10:05 AM",
            sender: "customer"
        },
        {
            id: 6,
            text: "Can you provide more details about your product?",
            time: "10:05 AM",
            sender: "agent"
        },
        {
            id: 7,
            text: "Can you provide more details about your product?",
            time: "10:05 AM",
            sender: "agent"
        },
        {
            id: 8,
            text: "Can you provide more details about your product?",
            time: "10:05 AM",
            sender: "customer"
        },
        {
            id: 9,
            text: "Can you provide more details about your product?",
            time: "10:05 AM",
            sender: "customer"
        },
        {
            id: 10,
            text: "Can you provide more details about your product?",
            time: "10:05 AM",
            sender: "agent"
        },
    ]
    return (
        <div className="h-[calc(100vh-156px)] overflow-y-auto p-4">
            <div className="flex flex-col gap-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === "customer" ? "items-start " : ""
                            } gap-3 ${message.sender === "customer" ? "" : "justify-end"}`}
                    >
                        <Avatar className={`${message.sender === "customer" ? "" : "order-2"} h-10 w-10 flex items-center justify-center bg-gray-100`}>
                            <AvatarImage className="object-cover bg-orange-600 text-white" src={"https://ai-avatar-generator.com/avatars3/nature.png"} />
                            <AvatarFallback className="bg-orange-600 text-white">
                                {getFirstWordOfSentence("Ahadgf") || "A"}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div
                                className={`px-3 py-2 text-sm max-w-xs rounded-2xl! ${message.sender === "customer"
                                    ? "bg-white text-gray-700 border border-gray-300 shadow-sm rounded-tl-none!"
                                    : "bg-primary text-white shadow-sm rounded-tr-none!"
                                    }`}
                            >
                                <p>{message.text}</p>

                            </div>
                            <span
                                className={`flex text-xs ${message.sender === "customer" ? "text-gray-500" : "text-gray-500 justify-end"
                                    } mt-1`}
                            >
                                {message.time}
                            </span>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default ChatArea