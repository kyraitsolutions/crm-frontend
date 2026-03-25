// import { AppSidebar } from "@/components/app-sidebar";
// import { SiteHeader } from "@/components/site-header";
import { Outlet } from "react-router-dom";


const TemplateLayout = () => {

   

  return (
    <div className="flex h-screen">
      {/* <AppSidebar /> */}

      <main className="w-full h-screen overflow-y-scroll">
       

        <Outlet />
      </main>
    </div>
  );
};

export { TemplateLayout };
