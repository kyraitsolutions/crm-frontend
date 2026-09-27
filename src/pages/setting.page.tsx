import { useMemo, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { settingSections } from "@/constants/setting.constant";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Bot,
  Building2,
  ChevronRight,
  Code2,
  CreditCard,
  Facebook,
  HardDrive,
  Instagram,
  LayoutGrid,
  MessageCircle,
  Puzzle,
  Search,
  Send,
  Settings2,
  Shield,
  Sparkles,
  Store,
  Trash2,
  User,
  Users,
  Webhook,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

const ITEM_META: Record<string, { icon: LucideIcon; hint: string }> = {
  Profile: { icon: User, hint: "Your name, email, and sign-in" },
  "Company Details": {
    icon: Building2,
    hint: "Business name and company info",
  },
  Notifications: { icon: Bell, hint: "Alerts for messages and activity" },
  "Manage Users": { icon: Users, hint: "Invite people and manage access" },
  "Roles and Privileges": {
    icon: Shield,
    hint: "What each role is allowed to do",
  },
  "Accounts & Workspaces": {
    icon: LayoutGrid,
    hint: "Switch or manage workspaces",
  },
  Whatsapp: { icon: MessageCircle, hint: "Connect and manage WhatsApp" },
  Telegram: { icon: Send, hint: "Connect your Telegram channel" },
  Instagram: { icon: Instagram, hint: "Connect your Instagram account" },
  Facebook: { icon: Facebook, hint: "Connect your Facebook page" },
  Configuration: { icon: Settings2, hint: "Workspace preferences" },
  "Activity Logs": { icon: Activity, hint: "See what changed and when" },
  "Chat Bot": { icon: Bot, hint: "The bot that replies in chat" },
  "Chat Flows": { icon: Workflow, hint: "Build the paths a chat can take" },
  "AI Agent": { icon: Sparkles, hint: "Train the agent customers talk to" },
  Apps: { icon: Puzzle, hint: "Connected apps for this workspace" },
  Marketplace: { icon: Store, hint: "Browse apps you can add" },
  APIs: { icon: Code2, hint: "API reference, opens in a new tab" },
  Webhook: { icon: Webhook, hint: "Send events to your own systems" },
  Storage: { icon: HardDrive, hint: "Files and space used" },
  "Recycle Bin": { icon: Trash2, hint: "Restore items you removed" },
  "My plan": { icon: CreditCard, hint: "What this workspace is on" },
  "Upgrade plan": {
    icon: ArrowUpRight,
    hint: "Compare plans and change yours",
  },
};

const hrefFor = (label: string, link: string) =>
  label === "APIs" || link.startsWith("http")
    ? link
    : `${ROUTES.DASHBOARD}/settings${link}`;

const SettingPage = () => {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();

  const sections = useMemo(
    () =>
      settingSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => {
            if (!needle) return true;
            const hint = ITEM_META[item.label]?.hint.toLowerCase() || "";
            return (
              item.label.toLowerCase().includes(needle) ||
              section.title.toLowerCase().includes(needle) ||
              hint.includes(needle)
            );
          }),
        }))
        .filter((section) => section.items.length > 0),
    [needle],
  );

  return (
    <div className="min-h-full p-2">
      <div className="mx-auto flex flex-col gap-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search settings"
            className="input-field h-10 w-full border bg-white pr-3 pl-9 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {sections.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <h2 className="px-2 pt-1 pb-2 text-[11px] font-semibold tracking-[0.16em] text-slate-400 uppercase">
                  {section.title}
                </h2>
                <div className="flex flex-col">
                  {section.items.map((item) => {
                    const meta = ITEM_META[item.label];
                    const Icon = meta?.icon || Settings2;
                    const href = hrefFor(item.label, item.link);
                    const external = href.startsWith("http");
                    const className =
                      "group flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-slate-50";
                    const body = (
                      <>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-slate-900">
                            {item.label}
                          </span>
                          {meta?.hint ? (
                            <span className="block truncate text-xs text-slate-500">
                              {meta.hint}
                            </span>
                          ) : null}
                        </span>
                        <ChevronRight className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-primary" />
                      </>
                    );
                    return external ? (
                      <a
                        key={item.label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className={className}
                      >
                        {body}
                      </a>
                    ) : (
                      <Link key={item.label} to={href} className={className}>
                        {body}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
            No settings match “{query.trim()}”.
          </p>
        )}
      </div>
    </div>
  );
};

export default SettingPage;
