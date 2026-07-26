// import { SiteHeader } from "@/components/site-header";
import Header from "@/components/setting/Header";
import { Outlet } from "react-router-dom";

const SettingLayout = () => {
  return (
    <div className="flex">
      {/* <AppSidebar /> */}

      <main className="w-full ">
        {/* <SiteHeader /> */}
        <Header />
        <div className="h-[calc(100vh-64px)] overflow-hidden ">
          <Outlet />

        </div>
      </main>
    </div>
  );
};

export { SettingLayout };
