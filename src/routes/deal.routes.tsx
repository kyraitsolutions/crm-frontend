import { DEALS_PATHS } from "@/constants/routes/deal.path.js";
import { Deals } from "@/pages/Deals/deals.page";
import { type RouteObject } from "react-router-dom";
export const dealsRoutes: RouteObject[] = [
    {
        path: DEALS_PATHS.ROOT,
        // element: <FormLayout />,
        children: [
            {
                element: <Deals />,
                index: true,
            },
            // {
            //     element: <LeadFormNew />,
            //     path: "create",
            // },
        ],
    },
];
