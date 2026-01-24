import { useAuthStore } from "@/stores";

export function SiteHeader() {
  const { accountName } = useAuthStore((state) => state);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {accountName ? (
          <h2 className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium text-gray-600">Account</span>

            <span className="text-gray-400">/</span>

            <span className="font-semibold text-[#16A34A] truncate max-w-[200px]">
              {accountName || "—"}
            </span>
          </h2>
        ) : (
          <h2 className="text-sm text-gray-400 italic">
            Select an account to continue
          </h2>
        )}
        {/* <h1 className="text-base text-primary font-medium">
          <span className="font-bold tracking-wider">Account</span> {">"}{" "}
          {accountName || ""}
        </h1> */}
        <div className="ml-auto flex items-center gap-2"></div>
      </div>
    </header>
  );
}
