import Sidebar from "@/pages/Channels/whatsapp/components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

const WhatsappLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="w-full h-[calc(100vh-64px)] overflow-hidden bg-gray-50">
        {/* <SiteHeader /> */}
        <Outlet />
      </main>
    </div>
  );
};

export { WhatsappLayout };
