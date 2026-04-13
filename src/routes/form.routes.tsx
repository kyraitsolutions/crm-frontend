import { LEAD_FORM_PATHS } from "@/constants";
import LeadFormNew from "@/pages/leadform-new.page";
import { LeadFormPage } from "@/pages/leadform.page";
import { PERMISSIONS } from "@/rbac";
import { type RouteObject } from "react-router-dom";
import { RequirePermission } from "./route-access/RequirePermission";
export const formRoutes: RouteObject[] = [
  {
    path: LEAD_FORM_PATHS.ROOT,
    // element: <FormLayout />,
    children: [
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS_FORMS.VIEW}>
            <LeadFormPage />
          </RequirePermission>
        ),
        index: true,
      },
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS_FORMS.CREATE}>
            <LeadFormNew />
          </RequirePermission>
        ),
        path: "create",
      },
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS_FORMS.VIEW}>
            <LeadFormNew />
          </RequirePermission>
        ),
        path: ":formId/view",
      },
      {
        element: (
          <RequirePermission permission={PERMISSIONS.LEADS_FORMS.UPDATE}>
            <LeadFormNew />
          </RequirePermission>
        ),
        path: ":formId/update",
      },
    ],
  },
];
