import { FaFacebook } from "react-icons/fa"
import IntegrationCard from "./components/IntegrationCard"

const FacebookData = {
    id: "facebook",
    name: "Facebook for Business",
    icon: FaFacebook,
    color: "bg-blue-500",
    buttonColor: "bg-blue-600 hover:bg-blue-700 rounded-xl",
    description:
        "Connect with your customers on Facebook to send messages, automate conversations, and manage support efficiently from a single platform.",
    features: [
        "Send and receive messages via Facebook Bot",
        "Automate replies using bot workflows",
        "Capture leads from Facebook chats",
        "Broadcast messages to subscribers",
        "Manage conversations from a centralized dashboard"
    ],
    resourceText: "Setup Facebook Bot Integration Guide",
    resourceLink: "#"
}
const Facebook = () => {
    return (
        <div>
            <IntegrationCard
                data={FacebookData}
            />
        </div>
    )
}

export default Facebook