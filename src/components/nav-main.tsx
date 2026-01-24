import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AuthStoreManager, useAuthStore } from "@/stores";

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

interface NavMainProps {
  items: NavItem[];
  show: boolean;
  collapsed?: boolean;
}

export function NavMain({ items, show, collapsed = false }: NavMainProps) {
  const { pathname } = useLocation();
  const { user: authUser } = useAuthStore((state) => state);
  const authManager = new AuthStoreManager();

  const filteredItems = items.filter((item) => {
    if (show) {
      return [
        "Home",
        "Dashboard",
        "Chat bot",
        "Lead Forms",
        "Leads Centre",
        "Email Campaigns",
      ].includes(item.title);
    }

    return ["Home", "Accounts", "Team", "Settings"].includes(item.title);
  });

  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {filteredItems.map((item) => {
        const Icon = item.icon;

        const active =
          pathname.split("/").slice(-1)[0] ===
          item.url?.split("/").slice(-1)[0];

        const handleClick = () => {
          if (item.title === "Home" && authUser) {
            authManager.setUser({
              ...authUser,
              account: {
                ...authUser.account,
                selectedAccount: null,
                isAccountSelected: false,
              },
            });

            authManager.setAccountSelected(false);
            authManager.setAccountName(null);
          }
        };

        return (
          <Link
            key={item.title}
            to={item.url}
            onClick={handleClick}
            className={cn(
              "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
              active
                ? "bg-[#16A34A]/10 text-[#16A34A]"
                : "text-gray-600 hover:bg-gray-100",
            )}
          >
            <Icon size={20} />

            {!collapsed && (
              <span className="inline-block whitespace-nowrap overflow-x-hidden">
                {item.title}
              </span>
            )}

            {active && (
              <span className="absolute right-2 w-1.5 h-6 rounded-full bg-[#16A34A]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// import {
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { AuthStoreManager, useAuthStore } from "@/stores";
// import type { ComponentType, SVGProps } from "react";
// import { Link, useLocation } from "react-router-dom";

// export function NavMain({
//   items,
//   show,
// }: {
//   items: {
//     title: string;
//     url: string;
//     icon: ComponentType<SVGProps<SVGSVGElement>>;
//   }[];
//   show: boolean;
// }) {
//   const { pathname } = useLocation();
//   const { user: authUser } = useAuthStore((state) => state);
//   const authManager = new AuthStoreManager();

//   const visibleItems = items.filter((item) => {
//     return show
//       ? [
//           "Home",
//           "Dashboard",
//           "Chat bot",
//           "Lead Forms",
//           "Leads Centre",
//           "Email Campaigns",
//         ].includes(item.title)
//       : ["Home", "Accounts", "Team", "Settings"].includes(item.title);
//   });

//   return (
//     <SidebarGroup>
//       <SidebarGroupContent className="flex flex-col gap-2">
//         <SidebarMenu>
//           {visibleItems.map((item) => {
//             // Determine if the item is active
//             const isActive =
//               pathname.split("/").slice(-1)[0] ===
//               item.url?.split("/").slice(-1)[0];
//             // (item.title === "Dashboard" && !pathname.includes("/chatbot")); // ✅ highlight for nested paths

//             // Prevent Dashboard link from navigating away when already in nested route
//             const handleClick = () => {
//               if (
//                 item.title === "Dashboard" &&
//                 pathname.startsWith("/dashboard/account")
//               ) {
//                 // e.preventDefault(); // ✅ prevent redirect
//               }

//               if (item.title === "Home" && authUser) {
//                 authManager?.setUser({
//                   ...authUser,
//                   account: {
//                     ...authUser.account,
//                     selectedAccount: null,
//                     isAccountSelected: false,
//                   },
//                 });

//                 authManager.setAccountSelected(false);
//               }
//             };

//             return (
//               <SidebarMenuItem key={item.title}>
//                 <SidebarMenuButton tooltip={item.title} asChild>
//                   <Link
//                     to={item.url}
//                     onClick={handleClick}
//                     className={`transition-colors hover:bg-red-900 ${
//                       isActive ? "bg-primary/10 text-primary" : ""
//                     }`}
//                   >
//                     {item.icon && <item.icon />}
//                     <span>{item.title}</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             );
//           })}
//         </SidebarMenu>
//       </SidebarGroupContent>
//     </SidebarGroup>
//   );
// }
