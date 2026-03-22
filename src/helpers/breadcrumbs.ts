import { DASHBOARD_PATH } from "@/constants";
import { settingSections } from "@/constants/setting.constant";
import { useAuthStore } from "@/stores";

export const getBreadcrumbs = (pathname: string) => {

    const { accountName, accountId, user } = useAuthStore((state) => state);
    //   const organizationName = user?.userprofile?.organizationName;

    const baseUrl = accountName
        ? `${DASHBOARD_PATH.ROOT}/account/${accountId}/setting`
        : `${DASHBOARD_PATH.ROOT}/org/${user?.id}/setting`;

    const parts = pathname.split('/').filter(Boolean);
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
