import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { AuthStoreManager, useAuthStore } from "@/stores";
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
  const { pathname } = useLocation();
  const authUser = useAuthStore((state) => state.user);
  const authManager = new AuthStoreManager();

  const visibleItems = items.filter((item) => {
    return show
      ? ["Home", "Dashboard", "Builder", "Chat bot"].includes(item.title)
      : ["Dashboard", "Accounts", "Team"].includes(item.title);
  });

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {visibleItems.map((item) => {
            // Determine if the item is active
            const isActive =
              pathname === item.url ||
              (item.title === "Dashboard" &&
                pathname.startsWith("/dashboard/account")); // ✅ highlight for nested paths

            // Prevent Dashboard link from navigating away when already in nested route
            const handleClick = (e: React.MouseEvent) => {
              if (
                item.title === "Dashboard" &&
                pathname.startsWith("/dashboard/account")
              ) {
                e.preventDefault(); // ✅ prevent redirect
              }

              if (item.title === "Home" && authUser) {
                authManager?.setUser({
                  ...authUser,
                  account: {
                    selectedAccount: null,
                    isAccountSelected: false,
                  },
                });
              }
            };

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton tooltip={item.title} asChild>
                  <Link
                    to={item.url}
                    onClick={handleClick}
                    className={`transition-colors ${
                      isActive ? "bg-accent text-accent-foreground" : ""
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
