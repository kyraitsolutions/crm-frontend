import { Send } from "lucide-react"
import IntegrationCard from "./components/IntegrationCard";


const TelegramData = {
    id: "telegram",
    name: "Telegram for Business",
    icon: Send,
    color: "bg-blue-500",
    buttonColor: "bg-blue-600 hover:bg-blue-700 rounded-xl",
    description:
        "Connect with your customers on Telegram to send messages, automate conversations, and manage support efficiently from a single platform.",
    features: [
        "Send and receive messages via Telegram Bot",
        "Automate replies using bot workflows",
        "Capture leads from Telegram chats",
        "Broadcast messages to subscribers",
        "Manage conversations from a centralized dashboard"
    ],
    resourceText: "Setup Telegram Bot Integration Guide",
    resourceLink: "#"
}
const Telegram = () => {
    return (
        <div>
            <IntegrationCard
                data={TelegramData}
            />
        </div>
    )
}

export default Telegram