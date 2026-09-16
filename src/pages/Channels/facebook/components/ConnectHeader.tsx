import { Button } from "@/components/ui/button";
import { FaFacebook } from "react-icons/fa";
import { useMetaStore } from "../store/meta.store";
import Loader from "@/components/Loader";

interface ConnectHeaderProps {
  onConnect: () => void;
}

export default function ConnectHeader({ onConnect }: ConnectHeaderProps) {
  const { connecting } = useMetaStore();

  return (
    <div className="flex flex-col items-center text-center space-y-3 pt-5">
      <div className="relative">
        <div className="absolute -inset-4 rounded-full bg-[radial-gradient(circle,rgba(24,119,242,0.35)_0%,rgba(24,119,242,0.12)_50%,transparent_75%)]" />
        <div className="absolute -inset-1.5 rounded-full border border-[rgba(24,119,242,0.4)]" />
        <div className="relative z-10 w-20 h-20 rounded-full bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_32px_rgba(24,119,242,0.5),inset_0_0_8px_rgba(24,119,242,0.3)]">
          <FaFacebook size={40} color="#fefefe" />
        </div>
      </div>

      <h1 className="flex flex-col text-3xl font-semibold text-gray-600 leading-snug">
        Facebook for Business
      </h1>

      <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
        Connect your Facebook Page to capture leads, manage conversations, and
        sync your Instagram professional account from one place.
      </p>

      <Button
        disabled={connecting}
        onClick={onConnect}
        className={`rounded-2xl flex items-center bg-blue-600 hover:bg-blue-700 ${connecting && "w-14"}`}
      >
        {connecting ? (
          <Loader size={25} className="border-4" />
        ) : (
          <>
            <FaFacebook size={30} /> Connect Facebook
          </>
        )}
      </Button>
    </div>
  );
}
