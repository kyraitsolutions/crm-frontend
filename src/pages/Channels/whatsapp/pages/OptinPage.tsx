import { useEffect, useState } from "react";
import OptCard from "../components/optin/OptCard";
import CampaignOptout from "../components/optin/CampaignOptout";
import { useAuthStore } from "@/stores";
import { whatsappBroadcastService } from "@/pages/WhatsappMarketing/services/whatsapp-broadcast.service";
import { ToastMessageService } from "@/services";

const OptinPage = () => {
  const { accountId } = useAuthStore();
  const toast = new ToastMessageService();
  const [loaded, setLoaded] = useState(false);
  const [campaignOptout, setCampaignOptout] = useState(true);
  const [optOutEnabled, setOptOutEnabled] = useState(false);
  const [optInEnabled, setOptInEnabled] = useState(false);
  const [optOutKeywords, setOptOutKeywords] = useState(["Stop"]);
  const [optInKeywords, setOptInKeywords] = useState(["Allow"]);
  const [optOutMessage, setOptOutMessage] = useState(
    "You have been opted-out of your future communications.",
  );
  const [optInMessage, setOptInMessage] = useState(
    "Thanks, You have been opted-in of your future communications.",
  );

  useEffect(() => {
    if (!accountId) return;
    void whatsappBroadcastService
      .getOptIn(String(accountId))
      .then((response) => {
        const doc = response.data?.doc;
        if (!doc) return;
        setCampaignOptout(doc.skipOptedOutCampaigns !== false);
        setOptOutEnabled(Boolean(doc.optOut?.autoReply));
        setOptInEnabled(Boolean(doc.optIn?.autoReply));
        setOptOutKeywords(doc.optOut?.keywords?.length ? doc.optOut.keywords : ["Stop"]);
        setOptInKeywords(doc.optIn?.keywords?.length ? doc.optIn.keywords : ["Allow"]);
        if (doc.optOut?.message) setOptOutMessage(doc.optOut.message);
        if (doc.optIn?.message) setOptInMessage(doc.optIn.message);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [accountId]);

  const persist = async (payload: Record<string, unknown>) => {
    if (!accountId) return;
    try {
      await whatsappBroadcastService.updateOptIn(String(accountId), payload);
      toast.success("Settings saved");
    } catch (error: any) {
      toast.error(error?.message || "Could not save settings");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-10">
      <CampaignOptout
        title="API Campaign Opt-out"
        description="Enable this if you don't wish to send API campaign to opted-out contacts."
        enabled={campaignOptout}
        onChange={(value) => {
          setCampaignOptout(value);
          if (loaded) void persist({ skipOptedOutCampaigns: value });
        }}
      />
      <OptCard
        title="Opt-out Keywords"
        description="The user will have to type exactly one of these messages on which they should be automatically opted-out."
        responseTitle="Opt-out Response"
        responseDescription="Setup a response message for opt-out user keywords."
        keywords={optOutKeywords}
        message={optOutMessage}
        autoResponseEnabled={optOutEnabled}
        onToggle={(value) => {
          setOptOutEnabled(value);
          if (loaded) {
            void persist({
              optOut: { keywords: optOutKeywords, autoReply: value, message: optOutMessage },
            });
          }
        }}
        onAddKeyword={() => setOptOutKeywords((prev) => [...prev, ""])}
        onKeywordChange={(index, value) =>
          setOptOutKeywords((prev) => prev.map((item, i) => (i === index ? value : item)))
        }
        onConfigure={() => {
          const next = window.prompt("Opt-out response message", optOutMessage);
          if (next != null) setOptOutMessage(next);
        }}
        onSave={() =>
          void persist({
            skipOptedOutCampaigns: campaignOptout,
            optOut: { keywords: optOutKeywords, autoReply: optOutEnabled, message: optOutMessage },
            optIn: { keywords: optInKeywords, autoReply: optInEnabled, message: optInMessage },
          })
        }
      />

      <OptCard
        title="Opt-in Keywords"
        description="The user will have to type exactly one of these messages on which they should be automatically opted-in."
        responseTitle="Opt-in Response"
        responseDescription="Setup a response message for opt-in user keywords."
        keywords={optInKeywords}
        message={optInMessage}
        autoResponseEnabled={optInEnabled}
        onToggle={(value) => {
          setOptInEnabled(value);
          if (loaded) {
            void persist({
              optIn: { keywords: optInKeywords, autoReply: value, message: optInMessage },
            });
          }
        }}
        onAddKeyword={() => setOptInKeywords((prev) => [...prev, ""])}
        onKeywordChange={(index, value) =>
          setOptInKeywords((prev) => prev.map((item, i) => (i === index ? value : item)))
        }
        onConfigure={() => {
          const next = window.prompt("Opt-in response message", optInMessage);
          if (next != null) setOptInMessage(next);
        }}
        onSave={() =>
          void persist({
            skipOptedOutCampaigns: campaignOptout,
            optOut: { keywords: optOutKeywords, autoReply: optOutEnabled, message: optOutMessage },
            optIn: { keywords: optInKeywords, autoReply: optInEnabled, message: optInMessage },
          })
        }
      />
    </div>
  );
};

export default OptinPage;
