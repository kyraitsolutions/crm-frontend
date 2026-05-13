import type { TMessage } from "../../types/message.type";
import InteractiveButtonMessage from "./InteractiveButtonMessage";
import InteractiveCarouselMessage from "./InteractiveCarouselMessage";
import InteractiveListMessage from "./InteractiveListMessage";

type TInteractiveMessage = {
  message: TMessage;
  onButtonClick?: ({
    id,
    title,
  }: {
    id: string;
    title: string;
    messageId: string;
  }) => void;
};

const InteractiveMessage = ({
  message,
  onButtonClick,
}: TInteractiveMessage) => {
  const interactive =
    message.type === "interactive" ? message?.interactive : null;

  switch (interactive?.type) {
    case "button":
      return (
        <InteractiveButtonMessage
          message={message}
          onButtonClick={onButtonClick}
        />
      );

    case "list":
      return (
        <InteractiveListMessage
          message={message}
          onButtonClick={onButtonClick}
        />
      );

    case "carousel":
      return <InteractiveCarouselMessage message={message} />;

    default:
      return null;
  }
};

export default InteractiveMessage;
