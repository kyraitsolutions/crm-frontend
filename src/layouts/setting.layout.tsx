// import { SiteHeader } from "@/components/site-header";
import Header from "@/components/setting/Header";
import { Outlet } from "react-router-dom";

const SettingLayout = () => {
  return (
    <div className="flex h-screen">
      {/* <AppSidebar /> */}

      <main className="w-full h-screen overflow-y-scroll">
        {/* <SiteHeader /> */}
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export { SettingLayout };
