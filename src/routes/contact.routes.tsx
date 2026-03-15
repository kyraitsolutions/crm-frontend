import { DASHBOARD_PATH } from "@/constants";
import { FormLayout } from "@/layouts";
import Contacts from "@/pages/contacts.page";
import { type RouteObject } from "react-router-dom";
export const contactRoutes: RouteObject[] = [
  {
    path: `${DASHBOARD_PATH.ROOT}/account/:accountId/contacts`,
    element: <FormLayout />,
    children: [
      {
        element: <Contacts />,
        index: true,
      },
      // {
      //     element: <LeadFormNew />,
      //     path: "create",
      // },
    ],
  },
];
