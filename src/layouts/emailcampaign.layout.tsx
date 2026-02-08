import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/email/Header";
import { SiteHeader } from "@/components/site-header";
import { Outlet } from "react-router-dom";

const EmailCampaignLayout = () => {
  return (
    <div className="flex h-screen">
      <AppSidebar />

      <main className="w-full h-screen overflow-y-scroll">
        <SiteHeader />
        <Header />

        <Outlet />
      </main>
    </div>
  );
};

export { EmailCampaignLayout };
