import { DASHBOARD_PATH } from "@/constants";
import { EmailCampaignLayout } from "@/layouts/emailcampaign.layout";
import EmailMarketing from "@/pages/EmailMarketing";
import Automations from "@/pages/EmailMarketing/automations.page";
import Campaign from "@/pages/EmailMarketing/campaign.page";
import Subscribers from "@/pages/EmailMarketing/subscribers.page";
import Templates from "@/pages/EmailMarketing/template.page";
import { type RouteObject } from "react-router-dom";
export const emailMarketingRoutes: RouteObject[] = [
    {
        path: `${DASHBOARD_PATH.ROOT}/account/:accountId/email-campaigns`,
        element: <EmailCampaignLayout />,
        children: [
            {
                element: <EmailMarketing />,
                index: true,
            },
            {
                element: <Subscribers />,
                path: "subscribers",
            },
            {
                element: <Campaign />,
                path: "campaigns",
            },
            {
                element: <Templates />,
                path: "templates",
            },
            {
                element: <Automations />,
                path: "automations",
            },
        ]
    }
];