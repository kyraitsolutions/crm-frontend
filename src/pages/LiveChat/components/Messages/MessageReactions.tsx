import type { TMessage } from "../../types/message.type";

const MessageReactions = ({
    reactions,
  }: {
    reactions?: TMessage["reactions"];
  }) => {

    console.log("reactions", reactions);
    if (!reactions?.length) return null;
  
    return (
      <div className="relative top-4 flex w-fit gap-1 rounded-full border bg-background text-sm shadow-sm">
        {reactions.map((r, i) => (
          <span key={i}>{r.emoji}</span>
        ))}
      </div>
    );
  };
  
  export default MessageReactions;