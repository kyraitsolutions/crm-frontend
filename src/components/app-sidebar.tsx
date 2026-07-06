import { ACCOUNT_PATHS } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { hasPermission, PERMISSIONS } from "@/rbac";
import { AuthStoreManager, useAuthStore } from "@/stores";
import { useAccountAccessStore } from "@/stores/account-access.store";
import { useAccountsStore } from "@/stores/accounts.store";
import {
  IconChevronLeft,
  IconChevronRight,
  IconUsers,
} from "@tabler/icons-react";
import { Book, Gauge, MessagesSquare } from "lucide-react";
import { useState } from "react";
import { MdOutlineContacts } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { AccountSwitcher } from "./accountSwitcher/AccountSwitcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { SidebarFooter } from "./ui/sidebar";

export function AppSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const { accounts } = useAccountsStore((state) => state);
  const authManager = new AuthStoreManager();

  const { user: authUser, accountId } = useAuthStore((state) => state);
  const { permissions } = useAccountAccessStore((state) => state);

  const handleAccountSwitch = (accountId: string, accountName: string) => {
    const pathName = window.location.pathname;
    authManager.setLastSlugPath(pathName);
    authManager.setAccountName(accountName);
    authManager.setAccountId(accountId);
    navigate(ACCOUNT_PATHS.byId(accountId));
  };

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: ACCOUNT_PATHS.byId(String(accountId)),
        active: true,
        icon: Gauge,
      },
      {
        title: "Live Chat",
        url: `${ACCOUNT_PATHS.byId(String(accountId))}/live-chat`,
        active: true,
        icon: MessagesSquare,
      },

      {
        title: "Leads Centre",
        url: `${ACCOUNT_PATHS.byId(String(accountId))}/leads`,
        icon: IconUsers,
        active: hasPermission(permissions, PERMISSIONS.LEADS.VIEW),
      },
      // {
      //   title: "Deals",
      //   url: `${ACCOUNT_PATHS.byId(String(accountId))}/deals`,
      //   icon: Book,
      //   active: true,
      // },
      // {
      //   title: "Lead Forms",
      //   url: `${ACCOUNT_PATHS.byId(String(accountId))}/lead-forms`,
      //   icon: IconFileText,
      //   active: hasPermission(permissions, PERMISSIONS.LEADS_FORMS.VIEW),
      // },
      // {
      //   title: "Broadcast",
      //   url: `${ACCOUNT_PATHS.byId(String(accountId))}/broadcast`,
      //   icon: MdOutlineCampaign,
      //   active: true,
      //   children: [
      //     {
      //       title: "Email",
      //       url: `${ACCOUNT_PATHS.byId(String(accountId))}/broadcast/email`,
      //       icon: MdEmail,
      //     },
      //     {
      //       title: "WhatsApp",
      //       url: `${ACCOUNT_PATHS.byId(String(accountId))}/broadcast/whatsapp`,
      //       icon: MdWhatsapp,
      //     },
      //     {
      //       title: "Templates",
      //       url: `${ACCOUNT_PATHS.byId(String(accountId))}/broadcast/templates`,
      //       icon: BookTemplateIcon,
      //     },
      //   ],
      // },
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
        "h-full bg-slate-900 border-r flex flex-col  transition-all duration-300",
        collapsed ? "w-20 items-center" : "w-74",
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b ">
        {!collapsed && (
          <Link
            to="/"
            className={`font-bold  text-2xl text-primary h-16 whitespace-nowrap overflow-x-hidden flex items-center gap-2`}
          >
            {/* <img
              src="/Kyra4.jpg"
              alt="Logo"
              className="inline-block w-full overflow-hidden h-10"
            /> */}
            KYRA
          </Link>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 bg-primary text-white rounded-xl cursor-pointer "
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
          onSwitch={(accountId, accountName) => {
            handleAccountSwitch(accountId, accountName);
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
            collapsed={collapsed}
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
