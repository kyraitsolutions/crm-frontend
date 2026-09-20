import { ConnectionStatusCard } from "../components/cards/ConnectionStatusCard";
import { FacebookPageCard } from "../components/cards/FacebookPageCard";
import { InstagramCard } from "../components/cards/InstagramCard";
import { QuickStats } from "../components/QuickStats";
import type { TMetaAccount } from "../types/meta.type";
import { getActiveFacebookPage, getFacebookPages } from "../utils/pages";

interface OverviewTabProps {
  data: TMetaAccount;
}

export const OverviewTab = ({ data }: OverviewTabProps) => {
  const pages = getFacebookPages(data);
  const activePage = getActiveFacebookPage(data);
  const instagram = activePage?.instagram || data?.instagram;

  return (
    <div className="space-y-6">
      <QuickStats data={data} />

      <div className="grid gap-4 lg:grid-cols-3">
        <ConnectionStatusCard
          connected={data?.isConnected}
          onboardingCompleted={data?.onboardingCompleted}
          webhookSubscribed={
            activePage?.webhookSubscribed ?? data?.webhookSubscribed
          }
        />

        <FacebookPageCard data={activePage} />
        <InstagramCard data={instagram} />
      </div>

      {pages.length > 1 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-3 font-semibold text-slate-800">Connected Pages</h3>
          <div className="grid gap-3 md:grid-cols-2">
            {pages.map((page) => {
              const isActive = page.id === activePage?.id;
              return (
                <div
                  key={page.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2 ${
                    isActive
                      ? "border-emerald-200 bg-green-100/60 text-emerald-800"
                      : "border-slate-200 bg-white text-slate-800"
                  }`}
                >
                  {page.picture ? (
                    <img
                      src={page.picture}
                      alt={page.name}
                      className="size-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-blue-100" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {page.name}
                    </p>
                    <p className="text-xs">
                      {isActive ? "Viewing" : page.category || "Page"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {activePage?.about || activePage?.description ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-2">
          <h3 className="font-semibold text-slate-800">Page About</h3>
          <p className="text-sm text-slate-600">
            {activePage.about || activePage.description}
          </p>
        </div>
      ) : null}
    </div>
  );
};
