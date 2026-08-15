import Sidebar from "@/pages/Channels/whatsapp/components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const WhatsappLayout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="w-full h-full overflow-hidden bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
};

export { WhatsappLayout };
