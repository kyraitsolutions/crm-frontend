import { AppSidebar } from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";

const ChatBotLayout = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />

      <main className="w-full h-screen overflow-y-scroll">
        <SiteHeader />
        <Outlet />
      </main>
    </div>
  );
};

export { ChatBotLayout };
