import { Send, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type ChatMessage = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    sender: "bot",
    text: "Hi there! 👋 Welcome to Kyra IT Solutions.",
  },
  {
    id: 2,
    sender: "bot",
    text: "I’m here to help you with services, pricing, or a quick demo.",
  },
  {
    id: 3,
    sender: "user",
    text: "I’m looking for a chatbot for my website.",
  },
  {
    id: 4,
    sender: "bot",
    text: "Great choice! 🤖 We build AI-powered chatbots tailored to your business.",
  },
  {
    id: 5,
    sender: "user",
    text: "Can it answer customer questions automatically?",
  },
  {
    id: 6,
    sender: "bot",
    text: "Absolutely! It can handle FAQs, capture leads, and route chats to your team.",
  },
  {
    id: 7,
    sender: "user",
    text: "Nice! How do I get started?",
  },
  {
    id: 8,
    sender: "bot",
    text: "Just share a few details, and we’ll set up a demo for you 🚀",
  },
];

export default function ChatbotPreview() {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { watch } = useFormContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const backgroundColor = watch("theme.backgroundColor");
  const messageColor = watch("theme.messageColor");
  const userMessageColor = watch("theme.userMessageColor");
  const showBranding = watch("config.showBranding");
  const brandingLabelText = watch("config.brandLabelText");
  const title = watch("name");

  // Simulate chat flow
  useEffect(() => {
    let index = 0;
    setMessages([]);

    const interval = setInterval(() => {
      const msg = DEMO_MESSAGES[index];

      if (msg.sender === "bot") {
        setIsTyping(true);

        setTimeout(() => {
          setMessages((prev) => [...prev, msg]);
          setIsTyping(false);
        }, 700);
      } else {
        setMessages((prev) => [...prev, msg]);
      }

      index++;
      if (index === DEMO_MESSAGES.length) clearInterval(interval);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (

    <div className="flex items-center justify-center">
      <div className="flex flex-col w-[360px] h-[560px] rounded-xl shadow-xl bg-white overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center border justify-between px-4 py-3 text-white"
          style={{ backgroundColor, border: backgroundColor }}
        >
          <span className="font-medium">{title || "Chatbot"}</span>
          <X className="w-4 h-4 opacity-80" />
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto bg-[#FAFAFA] hide-scrollbar">
          <AnimatePresence>
            {messages?.map((msg) => (
              <motion.div
                key={msg?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`max-w-[80%]  px-4 py-2 text-sm rounded-xl ${msg?.sender === "user"
                  ? "ml-auto  text-white"
                  : "bg-gray-100"
                  }`}
                style={{
                  backgroundColor:
                    msg?.sender === "user" ? backgroundColor : "#fff",
                  color:
                    msg?.sender === "user"
                      ? userMessageColor
                      : messageColor,
                }}
              >
                {msg?.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t p-3 flex items-center gap-2">
          <input
            disabled
            placeholder="Type a message..."
            className="flex-1 text-sm bg-transparent outline-none"
          />
          <button
            className="h-9 w-9 rounded-full flex items-center justify-center text-white"
            style={{ backgroundColor }}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer */}
        {showBranding && (
          <div className="text-center text-[10px] text-slate-400 py-1">
            {brandingLabelText || "Proudly by Kyra IT Solutions"}
          </div>
        )}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-2 bg-[#EEF2FF] rounded-2xl w-fit">
      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:150ms]" />
      <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:300ms]" />
    </div>
  );
}
