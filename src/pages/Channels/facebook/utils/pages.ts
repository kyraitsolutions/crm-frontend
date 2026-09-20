import { useIntegrationStore } from "@/stores/integration.store";
import type { TFacebookPage, TMetaAccount } from "../types/meta.type";

export function getFacebookPages(account?: TMetaAccount | null): TFacebookPage[] {
  if (account?.facebookPages?.length) {
    return account.facebookPages;
  }

  if (account?.facebookPage?.id) {
    return [account.facebookPage];
  }

  return [];
}

export function getActiveFacebookPage(
  account?: TMetaAccount | null,
): TFacebookPage | null {
  const pages = getFacebookPages(account);
  if (!pages.length) return null;

  return pages.find((page) => page.id === account?.activePageId) || pages[0];
}

export function useActiveFacebookPage() {
  const integration = useIntegrationStore((state) => state.integration);
  const metaAccount = (integration?.data as TMetaAccount | undefined) ?? null;
  const pages = getFacebookPages(metaAccount);
  const activePage = getActiveFacebookPage(metaAccount);

  return {
    metaAccount,
    pages,
    activePage,
    activePageId: activePage?.id ?? null,
  };
}
