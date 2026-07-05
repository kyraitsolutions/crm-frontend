import { LEADS_PATHS } from "@/constants/routes/leads.path";
import { type RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";
import { PERMISSIONS } from "@/rbac";

import LeadCenter from "@/pages/LeadCentre/pages/leadCentre.page";
import ImportLeadStep from "@/pages/LeadCentre/components/import/ImportLeadStep";
import AddLead from "@/pages/LeadCentre/pages/AddLead.page";
import LeadDetail from "@/pages/LeadCentre/pages/LeadDetails.page";

// import LeadsCentre from "@/pages/leads-center.page";
export const leadRoutes: RouteObject[] = [
  {
    path: LEADS_PATHS.ROOT,
    // element: <FormLayout />,
    children: [
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS.VIEW}>
            <LeadCenter />
            {/* <LeadsCentre /> */}
          </RequirePermission>
        ),
        index: true,
      },
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS.CREATE}>
            <AddLead />
          </RequirePermission>
        ),
        path: "create",
      },
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS.CREATE}>
            <ImportLeadStep />
          </RequirePermission>
        ),
        path: "import",
      },
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS.CREATE}>
            <LeadDetail />
          </RequirePermission>
        ),
        path: ":leadId/lead-details",
      },
      // {
      //     element: <LeadFormNew />,
      //     path: "create",
      // },
    ],
  },
];
