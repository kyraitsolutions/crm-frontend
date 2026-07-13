import { Card, CardContent } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Check, Copy, Bot, Code2, FileCode } from "lucide-react";

export default function ChatbotIntegration({ setActiveTab }: any) {
  const { accountId, chatBotId } = useParams();

  const [copiedId, setCopiedId] = useState<number | null>(null);

  const scriptCode = `<Script id="chatbot-config" strategy="afterInteractive">
  window.eazbotConfig = {
    accountId: "${accountId}",
    chatbotId: "${chatBotId}",
  };
</Script>

<Script
  src="https://chatbot.kyraitsolutions.com/widget/chatbot-script.js"
  strategy="afterInteractive"
/>`;

  const scriptCode2 = `<script>
  window.eazbotConfig = {
    accountId: "${accountId}",
    chatbotId: "${chatBotId}",
  };
</script>

<script src="https://chatbot.kyraitsolutions.com/widget/chatbot-script.js"></script>`;

  const handleCopy = async (script: string, id: number) => {
    try {
      await navigator.clipboard.writeText(script);
      toast.success("Copied!", {
        description: "Your script has been copied to clipboard.",
      });
      setCopiedId(id);
    } catch (error) {
      toast.error("Copy failed", {
        description:
          error instanceof Error ? error.message : "Unable to copy the script.",
      });
      setCopiedId(null);
    } finally {
      setTimeout(() => setCopiedId(null), 1500);
    }
  };

  const codeBlockStyle = {
    padding: "1.25rem",
    fontSize: "0.85rem",
    lineHeight: "1.6",
    margin: 0,
  };

  return (
    <div className="w-full space-y-6">
      {chatBotId ? (
        <Card className="shadow-sm">
          <CardContent className="space-y-8 px-6 py-6">
            {/* Header */}
            <div className="flex flex-col max-w-2xl">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                  <Code2
                    className="h-4.5 w-4.5 text-indigo-600"
                    strokeWidth={2}
                  />
                </div>
                <h2 className="text-xl font-semibold text-slate-900 tracking-tight">
                  Install the widget on your website
                </h2>
              </div>

              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                Copy and paste the snippet below just before the closing{" "}
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-slate-700">
                  &lt;/body&gt;
                </code>{" "}
                tag of your website's HTML.
              </p>

              <div className="my-5 h-px bg-slate-200" />

              <h3 className="text-sm font-medium text-slate-800">
                What this does
              </h3>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-600 list-none">
                {[
                  "Loads the chatbot widget on your website",
                  "Connects the widget to your account & chatbot ID",
                  "Fully compatible with React, Next.js, WordPress, or plain HTML",
                  "Shows a live preview as soon as it's installed",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Script 1 — React / Next.js */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    React / Next.js
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(scriptCode, 1)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium shadow-sm transition-colors cursor-pointer ${copiedId === 1
                      ? "bg-green-600 text-white"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                    }`}
                >
                  {copiedId === 1 ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy code
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-800/50 shadow-sm">
                <SyntaxHighlighter
                  language="jsx"
                  style={oneDark}
                  wrapLongLines
                  showLineNumbers
                  customStyle={codeBlockStyle}
                >
                  {scriptCode}
                </SyntaxHighlighter>
              </div>
            </div>

            {/* Script 2 — Plain HTML */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="h-4 w-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">
                    HTML / WordPress
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(scriptCode2, 2)}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium shadow-sm transition-colors cursor-pointer ${copiedId === 2
                      ? "bg-green-600 text-white"
                      : "bg-slate-900 text-white hover:bg-slate-700"
                    }`}
                >
                  {copiedId === 2 ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy code
                    </>
                  )}
                </button>
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-800/50 shadow-sm">
                <SyntaxHighlighter
                  language="html"
                  style={oneDark}
                  wrapLongLines
                  showLineNumbers
                  customStyle={codeBlockStyle}
                >
                  {scriptCode2}
                </SyntaxHighlighter>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center py-14 text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50">
              <Bot className="h-5 w-5 text-indigo-600" strokeWidth={2} />
            </div>

            <h3 className="text-lg font-medium text-slate-900">
              No chatbot created yet
            </h3>

            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
              Create a chatbot first, then come back here to grab the
              installation script for your website.
            </p>

            <button
              onClick={() => setActiveTab("overview")}
              className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Create chatbot
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// import { Card, CardContent } from "@/components/ui/card";
// import { useParams } from "react-router-dom";
// import { useState } from "react";
// import { toast } from "sonner";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// export default function ChatbotIntegration({ setActiveTab }: any) {
//   const { accountId, chatBotId } = useParams();

//   const [copy, setCopy] = useState({
//     id: 0,
//     copy: false,
//   });

//   const scriptCode = `<Script id="chatbot-config" strategy="afterInteractive">
//      window.eazbotConfig = { accountId: "${accountId}", chatbotId: "${chatBotId}" };
// </Script>

// <Script src="https://crm.kyraitsolutions.com/widget/chatbot-script.js" strategy="afterInteractive"/>`;

//   const scriptCode2 = `<script>
//      window.eazbotConfig = { accountId: "${accountId}", chatbotId: "${chatBotId}" };
// </script>

// <script src="https://crm.kyraitsolutions.com/widget/chatbot-script.js"></script>`;

//   const handleCopy = async (script: string, id: number) => {
//     try {
//       await navigator.clipboard.writeText(script);
//       toast.success("Copied!", {
//         description: "Your script has been copied to clipboard.",
//       });
//       setCopy({ id, copy: true });
//     } catch (error) {
//       toast.error("Copy failed", {
//         description:
//           error instanceof Error ? error.message : "Unable to copy the script.",
//       });
//       setCopy({ id: 0, copy: false });
//     } finally {
//       setTimeout(() => setCopy({ id: 0, copy: false }), 1200);
//     }
//   };

//   return (
//     <div className="w-full space-y-6">
//       {chatBotId ? (
//         <Card className="border-none rounded-2xl shadow-none px-0">
//           <CardContent className="space-y-6 px-2">
//             {/* Header */}
//             <div className="flex flex-col max-w-xl">
//               <h2 className="text-2xl font-semibold text-slate-900">
//                 1. Install the below code on your website
//               </h2>
//               <p className="mt-2 text-sm text-slate-500 leading-relaxed">
//                 Copy and paste the code before the closing{" "}
//                 <code className="font-mono text-slate-900">&lt;/body&gt;</code>{" "}
//                 tag of your website’s HTML.
//               </p>

//               <div className="my-4 h-px bg-slate-200" />

//               <h3 className="text-base font-medium text-slate-800">
//                 What this does
//               </h3>
//               <ul className="mt-2 space-y-2 text-sm text-slate-600 list-none">
//                 <li className="flex items-start gap-2">
//                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
//                   Loads the chatbot widget on your website
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
//                   Connects the widget to your account & chatbot ID
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
//                   Fully compatible with React, Next.js, WordPress, or plain HTML
//                 </li>
//                 <li className="flex items-start gap-2">
//                   <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
//                   Instant live preview after installation
//                 </li>
//               </ul>
//             </div>

//             {/* Script 1 */}
//             <div className="space-y-2">
//               <SyntaxHighlighter
//                 language="jsx"
//                 style={oneDark}
//                 wrapLines
//                 showLineNumbers
//                 className="rounded-xl overflow-auto"
//               >
//                 {scriptCode}
//               </SyntaxHighlighter>

//               <button
//                 type="button"
//                 onClick={() => handleCopy(scriptCode, 1)}
//                 className={`px-4 py-2 text-sm cursor-pointer rounded-full font-medium shadow transition ${
//                   copy.copy && copy.id === 1
//                     ? "bg-green-600"
//                     : "bg-gray-200 text-slate-700 hover:bg-slate-800 hover:text-white"
//                 }`}
//               >
//                 {copy.copy && copy.id === 1 ? "Copied" : "Copy this code"}
//               </button>
//             </div>

//             {/* Script 2 */}
//             <div className="space-y-2">
//               <SyntaxHighlighter
//                 language="html"
//                 style={oneDark}
//                 wrapLines
//                 showLineNumbers
//                 className="rounded-xl overflow-auto"
//               >
//                 {scriptCode2}
//               </SyntaxHighlighter>

//               <button
//                 type="button"
//                 onClick={() => handleCopy(scriptCode2, 2)}
//                 className={`px-4 py-2 text-sm cursor-pointer rounded-full  font-medium shadow transition ${
//                   copy.copy && copy.id === 2
//                     ? "bg-green-600"
//                     : "bg-gray-200 text-slate-700 hover:bg-slate-800 hover:text-white"
//                 }`}
//               >
//                 {copy.copy && copy.id === 2 ? "Copied" : "Copy this code"}
//               </button>
//             </div>
//           </CardContent>
//         </Card>
//       ) : (
//         <Card className="border border-dashed border-[rgba(50,45,43,0.20)] rounded-2xl bg-transparent">
//           <CardContent className="flex flex-col items-center justify-center py-12 text-center space-y-4">
//             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(55,50,47,0.08)]">
//               🤖
//             </div>

//             <h3 className="text-lg font-medium text-slate-900">
//               No chatbot created yet
//             </h3>

//             <p className="text-sm text-slate-500 max-w-sm">
//               You need to create a chatbot before you can install it on your
//               website. Once created, the installation script will appear here.
//             </p>

//             <button
//               onClick={() => setActiveTab("overview")}
//               className="mt-2 inline-flex items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow hover:bg-slate-800 transition"
//             >
//               Create Chatbot
//             </button>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
