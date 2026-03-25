import { DASHBOARD_PATH } from "@/constants";
import { settingSections } from "@/constants/setting.constant";

export const getBreadcrumbs = (pathname: string) => {
  //   const organizationName = user?.userprofile?.organizationName;

  //   const baseUrl = accountName
  //     ? `${DASHBOARD_PATH.ROOT}/account/${accountId}/setting`
  //     : `${DASHBOARD_PATH.ROOT}/org/${user?.id}/setting`;

  const baseUrl = `${DASHBOARD_PATH.ROOT}/settings`;
  const parts = pathname.split("/").filter(Boolean);
  const lastPart = "/" + parts[parts.length - 1];

  for (const section of settingSections) {
    for (const item of section.items) {
      if (item.link === lastPart) {
        return [
          { label: "Settings", link: baseUrl },
          { label: section.title, link: baseUrl },
          { label: item.label, link: null },
        ];
      }
    }
  }

  return [{ label: "Settings", link: baseUrl }];
};
