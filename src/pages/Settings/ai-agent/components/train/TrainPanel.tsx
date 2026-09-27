import { useLayoutEffect, useRef, useState } from "react";
import { ToastMessageService } from "@/services";
import { useAuthStore } from "@/stores";
import clsx from "clsx";
import { Bot, RotateCcw } from "lucide-react";
import { MdSend } from "react-icons/md";
import { aiAgentStudioService } from "../../services/ai-agent.service";
import { useAiAgentStudioStore } from "../../store/ai-agent.store";
import InteractiveReply from "./InteractiveReply";
import type { TAgentInteractive, TRuntimeMessage, TRuntimeTestResult } from "../../types/ai-agent.type";

const toast = new ToastMessageService();

const STARTERS = [
  "Hi, I have a question",
  "I want to book an appointment",
  "Can I speak to a person?",
];

type ChatItem = TRuntimeMessage & {
  id: string;
  at: number;
  failed?: boolean;
  interactive?: TAgentInteractive | null;
  image?: { link: string } | null;
  meta?: Pick<TRuntimeTestResult, "detectedIntent" | "latencyMs" | "shouldHandoff" | "routeTaken">;
};

const formatTime = (at: number) =>
  new Date(at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const TypingDots = () => (
  <div className="flex items-end gap-2">
    <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
      <Bot size={12} />
    </div>
    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-white px-3 py-2.5 ring-1 ring-slate-200/80">
      <span className="size-1.5 rounded-full bg-slate-400 animate-bounce" />
      <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:150ms]" />
      <span className="size-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

const TrainPanel = () => {
  const { accountId } = useAuthStore();
  const agentName = useAiAgentStudioStore(
    (state) => state.config.identity.name || state.agent?.name || "Chat agent",
  );
  const greeting = useAiAgentStudioStore((state) => state.config.identity.greeting);

  const [mode, setMode] = useState<"train" | "live">("train");
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<ChatItem[]>([]);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDraft = mode === "train";
  const canSend = Boolean(input.trim()) && !sending && Boolean(accountId);
  const intro =
    greeting?.trim() || `Hi, I’m ${agentName}. How can I help you today?`;

  useLayoutEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, sending]);

  const resetThread = () => {
    setMessages([]);
    setThreadId("");
    setInput("");
    inputRef.current?.focus();
  };

  const send = async (preset?: string, selectionId?: string) => {
    const text = (preset ?? input).trim();
    if (!text || !accountId || sending) return;
    const history = messages.map(({ role, content }) => ({ role, content }));
    const userMsg: ChatItem = {
      id: `${Date.now()}-user`,
      role: "user",
      content: text,
      at: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);
    try {
      const response = await aiAgentStudioService.testRuntime(String(accountId), {
        message: text,
        useDraft: isDraft,
        threadId: threadId || undefined,
        selectionId,
        history,
      });
      const doc = response.data?.doc;
      if (doc?.threadId) setThreadId(doc.threadId);
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          content: doc?.assistantMessage || "No reply",
          interactive: doc?.interactive,
          image: doc?.image,
          at: Date.now(),
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
      setMessages((prev) =>
        prev.map((msg) => (msg.id === userMsg.id ? { ...msg, failed: true } : msg)),
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <aside className="flex h-full w-90 shrink-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <header className="shrink-0 border-b border-slate-100 bg-white px-3.5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-primary text-white">
            <Bot size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="truncate text-sm font-semibold text-slate-900">{agentName}</h3>
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />
            </div>
            <p className="truncate text-[11px] text-slate-400">
              {isDraft ? "Draft preview" : "Live preview"} · not sent on WhatsApp
            </p>
          </div>
          <div className="flex items-center gap-1">
            <div className="flex rounded-2xl bg-slate-100 p-0.5">
              {(["train", "live"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => {
                    setMode(item);
                    resetThread();
                  }}
                  className={clsx(
                    "cursor-pointer rounded-xl px-2.5 py-1 text-[11px] font-medium transition-colors",
                    mode === item
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700",
                  )}
                >
                  {item === "train" ? "Draft" : "Live"}
                </button>
              ))}
            </div>
            <button
              type="button"
              title="Clear chat"
              onClick={resetThread}
              disabled={!messages.length && !threadId}
              className="cursor-pointer rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={scrollerRef}
        className="hide-scrollbar min-h-0 flex-1 overflow-y-auto bg-[linear-gradient(180deg,#fff8fa_0%,#f6f4f5_48%,#f3f4f6_100%)] px-3.5 py-4"
      >
        <div className="flex flex-col gap-2.5">
          <div className="flex items-end gap-2">
            <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <Bot size={12} />
            </div>
            <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-white px-3 py-2 text-[13px] leading-5 text-slate-800 ring-1 ring-slate-200/70">
              {intro}
            </div>
          </div>

          {!messages.length && !sending ? (
            <div className="ml-8 flex flex-col items-start gap-1.5">
              {STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => void send(starter)}
                  className="cursor-pointer rounded-2xl border border-slate-200 bg-white px-3 py-1.5 text-left text-[12px] text-slate-600 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {starter}
                </button>
              ))}
            </div>
          ) : null}

          {messages.length ? (
            <div className="flex justify-center py-1">
              <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-medium text-slate-500 shadow-sm">
                Today
              </span>
            </div>
          ) : null}

          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={clsx("flex items-end gap-2", isUser ? "justify-end" : "justify-start")}
              >
                {!isUser ? (
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
                    <Bot size={12} />
                  </div>
                ) : null}
                <div
                  className={clsx(
                    "flex flex-col",
                    isUser ? "max-w-[82%] items-end" : "items-start",
                    !isUser && msg.interactive?.type === "carousel" ? "w-[88%] max-w-[88%]" : "max-w-[82%]",
                  )}
                >
                  <div
                    className={clsx(
                      "px-3 pt-2 pb-1 text-[13px] leading-5 wrap-break-word whitespace-pre-wrap",
                      isUser
                        ? "rounded-2xl rounded-br-md bg-primary text-white"
                        : "rounded-2xl rounded-bl-md bg-white text-slate-800 ring-1 ring-slate-200/70",
                      msg.failed && "opacity-70",
                    )}
                  >
                    {msg.image?.link ? (
                      <img src={msg.image.link} alt="" className="mb-2 max-h-40 w-full rounded-lg object-cover" />
                    ) : null}
                    {msg.interactive?.header?.text ? (
                      <p className="mb-1 text-[12px] font-semibold text-slate-900">
                        {msg.interactive.header.text}
                      </p>
                    ) : null}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                    {msg.interactive?.footer?.text ? (
                      <p className="mt-1 text-[11px] text-slate-400">{msg.interactive.footer.text}</p>
                    ) : null}
                    {!isUser ? (
                      <InteractiveReply
                        interactive={msg.interactive}
                        disabled={sending}
                        onChoose={(title, id) => void send(title, id)}
                      />
                    ) : null}
                    <p
                      className={clsx(
                        "mt-1 text-right text-[10px] leading-4",
                        isUser ? "text-white/70" : "text-slate-400",
                      )}
                    >
                      {formatTime(msg.at)}
                      {msg.failed ? " · failed" : ""}
                    </p>
                  </div>
                  {msg.meta ? (
                    <p className="mt-1 max-w-full truncate px-0.5 text-[10px] text-slate-500">
                      {msg.meta.detectedIntent || "general"}
                      {msg.meta.routeTaken ? ` · ${msg.meta.routeTaken}` : ""}
                      {msg.meta.latencyMs ? ` · ${msg.meta.latencyMs}ms` : ""}
                      {msg.meta.shouldHandoff ? " · handoff" : ""}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}

          {sending ? <TypingDots /> : null}
        </div>
      </div>

      <div className="shrink-0 border-t border-slate-100 bg-white px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            id="ai-agent-train-input"
            value={input}
            placeholder="Type a message"
            disabled={sending}
            className="input-field h-10 min-w-0 flex-1 border bg-white px-3.5 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-60"
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSend) void send();
              }
            }}
          />
          <button
            type="button"
            disabled={!canSend}
            className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-2xl bg-primary text-white transition-opacity disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={() => void send()}
          >
            <MdSend size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default TrainPanel;
