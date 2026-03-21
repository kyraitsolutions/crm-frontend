import { DASHBOARD_PATH } from "@/constants";
import { BroadcastLayout } from "@/layouts/broadcast.layout";
import EmailMarketing from "@/pages/EmailMarketing";
import WhatsappMarketing from "@/pages/WhatsappMarketing"
import Automations from "@/pages/EmailMarketing/automations.page";
import Campaign from "@/pages/EmailMarketing/campaign.page";
import Templates from "@/pages/MessageTemplates";
import { type RouteObject } from "react-router-dom";
import { EmailMarketingLayout } from "@/layouts/emailMarketing.layout";
import { WhatsappMarketingLayout } from "@/layouts/whatsappMarketing.layout";
import { TemplateLayout } from "@/layouts/templates.layout";
export const broadcastRoutes: RouteObject[] = [
    {
        path: `${DASHBOARD_PATH.ROOT}/account/:accountId/broadcast`,
        element: <BroadcastLayout />,
        children: [

    {
      path: "email",
      element: <EmailMarketingLayout />,
      children: [
        { index: true, element: <EmailMarketing /> },
        { path: "campaigns", element: <Campaign /> },
        { path: "automations", element: <Automations /> },
      ]
    },

    {
      path: "whatsapp",
      element: <WhatsappMarketingLayout />,
      children: [
        { index: true, element: <WhatsappMarketing /> },
        { path: "campaigns", element: <Campaign /> },
        { path: "automations", element: <Automations /> },
      ]
    },
    {
      path: "templates",
      element: <TemplateLayout />,
      children: [
        { index: true, element: <Templates /> },
        { path: "mytemplates", element: <Templates /> },
      ]
    }

  ]
        // children: [
        //     {
        //         element: <EmailMarketing />,
        //         index: true,
        //     },
        //     {
        //         element: <WhatsappMarketing />,
        //         path:"whatsapp-broadcast" ,
        //     },
        //     {
        //         element: <Subscribers />,
        //         path: "subscribers",
        //     },
        //     {
        //         element: <Campaign />,
        //         path: "campaigns",
        //     },
        //     {
        //         element: <Templates />,
        //         path: "templates",
        //     },
        //     {
        //         element: <Automations />,
        //         path: "automations",
        //     },
        // ]
    }
];