import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";

import { useState } from "react";
import { toast } from "sonner";

export default function ChatbotIntegration({ setActiveTab }: any) {
  const { accountId, chatBotId } = useParams();
  const [copy, setCopy] = useState({
    id: 0,
    copy: true,
  });

  const scriptCode = `<Script id="chatbot-config" strategy="afterInteractive">{window.eazbotConfig={accountId:"${accountId}",chatbotId:"${chatBotId}"};}</Script>

<Script src="https://crm.kyraitsolutions.com/widget/chatbot.js" strategy="afterInteractive"/>
`;

  const scriptCode2 = `<script> window.eazbotConfig = {accountId:"${accountId}",chatbotId:"${chatBotId}"};</script>

<script ssrc="https://crm.kyraitsolutions.com/widget/chatbot.js"></script>
`;

  const handleCopy = async (script: string, id: number) => {
    try {
      await navigator.clipboard.writeText(script);
      toast.success("Copied!", {
        description: "Your script has been copied to clipboard.",
      });
      setCopy({ id: id, copy: true });
    } catch (error) {
      toast.error("Copy failed", {
        description:
          error instanceof Error ? error.message : "Unable to copy the script.",
      });
      setCopy({ id: 0, copy: false });
    } finally {
      setTimeout(() => {
        console.log("first");
        setCopy({ id: 0, copy: false });
      }, 1000);
    }
  };

  return (
    <div className="w-full space-y-6">
      {chatBotId ? (
        <Card
          className="
          border-none
        rounded-2xl
        shadow-none
        px-0
      "
        >
          <CardContent className="space-y-6 px-2">
            <h2 className="text-md font-medium text-[#37322F]">
              1. Install the below code on your website to start using your Chatbot
            </h2>

            <p className="text-sm text-[#847971]">
              Copy and paste the code right before the closing{" "}
              <code className="font-mono text-[#37322F]">&lt;/body&gt;</code> tag of
              your website's HTML source code.
            </p>

            <p className="text-sm text-[#847971]">
              1. Add this script in your Next.js project
            </p>

            <pre
              className="
            bg-[rgba(55,50,47,0.04)]
            p-4
            rounded-xl
            border border-[rgba(50,45,43,0.12)]
            text-sm
            font-mono
            whitespace-pre-wrap
            overflow-auto
            text-[#37322F]
          "
            >
              {scriptCode}
            </pre>

            <button
              type="button"
              className={`
            px-4 py-2 rounded-[99px]
            text-sm font-medium text-[#FBFAF9]
            shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
            transition
            ${copy.copy && copy.id === 1
                  ? "bg-green-600"
                  : "bg-[#37322F] hover:bg-[#2e2a28]"
                }
          `}
              onClick={() => handleCopy(scriptCode, 1)}
            >
              {copy.copy && copy.id === 1 ? "Copied" : "Copy this code"}
            </button>

            <p className="text-sm text-[#847971] mt-4">
              Note: If you are using React, HTML, WordPress etc, please use the link
              below.
            </p>

            <pre
              className="
            bg-[rgba(55,50,47,0.04)]
            p-4
            rounded-xl
            border border-[rgba(50,45,43,0.12)]
            text-sm
            font-mono
            break-all
            overflow-auto
            text-[#37322F]
          "
            >
              {scriptCode2}
            </pre>

            <button
              type="button"
              className={`
            px-4 py-2 rounded-[99px]
            text-sm font-medium text-[#FBFAF9]
            shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
            transition
            ${copy.copy && copy.id === 2
                  ? "bg-green-600"
                  : "bg-[#37322F] hover:bg-[#2e2a28]"
                }
          `}
              onClick={() => handleCopy(scriptCode2, 2)}
            >
              {copy.copy && copy.id === 2 ? "Copied" : "Copy this code"}
            </button>
          </CardContent>
        </Card>
      ) : (
        <Card
          className="
        border border-dashed border-[rgba(50,45,43,0.20)]
        rounded-2xl
        bg-[rgba(255,255,255,0)]
      "
        >
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(55,50,47,0.08)]">
              🤖
            </div>

            <h3 className="text-lg font-medium text-[#37322F]">
              No chatbot created yet
            </h3>

            <p className="text-sm text-[#847971] max-w-sm">
              You need to create a chatbot before you can install it on your website.
              Once created, the installation script will appear here.
            </p>

            <button
              onClick={() => setActiveTab("overview")}
              className="
            mt-2
            inline-flex items-center
            rounded-[99px]
            bg-[#37322F]
            px-5 py-2
            text-sm font-medium
            text-[#FBFAF9]
            shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
            hover:bg-[#2e2a28]
            transition
          "
            >
              Create Chatbot
            </button>
          </CardContent>
        </Card>
      )}
    </div>

  );
}
