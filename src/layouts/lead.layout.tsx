import { Outlet } from "react-router-dom";

const LeadLayout = () => {
    return (
        <div className="flex">
            <main className="w-full overflow-y-scroll  hide-scrollbar">
                <Outlet />
            </main>
        </div>
    );
};

export { LeadLayout };
