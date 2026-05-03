import { MdWhatsapp } from "react-icons/md";
import IntegrationCard from "./components/IntegrationCard";

export default function Whatsapp() {

    const WhatsappData =
    {
        id: "whatsapp",
        name: "WhatsApp for Business",
        icon: MdWhatsapp,
        color: "bg-green-500",
        buttonColor: "bg-green-600 hover:bg-green-700 text-white rounded-xl",
        description:
            "Connect with your customers on WhatsApp in a simple, reliable and secure way. Converse instantly, deliver notifications and grow your business.",
        features: [
            "Save and reuse messages you frequently send so you can easily answer common questions in no time.",
            "Highlight your products and services and send them as a message,document or image through WhatsApp.",
            "Generate leads from your WhatsApp business account and add them to your sales pipeline.",
            "Make sure your WhatsApp leads never fall through the cracks by associating them with deals, tasks and notes.",
            "When a potential texts your brand through WhatsApp, the sales person can view the message and respond right from the CRM with 360 degree contextual information."
        ],
        resourceText: "Setup WhatsApp Business in CRM",
        resourceLink: "#"
    }

    // const handleWhatsapp = () => {
    //     alert("Redirecting to whatsapp!")
    // }
    return (
        <div className=" mt-5 bg-gray-100 min-h-screen bg-white">
            <IntegrationCard
                data={WhatsappData}
            />
        </div>
    );
}