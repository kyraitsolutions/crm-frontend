import { Separator } from "@radix-ui/react-separator"
import { SidebarTrigger } from "../ui/sidebar"
import { NavLink } from "react-router-dom";

import { Plus } from "lucide-react";
import { Button } from "../ui/button";
const Header = () => {

    const NAV_ITEMS = [
        { label: "Dashboard", path: "" },
        { label: "Subscribers", path: "subscribers" },
        { label: "Campaigns", path: "campaigns" },
        { label: "Templates", path: "templates" },
        { label: "Automations", path: "automations" },
    ];

    return (
        <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
            <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                    orientation="vertical"
                    className="mx-2 data-[orientation=vertical]:h-4"
                />
                <div className="flex items-center gap-5">
                    {NAV_ITEMS.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors 
                            ${isActive
                                    ? "text-primary border-b-2 border-primary"
                                    : "text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border"}`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>


                <div className="ml-auto flex items-center gap-2">
                    <Button className=""><Plus size={20} color="#ffffff" /> Create New Campaign</Button>
                </div>
            </div>
        </header>
    )
}

export default Header
