import { Outlet } from "react-router-dom";

const LeadLayout = () => {
    return (
        <div className="flex h-screen">

            <main className="w-full h-[calc(100vh-64px)] overflow-y-scroll  hide-scrollbar">
                {/* <SiteHeader /> */}
                <Outlet />
            </main>
        </div>
    );
};

export { LeadLayout };
