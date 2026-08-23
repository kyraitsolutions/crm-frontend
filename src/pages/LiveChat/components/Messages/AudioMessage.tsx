import { useAuthStore } from "@/stores";
import type { TMessage } from "../../types/message.type";
import { getWhatsappMediaUrl } from "../../utils/getWhatsappMediaUrl";

type TAudioMessageProps = {
  message: TMessage;
};

const AudioMessage = ({ message }: TAudioMessageProps) => {
  // const [videoLoaded, setVideoLoaded] = useState(false);
  const accountId = useAuthStore((state) => state.accountId);

  if (message.type !== "audio") return null;

  const audioLink = message?.media?.audio?.id
    ? `${getWhatsappMediaUrl(String(accountId), message.media?.audio?.id)}`
    : message.media?.audio?.link || "";

  if (!audioLink) return null;

  return (
    <div className="overflow-hidden rounded-2xl w-full">
      <audio src={audioLink} controls>
        Your browser does not support audio playback.
      </audio>
    </div>
  );
};

export default AudioMessage;
