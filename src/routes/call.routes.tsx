import { CALL_PATHS } from "@/constants/routes/call.path";
import { CallLayout } from "@/layouts/call.layout";
import LeadFormNew from "@/pages/leadform-new.page";
import PhoneNumberDetails from "@/pages/SalesAgent/components/PhoneNumberDetails";
import Buynumber from "@/pages/SalesAgent/pages/buynumber.page";
import Calls from "@/pages/SalesAgent/pages/calls.page";
import PhoneNumber from "@/pages/SalesAgent/pages/phonenumber.page";
import type { RouteObject } from "react-router-dom";
export const callRoutes: RouteObject[] = [
    {
        path: CALL_PATHS.ROOT,
        element: <CallLayout />,
        children: [
            {
                element: <Calls />,
                index: true,
            },
            {
                element: <LeadFormNew />,
                path: "voice-agents",
            },
            {
                element: <PhoneNumber />,
                path: "phone-numbers",
            },
            {
                element: <PhoneNumberDetails />,
                path: "phone-numbers/details/:phoneNumberSID",
            },
            {
                element: <Buynumber />,
                path: "buy-a-number",
            },
            {
                element: <LeadFormNew />,
                path: "call-settings",
            },
        ],
    },
];
