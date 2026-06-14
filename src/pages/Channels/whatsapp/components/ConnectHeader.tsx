import { Button } from "@/components/ui/button";
import { FaWhatsapp } from "react-icons/fa";
import { useWhatsAppStore } from "../store/whatsapp.store";
import Loader from "@/components/Loader";

interface ConnectHeaderProps {
  onConnect: () => void;
}

export default function ConnectHeader({ onConnect }: ConnectHeaderProps) {
  const { connecting } = useWhatsAppStore();
  return (
    <div className="flex flex-col items-center text-center space-y-3 pt-5">
      {/* Logo with glow layers */}
      <div className="relative">
        {/* Outer radial glow */}
        <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(37,211,102,0.35)_0%,rgba(37,211,102,0.12)_50%,transparent_75%)]" />
        {/* Ring border */}
        <div className="absolute -inset-1.5 rounded-full border border-[rgba(37,211,102,0.4)]" />
        {/* Icon circle */}
        <div className="relative z-10 w-20 h-20 rounded-full bg-linear-to-br from-green-500 to-green-600 flex items-center justify-center shadow-[0_0_32px_rgba(37,211,102,0.5),inset_0_0_8px_rgba(37,211,102,0.3)] texw-white">
          <FaWhatsapp size={40} color="#fefefe" />
        </div>
      </div>

      <h1 className="flex flex-col text-3xl font-bold text-gray-600 leading-snug">
        <span className="text-base">Connect WhatsApp</span>
        Business Platform
      </h1>

      <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
        Connect your WhatsApp Business account to start managing conversations,
        broadcasts, templates and automations in one place.
      </p>

      {/* Primary button */}
      <Button
        disabled={connecting}
        onClick={onConnect}
        className={`rounded-xl flex items-center bg-green-600 hover:bg-green-700 ${connecting && "w-14"}`}
      >
        {connecting ? (
          <Loader size={25} className="border-4" />
        ) : (
          <>
            <FaWhatsapp size={30} /> Connect WhatsApp
          </>
        )}
      </Button>
    </div>
  );
}
