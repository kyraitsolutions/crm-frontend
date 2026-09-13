// import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/email/Header";
// import { SiteHeader } from "@/components/site-header";
import { Outlet } from "react-router-dom";

const EmailMarketingLayout = () => {
  return (
    <div className="flex flex-col min-h-0 h-full">
      <Header />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export { EmailMarketingLayout };
