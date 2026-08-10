import { Button } from "@/components/ui/button";
import { formatTime } from "@/utils/date-utils";
import { AlertCircle, Check, CheckCheck, User, X } from "lucide-react";
import type { ReactNode } from "react";

interface MessageWraperProps {
  children: ReactNode;
  isIncoming: boolean;
  timestamp?: string;
  status?: string;
  error?: {
    code?: number;
    title?: string;
    message?: string;
    details?: string;
  };
  onRetry?: () => void;
}

const MessageWrapper = ({
  children,
  isIncoming,
  timestamp,
  status,
  error,
  onRetry,
}: MessageWraperProps) => {
  const renderStatus = () => {
    if (isIncoming || !status) return null;

    switch (status) {
      case "sent":
        return <Check size={16} />;

      case "delivered":
        return <CheckCheck size={16} />;

      case "read":
        return <CheckCheck size={16} className="text-primary" />;

      case "failed":
        return <AlertCircle size={16} className="text-red-500" />;

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex gap-1.5 ${isIncoming ? "justify-start" : "justify-end"}`}
    >
      {/* LEFT AVATAR */}
      {isIncoming && (
        <div className="size-7 rounded-full flex items-center justify-center shrink-0 shadow-md bg-primary text-white">
          <User size={14} />
        </div>
        // <Avatar className="h-9 w-9 shrink-0">
        //   <AvatarImage src="https://ai-avatar-generator.com/avatars3/nature.png" />
        //   <AvatarFallback>U</AvatarFallback>
        // </Avatar>
      )}

      <div
        className={`flex flex-col px-3 pt-3 pb-1 rounded-2xl text-sm leading-relaxed max-w-80 w-fit text-slate-900 border border-primary/20  ${
          isIncoming
            ? "bg-white border border-gray-200 rounded-tl-sm"
            : "bg-white/60 rounded-tr-sm"
        }`}
      >
        {children}

        {error && status === "failed" && (
          <div className="mt-2 rounded-xl bg-red-50 border border-red-200 p-2">
            <p className="text-xs font-medium text-red-500 flex items-center gap-2">
              Failed to send <X size={14} />
            </p>

            <p className="text-[10px] text-red-600 mt-1">
              {error.details || error.message}
            </p>

            <div className="flex justify-end">
              <Button
                onClick={() => onRetry?.()}
                className="actions-btn text-xs! px-4! bg-red-200! text-red-500!"
              >
                Retry
              </Button>
            </div>
          </div>
        )}

        {timestamp && (
          <div className="flex gap-2 justify-end items-center">
            <span
              className={`text-right text-xs font-semibold mt-2 text-gray-500 inline-block`}
            >
              {formatTime(timestamp)}
            </span>

            <div className="mt-2">{renderStatus()}</div>
          </div>
        )}
      </div>

      {/* RIGHT AVATAR */}
      {/* {!isIncoming && (
        <div>
          <Bot />
        </div>
        // <Avatar className="size-7 shrink-0">
        //   <AvatarFallback className="bg-primary text-xs text-white">
        //     B
        //   </AvatarFallback>
        // </Avatar>
      )} */}
    </div>
  );
};

export default MessageWrapper;
