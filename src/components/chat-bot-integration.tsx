import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ChatbotIntegration({ setActiveTab }: any) {
  const { accountId, chatBotId } = useParams();

  const [copy, setCopy] = useState({
    id: 0,
    copy: false,
  });

  const scriptCode = `<Script id="chatbot-config" strategy="afterInteractive">
     window.eazbotConfig = { accountId: "${accountId}", chatbotId: "${chatBotId}" };
</Script>

<Script src="https://crm.kyraitsolutions.com/widget/chatbot.js" strategy="afterInteractive"/>`;

  const scriptCode2 = `<script>
     window.eazbotConfig = { accountId: "${accountId}", chatbotId: "${chatBotId}" };
</script>

<script src="https://crm.kyraitsolutions.com/widget/chatbot.js"></script>`;

  const handleCopy = async (script: string, id: number) => {
    try {
      await navigator.clipboard.writeText(script);
      toast.success("Copied!", {
        description: "Your script has been copied to clipboard.",
      });
      setCopy({ id, copy: true });
    } catch (error) {
      toast.error("Copy failed", {
        description:
          error instanceof Error ? error.message : "Unable to copy the script.",
      });
      setCopy({ id: 0, copy: false });
    } finally {
      setTimeout(() => setCopy({ id: 0, copy: false }), 1200);
    }
  };

  return (
    <div className="w-full space-y-6">
      {chatBotId ? (
        <Card className="border-none rounded-2xl shadow-none px-0">
          <CardContent className="space-y-6 px-2">
            {/* Header */}
            <div className="flex flex-col max-w-xl">
              <h2 className="text-2xl font-semibold text-slate-900">
                1. Install the below code on your website
              </h2>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                Copy and paste the code before the closing{" "}
                <code className="font-mono text-slate-900">&lt;/body&gt;</code>{" "}
                tag of your website’s HTML.
              </p>

              <div className="my-4 h-px bg-slate-200" />

              <h3 className="text-base font-medium text-slate-800">
                What this does
              </h3>
              <ul className="mt-2 space-y-2 text-sm text-slate-600 list-none">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Loads the chatbot widget on your website
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Connects the widget to your account & chatbot ID
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Fully compatible with React, Next.js, WordPress, or plain HTML
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                  Instant live preview after installation
                </li>
              </ul>
            </div>

            {/* Script 1 */}
            <div className="space-y-2">
              <SyntaxHighlighter
                language="jsx"
                style={oneDark}
                wrapLines
                showLineNumbers
                className="rounded-xl overflow-auto"
              >
                {scriptCode}
              </SyntaxHighlighter>

              <button
                type="button"
                onClick={() => handleCopy(scriptCode, 1)}
                className={`px-4 py-2 text-sm cursor-pointer rounded-full font-medium shadow transition ${
                  copy.copy && copy.id === 1
                    ? "bg-green-600"
                    : "bg-gray-200 text-slate-700 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {copy.copy && copy.id === 1 ? "Copied" : "Copy this code"}
              </button>
            </div>

            {/* Script 2 */}
            <div className="space-y-2">
              <SyntaxHighlighter
                language="html"
                style={oneDark}
                wrapLines
                showLineNumbers
                className="rounded-xl overflow-auto"
              >
                {scriptCode2}
              </SyntaxHighlighter>

              <button
                type="button"
                onClick={() => handleCopy(scriptCode2, 2)}
                className={`px-4 py-2 text-sm cursor-pointer rounded-full  font-medium shadow transition ${
                  copy.copy && copy.id === 2
                    ? "bg-green-600"
                    : "bg-gray-200 text-slate-700 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {copy.copy && copy.id === 2 ? "Copied" : "Copy this code"}
              </button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-dashed border-[rgba(50,45,43,0.20)] rounded-2xl bg-transparent">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(55,50,47,0.08)]">
              🤖
            </div>

            <h3 className="text-lg font-medium text-slate-900">
              No chatbot created yet
            </h3>

            <p className="text-sm text-slate-500 max-w-sm">
              You need to create a chatbot before you can install it on your
              website. Once created, the installation script will appear here.
            </p>

            <button
              onClick={() => setActiveTab("overview")}
              className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 transition"
            >
              Create Chatbot
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
