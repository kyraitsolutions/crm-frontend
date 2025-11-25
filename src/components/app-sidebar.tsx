import {
  IconCamera,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileText,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconMessageCircle,
  IconReport,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

// import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DASHBOARD_PATH } from "@/constants";
import { useAuthStore } from "@/stores";
import { House } from "lucide-react";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const authUser = useAuthStore((state) => state.user);
  console.log(authUser);

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Home",
        url: DASHBOARD_PATH.ROOT,
        icon: House,
      },

      {
        title: "Dashboard",
        url: DASHBOARD_PATH.ROOT,
        icon: IconDashboard,
      },

      // {
      //   title: "Builder",
      //   url: "/builder",
      //   icon: IconCode,
      // },

      {
        title: "Chat bot",
        url: `${DASHBOARD_PATH.getAccountPath(
          String(authUser?.account?.id)
        )}/chatbot`,
        icon: IconMessageCircle,
      },
      {
        title: "Lead Forms",
        url: `${DASHBOARD_PATH.getAccountPath(
          String(authUser?.account?.id)
        )}/lead-forms`,
        icon: IconFileText,
      },
      {
        title: "Leads Centre",
        url: `${DASHBOARD_PATH.getAccountPath(
          String(authUser?.account?.id)
        )}/leads`,
        icon: IconUsers,
      },
      {
        title: "Team",
        url: "/dashboard/teams",
        icon: IconUsers,
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
        url: "#",
        items: [
          {
            title: "Active Proposals",
            url: "#",
          },
          {
            title: "Archived",
            url: "#",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: IconSettings,
      },
      {
        title: "Feedback",
        url: "#",
        icon: IconHelp,
      },
      // {
      //   title: "Search",
      //   url: "#",
      //   icon: IconSearch,
      // },
    ],
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: IconDatabase,
      },
      {
        name: "Reports",
        url: "#",
        icon: IconReport,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: IconFileWord,
      },
    ],
  };

  const isOrganisationAdmin = authUser?.account?.isAccountSelected || false;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Kyra CRM</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} show={isOrganisationAdmin} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            avatar: authUser?.profilePicture || "",
            name: authUser?.firstName || "",
            email: authUser?.email || "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
