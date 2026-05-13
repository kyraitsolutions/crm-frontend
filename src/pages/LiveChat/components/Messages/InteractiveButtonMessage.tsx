import type { THeader } from "@/components/chatFlowEditior/types/types";
import { getDocumentMeta } from "@/components/chatFlowEditior/utils/getDocumentMeta";
import { Download, ExternalLink, Reply } from "lucide-react";
import { Link } from "react-router-dom";
import type { TMessage } from "../../types/message.type";

type TInteractiveButtonMessage = {
  message: TMessage;
  wrapperClass?: string;
  commonClass?: string;
  theme?: {
    backgroundColor?: string;
    color?: string;
  };
  isBot?: boolean;
  onButtonClick?: ({
    id,
    title,
  }: {
    id: string;
    title: string;
    messageId: string;
  }) => void;
};
const InteractiveButtonMessage = ({
  message,
  onButtonClick,
}: TInteractiveButtonMessage) => {
  const interactive =
    message?.type === "interactive" && message?.interactive?.type === "button"
      ? message?.interactive
      : null;

  if (!interactive) return null;

  // const isIncoming = message.from === "user";

  const { header, body, footer, action } = interactive;

  /** ---------- HEADER ---------- */
  const renderHeader = (header: THeader) => {
    if (!header) return null;
    const { type, text, image, video, document } = header;

    switch (type) {
      case "image":
        return image?.link ? (
          <div className="w-full aspect-[4/2.5] overflow-hidden rounded-xl bg-black/5">
            <img
              src={image?.link}
              alt="image"
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-black/5 h-40" />
        );

      case "video":
        return video?.link ? (
          <div className="overflow-hidden rounded-xl bg-black">
            <video
              src={video.link}
              controls
              muted
              className="block w-full"
            ></video>
          </div>
        ) : null;

      case "document": {
        const doc = getDocumentMeta(document?.link || "");
        const Icon = doc?.icon;

        const fileName = decodeURIComponent(
          document?.link?.split("/").pop() || "Document",
        );

        return (
          <div className="rounded-xl flex flex-col items-center justify-center gap-3 border p-2 bg-gray-100">
            <div
              style={{
                backgroundColor: doc?.badgeBg || "#ffffff",
                color: doc?.badgeText || "#000000",
              }}
              className="size-16 rounded-2xl flex items-center justify-center shadow-sm"
            >
              {Icon && <Icon className="size-5" />}
            </div>

            <div className="text-center space-y-1 px-4">
              <p className="text-sm font-medium">{doc?.label || "Document"}</p>

              <p className="text-xs break-words max-w-[220px] text-gray-600">
                {fileName}
              </p>
            </div>

            <a download href={document?.link} className="shrink-0">
              <Download className="size-5 text-blue-500" />
            </a>
          </div>
        );
      }
      case "text":
      default:
        return text ? (
          <div className="text-sm font-semibold text-gray-900">{text}</div>
        ) : null;
    }
  };

  /** ---------- BUTTONS ---------- */
  const renderButtons = () => {
    // if (type !== "button" || !Array.isArray(action?.buttons)) return null;
    const buttons = action && "buttons" in action ? action.buttons : null;
    const urlButton =
      action && "parameters" in action ? action.parameters : null;

    return (
      <div className="flex flex-col divide-y divide-black/10">
        {buttons &&
          buttons?.length > 0 &&
          buttons.map((b, i: number) => {
            const reply = b.type === "reply" ? b.reply : null;
            if (!reply) return null;
            return (
              <button
                key={reply.id || i}
                type="button"
                onClick={() =>
                  onButtonClick?.({
                    id: reply.id,
                    title: reply.title,
                    messageId: message?.messageId,
                  })
                }
                className="flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-sky-600 transition cursor-pointer"
              >
                <Reply />
                {reply.title}
              </button>
            );
          })}

        {urlButton && (
          <Link
            className="flex items-center justify-center gap-1 px-3 py-2.5 text-sm font-medium text-sky-600 transition  hover:bg-sky-100 cursor-pointer"
            to={urlButton?.url}
            target="_blank"
          >
            <ExternalLink size={18} /> {urlButton?.display_text}
          </Link>
        )}
      </div>
    );
  };

  return (
    <div
    // className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-100 w-full border border-primary/30 text-slate-900 ${isIncoming ? "bg-white  rounded-tl-sm" : "bg-white/60  rounded-tr-sm"}`}
    >
      {/* Header */}
      {header && (
        <div className="overflow-x-hidden">{renderHeader(header)}</div>
      )}

      {/* Body + footer */}
      {(body?.text || footer?.text) && (
        <div className="space-y-1 px-3 pb-2 pt-1">
          {body?.text && (
            <pre className="whitespace-pre-wrap leading-snug  font-medium text-sm">
              {body.text}
            </pre>
          )}

          {footer?.text && (
            <p className="text-xs text-gray-400 border-t border-gray-200 mt-4 pt-2">
              {footer.text}
            </p>
          )}
        </div>
      )}

      {/* Buttons */}
      {renderButtons()}
    </div>
  );
};

export default InteractiveButtonMessage;
