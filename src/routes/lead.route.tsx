import { LEADS_PATHS } from "@/constants/routes/leads.path";
import LeadsCentre from "@/pages/leads-center.page";
import { type RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";
import { PERMISSIONS } from "@/rbac";
export const leadRoutes: RouteObject[] = [
  {
    path: LEADS_PATHS.ROOT,
    // element: <FormLayout />,
    children: [
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS.VIEW}>
            <LeadsCentre />
          </RequirePermission>
        ),
        index: true,
      },
      // {
      //     element: <LeadFormNew />,
      //     path: "create",
      // },
    ],
  },
];
