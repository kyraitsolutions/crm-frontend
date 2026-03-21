import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { DASHBOARD_PATH } from "@/constants";
import { useAuthStore } from "@/stores";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { accountId, lastSlug } = useAuthStore((state) => state);
  const navigate = useNavigate();

  useEffect(() => {
    if (accountId) {
      if (lastSlug) {
        navigate(`${DASHBOARD_PATH.getAccountPath(accountId)}/${lastSlug}`);
        return;
      }
      navigate(DASHBOARD_PATH.getAccountPath(accountId));
    }
  }, []);
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

export { DashboardLayout };

//  <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "calc(var(--spacing) * 72)",
//           "--header-height": "calc(var(--spacing) * 12)",
//         } as React.CSSProperties
//       }
//     >
//       <AppSidebar />
//       <SidebarInset className="flex flex-col">
//         <SiteHeader />
//         <main className="w-full h-screen">
//           <Outlet />
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
