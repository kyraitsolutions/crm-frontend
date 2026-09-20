import { Button } from "@/components/ui/button";
import { ACCOUNT_PATHS, ROUTES } from "@/constants/routes";
import { COOKIES_STORAGE } from "@/constants";
import { AuthStoreManager, useAuthStore } from "@/stores";
import { useAccountsStore } from "@/stores/accounts.store";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { formatDate } from "@/utils/date-utils";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import {
  Bot,
  Gauge,
  Mail,
  MessageCircle,
  MessagesSquare,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const MODULES = [
  {
    title: "Analytics",
    description: "Track leads, conversations, and channel performance.",
    icon: Gauge,
  },
  {
    title: "Live Chat",
    description: "Reply to WhatsApp and website chats from one inbox.",
    icon: MessagesSquare,
  },
  {
    title: "Leads Centre",
    description: "Capture, qualify, and follow up with every enquiry.",
    icon: Users,
  },
  {
    title: "WhatsApp Marketing",
    description: "Send broadcasts and keep customer conversations going.",
    icon: MessageCircle,
  },
  {
    title: "Email Marketing",
    description: "Run campaigns and stay in touch with your audience.",
    icon: Mail,
  },
  {
    title: "Chatbots",
    description: "Automate FAQs, qualifying questions, and after-hours replies.",
    icon: Bot,
  },
];

const DashboardHomePage = () => {
  const navigate = useNavigate();
  const authManager = new AuthStoreManager();
  const { user } = useAuthStore((state) => state);
  const { accounts } = useAccountsStore((state) => state);
  const firstName = user?.userProfile?.firstName || user?.firstName || "";

  const handleSelectAccount = (account: (typeof accounts)[number]) => {
    if (!account?.id) return;

    if (user) {
      authManager.setUser({
        ...user,
        account: {
          ...account,
          selectedAccount: account.accountName,
          isAccountSelected: true,
        },
      });
    }

    authManager.setAccountName(account.accountName);
    authManager.setAccountId(account.id);
    CookieUtils.setItem(COOKIES_STORAGE.accountId, account.id);
    navigate(ACCOUNT_PATHS.byId(account.id));
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border border-primary/10 bg-white px-6 py-8 md:px-8">
          <p className="text-sm font-medium text-primary">Kyra AI CRM</p>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-900 md:text-3xl">
            {firstName ? `Welcome back, ${firstName}` : "Welcome to Kyra"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-500">
            Select a workspace to open analytics, live chat, WhatsApp, leads,
            and campaigns. Kyra keeps conversations and customer data in one
            place so your team can reply faster and follow up without switching
            tools.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Choose a workspace
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Analytics and day-to-day work are available after you select
                  an account.
                </p>
              </div>
              <Button
                asChild
                className="rounded-xl bg-primary hover:bg-primary/90"
              >
                <Link to={`${ROUTES.DASHBOARD}/settings/workspace`}>
                  Manage accounts
                </Link>
              </Button>
            </div>

            {accounts.length > 0 ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {accounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => handleSelectAccount(account)}
                    className="rounded-2xl border border-primary/20 px-4 py-4 text-left transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                        {getFirstWordOfSentence(account.accountName || "")}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium capitalize text-neutral-900">
                          {account.accountName}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {account.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-xs text-neutral-500">
                      <span>
                        {account.createdAt
                          ? `Created ${formatDate(account.createdAt)}`
                          : "Workspace"}
                      </span>
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 capitalize text-primary">
                        {account.status || "active"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-primary/30 px-6 py-10 text-center">
                <p className="text-sm font-medium text-neutral-800">
                  No workspace yet
                </p>
                <p className="mt-1 text-sm text-neutral-500">
                  Create an account to start capturing leads and conversations.
                </p>
                <Button
                  asChild
                  className="mt-4 rounded-xl bg-primary hover:bg-primary/90"
                >
                  <Link to={`${ROUTES.DASHBOARD}/settings/workspace`}>
                    Create workspace
                  </Link>
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-base font-semibold text-neutral-900">
              What you can do in Kyra
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              These tools open after a workspace is selected.
            </p>
            <div className="mt-5 space-y-3">
              {MODULES.map((module) => (
                <div
                  key={module.title}
                  className="flex items-start gap-3 rounded-xl border border-gray-100 px-3 py-3"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <module.icon size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      {module.title}
                    </p>
                    <p className="text-xs leading-5 text-neutral-500">
                      {module.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardHomePage;
