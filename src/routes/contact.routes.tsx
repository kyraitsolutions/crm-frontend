import { CONTACT_PATHS } from "@/constants/routes/contact.path";
import Contacts from "@/pages/contacts.page";
import { type RouteObject } from "react-router-dom";
export const contactRoutes: RouteObject[] = [
  {
    path: CONTACT_PATHS.ROOT,
    // element: <FormLayout />,
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
