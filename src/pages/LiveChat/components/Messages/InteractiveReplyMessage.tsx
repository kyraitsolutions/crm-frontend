import type { TMessage } from "../../types/message.type";

type InteractiveReplyMessageProps = {
  message: TMessage;
};

function getInteractiveReply(message: TMessage) {
  if (message.type !== "interactive") return null;

  const interactive = message.interactive;
  if (!interactive) return null;

  if (interactive.type === "list_reply") {
    return {
      title: interactive.list_reply?.title,
      description: interactive.list_reply?.description || "",
    };
  }

  if (interactive.type === "button_reply") {
    return {
      title: interactive.button_reply?.title ,
      description: "",
    };
  }

  if (interactive.type === "nfm_reply") {
    return {
      title:
        interactive.nfm_reply?.body ||
        interactive.nfm_reply?.name ||
        "Form reply",
      description: "",
    };
  }

  // return {
  //   title: message.body?.text || "",
  //   description: "",
  // };
}

const InteractiveReplyMessage = ({ message }: InteractiveReplyMessageProps) => {
  const reply = getInteractiveReply(message);
  if (!reply?.title) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm leading-relaxed wrap-break-word">{reply.title}</p>
      {reply.description ? (
        <p className="text-xs leading-relaxed text-slate-500 wrap-break-word">
          {reply.description}
        </p>
      ) : null}
    </div>
  );
};

export default InteractiveReplyMessage;
