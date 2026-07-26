import { useState } from "react";
import OptCard from "../components/optin/OptCard";
import CampaignOptout from "../components/optin/CampaignOptout";

const OptinPage = () => {
    const [optOutEnabled, setOptOutEnabled] = useState(false);
    const [optInEnabled, setOptInEnabled] = useState(false);
    const [campaignOptout, setCampaignOptout] = useState(true);
    return (
        <div className="space-y-8 max-w-7xl mx-auto py-10 h-[calc(100vh-64px)] overflow-y-scroll hide-scrollbar">
            <CampaignOptout
                title="API Campaign Opt-out"
                description="Enable this if you don't wish to send API campaign to opted-out contacts."
                enabled={campaignOptout}
                onChange={setCampaignOptout}
            />
            <OptCard
                title="Opt-out Keywords"
                description="The user will have to type exactly one of these messages on which they should be automatically opted-out."
                responseTitle="Opt-out Response"
                responseDescription="Setup a response message for opt-out user keywords."
                keywords={["Stop"]}
                message="You have been opted-out of your future communications."
                autoResponseEnabled={optOutEnabled}
                onToggle={setOptOutEnabled}
                onAddKeyword={() => console.log("Add Opt-out")}
                onConfigure={() => console.log("Configure Opt-out")}
                onSave={() => console.log("Save Opt-out")}
            />

            <OptCard
                title="Opt-in Keywords"
                description="The user will have to type exactly one of these messages on which they should be automatically opted-in."
                responseTitle="Opt-in Response"
                responseDescription="Setup a response message for opt-in user keywords."
                keywords={["Allow"]}
                message="Thanks, You have been opted-in of your future communications."
                autoResponseEnabled={optInEnabled}
                onToggle={setOptInEnabled}
                onAddKeyword={() => console.log("Add Opt-in")}
                onConfigure={() => console.log("Configure Opt-in")}
                onSave={() => console.log("Save Opt-in")}
            />
        </div>
    );
};

export default OptinPage;