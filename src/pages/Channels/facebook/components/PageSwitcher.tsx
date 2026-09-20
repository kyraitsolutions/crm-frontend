import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthStore } from "@/stores";
import { useIntegrationStore } from "@/stores/integration.store";
import { ToastMessageService } from "@/services";
import type { ApiError } from "@/types";
import { useState } from "react";
import { metaService } from "../services/meta.service";
import { useActiveFacebookPage } from "../utils/pages";

export function PageSwitcher({ className }: { className?: string }) {
  const accountId = useAuthStore((state) => state.accountId);
  const getIntegration = useIntegrationStore((state) => state.getIntegration);
  const { pages, activePageId } = useActiveFacebookPage();
  const [switching, setSwitching] = useState(false);
  const toastService = new ToastMessageService();

  if (pages.length <= 1) return null;

  const handleSwitch = async (pageId: string) => {
    if (!accountId || pageId === activePageId) return;

    try {
      setSwitching(true);
      await metaService.setActivePage(String(accountId), pageId);
      await getIntegration("facebook", String(accountId));
    } catch (error) {
      const err = error as ApiError;
      toastService.error(err.message || "Failed to switch Facebook Page");
    } finally {
      setSwitching(false);
    }
  };

  return (
    <Select
      value={activePageId || undefined}
      onValueChange={handleSwitch}
      disabled={switching}
    >
      <SelectTrigger className={className || "w-full bg-white cursor-pointer"}>
        <SelectValue placeholder="Select a Page" />
      </SelectTrigger>
      <SelectContent>
        {pages.map((page) => (
          <SelectItem key={page.id} value={page.id}>
            {page.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
