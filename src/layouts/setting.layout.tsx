// import { SiteHeader } from "@/components/site-header";
import Header from "@/components/setting/Header";
import { Outlet } from "react-router-dom";

const SettingLayout = () => {
  return (
    <div className="flex">
      {/* <AppSidebar /> */}

      <main className="w-full h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar bg-gray-50">
        {/* <SiteHeader /> */}
        <Header />
        <Outlet />

      </main>
    </div>
  );
};

export { SettingLayout };
