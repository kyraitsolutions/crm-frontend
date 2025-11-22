
import { DASHBOARD_PATH } from "@/constants";
import { FormLayout } from "@/layouts/form.layout";
import LeadsCentre from "@/pages/leads-center.page";
import { Navigate, type RouteObject } from "react-router-dom";
export const leadRoutes: RouteObject[] = [
    {
        path: `${DASHBOARD_PATH.ROOT}/account/:accountId/leads`,
        element: <FormLayout />,
        children: [
            {
                element: <LeadsCentre />,
                index: true,
            },
            // {
            //     element: <LeadFormNew />,
            //     path: "create",
            // },
        ],
    },
];