import CallSidebar from "@/pages/SalesAgent/components/CallSidebar";
import { Outlet } from "react-router-dom";

const CallLayout = () => {
    return (
        <div className="flex h-screen">
            <CallSidebar />

            <main className="w-full h-[calc(100vh-64px)] overflow-y-scroll ">
                {/* <SiteHeader /> */}
                <Outlet />
            </main>
        </div>
    );
};

export { CallLayout };
