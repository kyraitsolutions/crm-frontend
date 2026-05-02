import { cn } from "@/lib/utils";
import { AuthStoreManager, useAuthStore } from "@/stores";
import { useAccountsStore } from "@/stores/accounts.store";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDashboard,
  IconFileText,
  IconMessageCircle,
  IconUsers,
} from "@tabler/icons-react";
import { BookTemplateIcon } from "lucide-react";
import { useState } from "react";
import {
  MdEmail,
  MdOutlineCampaign,
  MdOutlineContacts,
  MdWhatsapp,
} from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AccountSwitcher } from "./accountSwitcher/AccountSwitcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarFooter } from "./ui/sidebar";
import { hasPermission, PERMISSIONS } from "@/rbac";
import { useAccountAccessStore } from "@/stores/account-access.store";
import { ACCOUNT_PATHS } from "@/constants/routes";

export function AppSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { accounts } = useAccountsStore((state) => state);
  const authManager = new AuthStoreManager();

  const { user: authUser, accountId } = useAuthStore((state) => state);
  const { permissions } = useAccountAccessStore((state) => state);

  const handleAccountSwitch = (accountId: string) => {
    const pathName = window.location.pathname;
    authManager.setLastSlugPath(pathName);
    authManager.setAccountId(accountId);
    navigate(ACCOUNT_PATHS.byId(accountId));
  };

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: ACCOUNT_PATHS.byId(String(accountId)),
        active: true,
        icon: IconDashboard,
      },
      {
        title: "Live Chat",
        url: `${ACCOUNT_PATHS.byId(String(accountId))}/live-chat`,
        active: true,
        icon: IconDashboard,
      },

      {
        title: "Leads Centre",
        url: `${ACCOUNT_PATHS.byId(String(accountId))}/leads`,
        icon: IconUsers,
        active: hasPermission(permissions, PERMISSIONS.LEADS.VIEW),
      },
      {
        title: "Chat bot",
        url: `${ACCOUNT_PATHS.byId(String(accountId))}/chatbot`,
        icon: IconMessageCircle,
        active: hasPermission(permissions, PERMISSIONS.CHATBOTS.VIEW),
      },
      {
        title: "Lead Forms",
        url: `${ACCOUNT_PATHS.byId(String(accountId))}/lead-forms`,
        icon: IconFileText,
        active: hasPermission(permissions, PERMISSIONS.LEADS_FORMS.VIEW),
      },
      {
        title: "Broadcast",
        url: `${ACCOUNT_PATHS.byId(String(accountId))}/broadcast`,
        icon: MdOutlineCampaign,
        active: true,
        children: [
          {
            title: "Email",
            url: `${ACCOUNT_PATHS.byId(String(accountId))}/broadcast/email`,
            icon: MdEmail,
          },
          {
            title: "WhatsApp",
            url: `${ACCOUNT_PATHS.byId(String(accountId))}/broadcast/whatsapp`,
            icon: MdWhatsapp,
          },
          {
            title: "Templates",
            url: `${ACCOUNT_PATHS.byId(String(accountId))}/broadcast/templates`,
            icon: BookTemplateIcon,
          },
        ],
      },
      {
        title: "Contacts",
        url: `${ACCOUNT_PATHS.byId(String(accountId))}/contacts`,
        icon: MdOutlineContacts,
        active: true,
      },
    ],
  };

  return (
    <aside
      className={cn(
        "h-full bg-gray-50 border-r flex flex-col transition-all duration-300",
        collapsed ? "w-18" : "w-90",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b bg-white">
        {!collapsed && (
          <Link
            to="/"
            className={`font-semibold  text-lg text-primary h-16 whitespace-nowrap overflow-x-hidden flex items-center gap-2`}
          >
            <img src="/Kyra4.jpg" alt="Logo" className="inline-block w-full overflow-hidden h-10" />
          </Link>
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

      <div>
        <AccountSwitcher
          accounts={accounts}
          selectedAccountId={accountId || accounts[0]?.id}
          collapsed={collapsed}
          onSwitch={(accountId) => {
            handleAccountSwitch(accountId);
          }}
        />
      </div>

      {/* ✅ SAME API AS BEFORE */}
      <NavMain items={data.navMain as any} collapsed={collapsed} />

      {/* Upgrade */}
      {/* <div className="px-3 py-3">
        <Link
          to="/dashboard/subscription"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white bg-primary hover:bg-primary/90 transition"
        >
          <span className="text-lg">⚡</span>
          {!collapsed && (
            <span className="inline-block whitespace-nowrap overflow-x-hidden">
              Upgrade to Premium
            </span>
          )}
        </Link>
      </div> */}

      {/* User */}
      <div className="border-t py-0 flex items-center">
        {/* <img
          src={authUser?.profilePicture || "/avatar.png"}
          className="w-9 h-9 rounded-full object-cover"
        />
        {!collapsed && (
          <div className="text-sm">
            <p className="font-medium">{authUser?.firstName}</p>
            <p className="text-gray-500 text-xs">{authUser?.email}</p>
          </div>
        )} */}
        <SidebarFooter>
          <NavUser
            user={{
              avatar: authUser?.profilePicture || "",
              name: authUser?.firstName || "",
              email: authUser?.email || "",
            }}
          />
        </SidebarFooter>
      </div>
    </aside>
  );
}
