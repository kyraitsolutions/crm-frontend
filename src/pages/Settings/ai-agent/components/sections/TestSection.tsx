import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import { aiAgentStudioService } from "../../services/ai-agent.service";
import InteractiveReply from "../train/InteractiveReply";
import type { TAgentInteractive, TRuntimeMessage, TRuntimeTestResult } from "../../types/ai-agent.type";

const toast = new ToastMessageService();

type ChatItem = TRuntimeMessage & {
  interactive?: TAgentInteractive | null;
  image?: { link: string } | null;
  meta?: Pick<TRuntimeTestResult, "detectedIntent" | "latencyMs" | "shouldHandoff" | "routeTaken">;
};

const TestSection = () => {
  const { accountId } = useAuthStore();
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([]);

  const send = async (preset?: string, selectionId?: string) => {
    const text = (preset ?? input).trim();
    if (!text || !accountId || sending) return;
    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    try {
      const response = await aiAgentStudioService.testRuntime(String(accountId), {
        message: text,
        useDraft: true,
        threadId: threadId || undefined,
        selectionId,
        history,
      });
      const doc = response.data?.doc;
      if (doc?.threadId) setThreadId(doc.threadId);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: doc?.assistantMessage || "No reply",
          interactive: doc?.interactive,
          image: doc?.image,
          meta: {
            detectedIntent: doc?.detectedIntent || null,
            latencyMs: doc?.latencyMs || 0,
            shouldHandoff: Boolean(doc?.shouldHandoff),
            routeTaken: doc?.routeTaken || null,
          },
        },
      ]);
    } catch (error: any) {
      toast.error(error?.message || "Test run failed");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="rounded-2xl bg-white p-6 space-y-4">
      <div>
        <h2 className="font-medium text-[#111827]">Test console</h2>
        <p className="text-sm text-slate-500 mt-1">
          Talk to the draft agent. This does not send WhatsApp messages.
        </p>
      </div>
      <div className="h-96 overflow-y-auto space-y-3 rounded-xl bg-slate-50 p-4">
        {messages.map((msg, index) => (
          <div key={index} className={msg.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-white"
                  : "bg-white text-slate-800 border border-slate-100"
              }`}
            >
              {msg.image?.link ? (
                <img src={msg.image.link} alt="" className="mb-2 max-h-40 w-full rounded-lg object-cover" />
              ) : null}
              {msg.interactive?.header?.text ? (
                <p className="mb-1 text-xs font-semibold">{msg.interactive.header.text}</p>
              ) : null}
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.interactive?.footer?.text ? (
                <p className="mt-1 text-xs text-slate-400">{msg.interactive.footer.text}</p>
              ) : null}
              {msg.role === "assistant" ? (
                <InteractiveReply
                  interactive={msg.interactive}
                  disabled={sending}
                  onChoose={(title, id) => void send(title, id)}
                />
              ) : null}
            </div>
            {msg.meta ? (
              <p className="mt-1 text-xs text-slate-400">
                {msg.meta.detectedIntent || "intent"} · {msg.meta.routeTaken || "route"} ·{" "}
                {msg.meta.latencyMs}ms
                {msg.meta.shouldHandoff ? " · handoff" : ""}
              </p>
            ) : null}
          </div>
        ))}
        {!messages.length ? (
          <p className="text-sm text-slate-400">Send a message to try the draft agent.</p>
        ) : null}
      </div>
      <div className="flex gap-2">
        <Input
          className="rounded-xl"
          value={input}
          placeholder="Type a test message..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void send();
          }}
        />
        <Button className="rounded-xl" disabled={sending} onClick={() => void send()}>
          {sending ? "Sending..." : "Send"}
        </Button>
      </div>
    </section>
  );
};

export default TestSection;
