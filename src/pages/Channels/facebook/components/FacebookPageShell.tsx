import type { ReactNode } from "react";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { useActiveFacebookPage } from "../utils/pages";

interface FacebookPageShellProps {
  children: ReactNode;
}

export function FacebookPageShell({ children }: FacebookPageShellProps) {
  const { metaAccount, activePage } = useActiveFacebookPage();

  if (!metaAccount) {
    return (
      <div className="p-6 text-sm text-slate-500">Facebook account not found</div>
    );
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto px-4 py-2">
      <WorkspaceHeader
        pageName={activePage?.name}
        category={activePage?.category}
        instagramUsername={
          activePage?.instagram?.username || metaAccount?.instagram?.username
        }
      />
      {children}
    </div>
  );
}
