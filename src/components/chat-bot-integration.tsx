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

  const scriptCode2 = `
<script> window.eazbotConfig = {accountId:"${accountId}",chatbotId:"${chatBotId}"};</script>

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
      {/* Section 1 */}
      {chatBotId ? (
        <Card className="shadow-lg">
          <CardContent className="space-y-4">
            <h2 className="text-md font-semibold">
              1. Install the below code on your website to start using your
              Chatbot
            </h2>
            <p className="text-sm text-gray-600">
              Copy and paste the code right before the closing{" "}
              <code>&lt;/body&gt;</code> tag of your website's HTML source code.
            </p>

            <p className="text-sm text-gray-600">
              1. Add this script in your Next js project
            </p>
            <pre className="bg-muted p-4 rounded-xl border text-sm font-mono whitespace-pre-wrap overflow-auto">
              {scriptCode}
            </pre>
            <p
              className={`${
                copy.copy && copy.id == 1 ? "bg-green-600" : "bg-gray-600"
              }  w-fit  px-3 py-2  rounded  text-white text-sm mt-2 cursor-pointer`}
              onClick={() => handleCopy(scriptCode, 1)}
            >
              {copy.copy && copy.id == 1 ? "Copied" : "Copy this code"}
            </p>

            <p className="text-sm  text-gray-600 mt-4">
              Note: If you are using React,HTML, WordPress etc, please use the
              link below.
            </p>

            <pre className="bg-muted p-4 rounded-xl border text-sm font-mono break-all overflow-auto">
              {scriptCode2}
            </pre>
            <p
              className={`${
                copy.copy && copy.id == 2 ? "bg-green-600" : "bg-gray-600"
              }  w-fit  px-3 py-2  rounded  text-white text-sm mt-2 cursor-pointer`}
              onClick={() => handleCopy(scriptCode2, 2)}
            >
              {copy.copy && copy.id == 2 ? "Copied" : "Copy this code"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              🤖
            </div>

            <h3 className="text-lg font-semibold">No chatbot created yet</h3>

            <p className="text-sm text-muted-foreground max-w-sm">
              You need to create a chatbot before you can install it on your
              website. Once created, the installation script will appear here.
            </p>

            <button
              onClick={() => setActiveTab("overview")}
              className="mt-2 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Chatbot
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
