import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { COOKIES_STORAGE } from "@/constants";
import { AuthStoreManager, useAuthStore } from "@/stores";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import type { Icon } from "@tabler/icons-react";
import { Link, useLocation } from "react-router-dom";

export function NavMain({
  items,
  show,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
  show: boolean;
}) {
  console.log(show);
  const { pathname } = useLocation();
  const { user: authUser } = useAuthStore((state) => state);
  const authManager = new AuthStoreManager();

  const visibleItems = items.filter((item) => {
    return show
      ? [
        "Home",
        "Dashboard",
        "Chat bot",
        "Lead Forms",
        "Leads Centre",
      ].includes(item.title)
      : ["Home", "Accounts", "Team"].includes(item.title);
  });

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {visibleItems.map((item) => {
            // Determine if the item is active
            const isActive =
              pathname === item.url ||
              (item.title === "Dashboard" && !pathname.includes("/chatbot")); // ✅ highlight for nested paths

            // Prevent Dashboard link from navigating away when already in nested route
            const handleClick = (e: React.MouseEvent) => {
              if (
                item.title === "Dashboard" &&
                pathname.startsWith("/dashboard/account")
              ) {
                // e.preventDefault(); // ✅ prevent redirect
              }

              if (item.title === "Home" && authUser) {
                authManager?.setUser({
                  ...authUser,
                  account: {
                    ...authUser.account,
                    selectedAccount: null,
                    isAccountSelected: false,
                  },
                });

                authManager.setAccountSelected(false);
              }
            };

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link
                    to={item.url}
                    onClick={handleClick}
                    className={`transition-colors ${isActive ? "bg-accent text-accent-foreground" : ""
                      }`}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
