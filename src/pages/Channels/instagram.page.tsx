import { FaInstagram } from "react-icons/fa";
import IntegrationCard from './components/IntegrationCard';

const InstagramData =
{
    id: "instagram",
    name: "Instagram for Business",
    icon: FaInstagram,
    color: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500",
    buttonColor: "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-xl text-white",
    description:
        "Connect with your audience on Instagram seamlessly. Manage DMs, automate replies and grow your brand engagement.",
    features: [
        "Manage Instagram DMs from one dashboard",
        "Capture and store leads automatically",
        "Automate replies using templates",
        "Assign conversations to team members",
        "Track engagement and customer insights"
    ],
    resourceText: "Setup Instagram Integration Guide",
    resourceLink: "#"
}
const Instagram = () => {
    return (
        <IntegrationCard
            data={InstagramData}
        />
    )
}

export default Instagram