import WhatsappMarketingHeader from "@/pages/WhatsappMarketing/components/WhatsappMarketingHeader";
import { Outlet } from "react-router-dom";

const WhatsappMarketingLayout = () => {
  return (
    <div className="flex flex-col min-h-0 h-full">
      <WhatsappMarketingHeader />
      <div className="flex-1 min-h-0 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export { WhatsappMarketingLayout };
