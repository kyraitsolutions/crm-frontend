import { useState, useMemo, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, CircleUserRound, Settings } from "lucide-react";
import { getFirstWordOfSentence } from "@/utils/typography.utils";
import { Input } from "../ui/input";
import { Link } from "react-router-dom";
import { MdManageAccounts } from "react-icons/md";
import { ROUTES } from "@/constants";

type Account = {
  id: string;
  accountName: string;
  email: string;
  status: string;
};

type Props = {
  accounts: Account[];
  selectedAccountId?: string;
  onSwitch: (accountId: string, accountName: string) => void;
  collapsed?: boolean;
};

export function AccountSwitcher({
  accounts,
  selectedAccountId,
  onSwitch,
  collapsed,
}: Props) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const htmlDivRefForDropDown = useRef<HTMLDivElement>(null);

  // 🔍 filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter((acc) =>
      acc.accountName.toLowerCase().includes(search.toLowerCase()),
    );
  }, [accounts, search]);

  const selectedAccount = accounts.find((a) => a.id === selectedAccountId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        htmlDivRefForDropDown.current &&
        !htmlDivRefForDropDown.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={`px-3 py-2 relative ${!collapsed ? 'w-70' : 'w-18'}`}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          " w-full flex items-center rounded-xl justify-between px-3 py-2  transition-all duration-400 text-sm",
          collapsed && "justify-center",
          !collapsed && "bg-primary/90 text-white hover:bg-primary"
        )}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-primary size-8 rounded-full flex justify-center items-center">
              {getFirstWordOfSentence(selectedAccount?.accountName || "")}
            </span>
            <span className="truncate">
              {selectedAccount?.accountName || "Select Account"}
            </span>
          </div>
        )}

        {collapsed && <div className="flex">
          <span className="bg-primary text-white size-10 rounded-full flex justify-center items-center">
            {getFirstWordOfSentence(selectedAccount?.accountName || "")}
            {/* {selectedAccount?.accountName.charAt(0) || ""} */}
          </span>

        </div>}

        {!collapsed && <span
          className={`transition-all duration-500 size-5 bg-gray-200 flex justify-center items-center text-primary rounded-full ${open && "rotate-180"}`}
        >
          <ChevronDown size={16} />
        </span>}

      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={htmlDivRefForDropDown}
          className={`mt-2 bg-white rounded-xl border p-2 space-y-2 ${collapsed && "absolute left-[110%] min-w-60  top-0 z-50 "}`}
        >
          {/* Search */}
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 py-1 text-sm border shadow-none rounded-md outline-none  focus-visible:ring-0 focus:border-primary/30!"
          />

          {/* List */}
          <div className="space-y-1 w-full max-h-90 overflow-y-auto hide-scrollbar">
            {filteredAccounts.length === 0 && (
              <div className="flex flex-col gap-1 items-center justify-center mt-2">
                <CircleUserRound size={22} color="#2b292952" />
                <p className="text-xs text-gray-400 font-medium">
                  No accounts found
                </p>
              </div>
            )}

            {filteredAccounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  onSwitch(acc.id, acc.accountName);
                  setOpen(false);
                }}
                className={cn(
                  "w-full text-left px-2 py-2 rounded-md text-sm hover:bg-primary/10 duration-300 ",
                  selectedAccountId === acc.id &&
                  "bg-primary/10 text-primary font-medium",
                )}
              >
                <div className="flex items-center gap-2">
                  <div className="bg-white text-primary h-8 w-8 rounded-full flex items-center justify-center text-xs">
                    {getFirstWordOfSentence(acc.accountName)}
                    {/* {acc.accountName.charAt(0)} */}
                  </div>
                  <div>
                    <p className="truncate">{acc.accountName}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {acc.email}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>



          <div>
            <Link to={`${ROUTES.DASHBOARD}/settings/workspace`} className="flex items-center gap-2 px-3 py-2 hover:bg-primary duration-300  rounded-xl text-gray-500 hover:text-white">
              <MdManageAccounts size={20} />
              <span className="text-sm">Manage accounts</span>
            </Link>
            <Link to={`${ROUTES.DASHBOARD}/settings`} className="flex gap-2 items-center px-3 py-2 hover:bg-primary  duration-300  rounded-xl text-gray-500 hover:text-white">
              <Settings size={17} />
              <span className="text-sm">Company settings</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
