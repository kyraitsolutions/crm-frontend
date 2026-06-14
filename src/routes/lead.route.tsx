import { LEADS_PATHS } from "@/constants/routes/leads.path";
import { type RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";
import { PERMISSIONS } from "@/rbac";
import AddLead from "@/pages/LeadCentre/AddLead";
import LeadDetail from "@/pages/LeadCentre/components/LeadDetail";
import LeadCenter from "@/pages/LeadCentre/leadCentre.page";
import ImportLead from "@/pages/LeadCentre/importLead.page";
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
            <ImportLead />
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
