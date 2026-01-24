import { COOKIES_STORAGE, DASHBOARD_PATH } from "@/constants";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDashboard,
  IconFileText,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";
import { House } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { NavMain } from "./nav-main";

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user: authUser, accountSelected } = useAuthStore((state) => state);

  const data = {
    navMain: [
      {
        title: "Home",
        url: DASHBOARD_PATH.ROOT,
        icon: House,
      },

      {
        title: "Dashboard",
        url: DASHBOARD_PATH.getAccountPath(
          String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
        ),

        icon: IconDashboard,
      },

      // {
      //   title: "Builder",
      //   url: "/builder",
      //   icon: IconCode,
      // },
      {
        title: "Leads Centre",
        url: `${DASHBOARD_PATH.getAccountPath(
          String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
        )}/leads`,
        icon: IconUsers,
      },
      {
        title: "Chat bot",
        url: `${DASHBOARD_PATH.getAccountPath(
          String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
        )}/chatbot`,
        icon: IconMessageCircle,
      },
      {
        title: "Lead Forms",
        url: `${DASHBOARD_PATH.getAccountPath(
          String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
        )}/lead-forms`,
        icon: IconFileText,
      },
      {
        title: "Email Campaigns",
        url: `${DASHBOARD_PATH.getAccountPath(
          String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
        )}/email-campaigns`,
        icon: IconFileText,
      },

      {
        title: "Team",
        url: "/dashboard/teams",
        icon: IconUsers,
      },
    ],
  };

  return (
    <aside
      className={cn(
        "h-screen bg-gray-50 border-r flex flex-col transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[280px]",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b">
        {!collapsed && (
          <span
            className={`font-semibold  text-lg text-[#16A34A] whitespace-nowrap overflow-x-hidden`}
          >
            Kyra AI CRM
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg bg-gray-100 cursor-pointer "
        >
          {collapsed ? (
            <IconChevronRight size={18} />
          ) : (
            <IconChevronLeft size={18} />
          )}
        </button>
      </div>

      {/* ✅ SAME API AS BEFORE */}
      <NavMain
        items={data.navMain as any}
        show={accountSelected}
        collapsed={collapsed}
      />

      {/* Upgrade */}
      <div className="px-3 py-3">
        <Link
          to="/dashboard/subscription"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white bg-[#16A34A] hover:bg-[#15803D] "
        >
          <span className="text-lg">⚡</span>
          {!collapsed && (
            <span className="inline-block whitespace-nowrap overflow-x-hidden">
              Upgrade to Premium
            </span>
          )}
        </Link>
      </div>

      {/* User */}
      <div className="border-t px-3 py-4 flex items-center gap-3">
        <img
          src={authUser?.profilePicture || "/avatar.png"}
          className="w-9 h-9 rounded-full object-cover"
        />
        {!collapsed && (
          <div className="text-sm">
            <p className="font-medium">{authUser?.firstName}</p>
            <p className="text-gray-500 text-xs">{authUser?.email}</p>
          </div>
        )}
      </div>
    </aside>
  );
}

// import {
//   IconCamera,
//   IconDashboard,
//   IconDatabase,
//   IconFileAi,
//   IconFileDescription,
//   IconFileText,
//   IconFileWord,
//   IconInnerShadowTop,
//   IconMessageCircle,
//   IconReport,
//   IconSearch,
//   IconUsers,
// } from "@tabler/icons-react";
// import * as React from "react";

// // import { NavDocuments } from "@/components/nav-documents";
// import { NavMain } from "@/components/nav-main";
// import { NavSecondary } from "@/components/nav-secondary";
// import { NavUser } from "@/components/nav-user";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { COOKIES_STORAGE, DASHBOARD_PATH } from "@/constants";
// import { useAuthStore } from "@/stores";
// import { CookieUtils } from "@/utils/cookie-storage.utils";
// import { House } from "lucide-react";
// import { Link } from "react-router-dom";

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { user: authUser, accountSelected } = useAuthStore((state) => state);
//   // console.log(authUser)
//   const data = {
//     user: {
//       name: "shadcn",
//       email: "m@example.com",
//       avatar: "/avatars/shadcn.jpg",
//     },
//     navMain: [
//       {
//         title: "Home",
//         url: DASHBOARD_PATH.ROOT,
//         icon: House,
//       },

//       {
//         title: "Dashboard",
//         url: DASHBOARD_PATH.getAccountPath(
//           String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
//         ),

//         icon: IconDashboard,
//       },

//       // {
//       //   title: "Builder",
//       //   url: "/builder",
//       //   icon: IconCode,
//       // },
//       {
//         title: "Leads Centre",
//         url: `${DASHBOARD_PATH.getAccountPath(
//           String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
//         )}/leads`,
//         icon: IconUsers,
//       },
//       {
//         title: "Chat bot",
//         url: `${DASHBOARD_PATH.getAccountPath(
//           String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
//         )}/chatbot`,
//         icon: IconMessageCircle,
//       },
//       {
//         title: "Lead Forms",
//         url: `${DASHBOARD_PATH.getAccountPath(
//           String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
//         )}/lead-forms`,
//         icon: IconFileText,
//       },
//       {
//         title: "Email Campaigns",
//         url: `${DASHBOARD_PATH.getAccountPath(
//           String(CookieUtils.getItem(COOKIES_STORAGE.accountId)),
//         )}/email-campaigns`,
//         icon: IconFileText,
//       },

//       {
//         title: "Team",
//         url: "/dashboard/teams",
//         icon: IconUsers,
//       },
//     ],
//     navClouds: [
//       {
//         title: "Capture",
//         icon: IconCamera,
//         isActive: true,
//         url: "#",
//         items: [
//           {
//             title: "Active Proposals",
//             url: "#",
//           },
//           {
//             title: "Archived",
//             url: "#",
//           },
//         ],
//       },
//       {
//         title: "Proposal",
//         icon: IconFileDescription,
//         url: "#",
//         items: [
//           {
//             title: "Active Proposals",
//             url: "#",
//           },
//           {
//             title: "Archived",
//             url: "#",
//           },
//         ],
//       },
//       {
//         title: "Prompts",
//         icon: IconFileAi,
//         url: "#",
//         items: [
//           {
//             title: "Active Proposals",
//             url: "#",
//           },
//           {
//             title: "Archived",
//             url: "#",
//           },
//         ],
//       },
//     ],
//     navSecondary: [
//       // {
//       //   title: "Settings",
//       //   url: "/dashboard/settings",
//       //   icon: IconSettings,
//       // },
//       // {
//       //   title: "Feedback",
//       //   url: "#",
//       //   icon: IconHelp,
//       // },
//       {
//         title: "Upgrade to premium",
//         url: "/dashboard/subscription",
//         icon: IconSearch,
//       },
//     ],
//     documents: [
//       {
//         name: "Data Library",
//         url: "#",
//         icon: IconDatabase,
//       },
//       {
//         name: "Reports",
//         url: "#",
//         icon: IconReport,
//       },
//       {
//         name: "Word Assistant",
//         url: "#",
//         icon: IconFileWord,
//       },
//     ],
//   };

//   return (
//     <Sidebar collapsible="icon" {...props} side="left">
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:!p-1.5"
//             >
//               <Link to="/">
//                 <IconInnerShadowTop className="!size-5 text-primary" />
//                 <span className="text-base font-semibold">Kyra AI CRM</span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain as any} show={accountSelected} />
//         {/* <NavDocuments items={data.documents} /> */}
//         <NavSecondary items={data.navSecondary} className="mt-auto" />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser
//           user={{
//             avatar: authUser?.profilePicture || "",
//             name: authUser?.firstName || "",
//             email: authUser?.email || "",
//           }}
//         />
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
