
import { DASHBOARD_PATH } from "@/constants";
import { FormLayout } from "@/layouts/form.layout";
import LeadFormNew from "@/pages/leadform-new.page";
import { LeadFormPage } from "@/pages/leadform.page";
import { Navigate, type RouteObject } from "react-router-dom";
export const formRoutes: RouteObject[] = [
    {
        path: `${DASHBOARD_PATH.ROOT}/account/:accountId/lead-forms`,
        element: <FormLayout />,
        children: [
            {
                element: <LeadFormPage />,
                index: true,
            },
            {
                element: <LeadFormNew />,
                path: "create",
            },
        ],
    },
];