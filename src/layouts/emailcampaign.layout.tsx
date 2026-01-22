import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/email/Header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

const EmailCampaignLayout = () => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="sidebar" />
            <SidebarInset className="flex flex-col h-screen">
                {/* <SiteHeader /> */}
                <Header />
                <main className="flex-1 overflow-auto">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export { EmailCampaignLayout };
