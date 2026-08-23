import { useAuthStore } from "@/stores";
import type { TMessage } from "../../types/message.type";
import { getWhatsappMediaUrl } from "../../utils/getWhatsappMediaUrl";

type TVideoMessageProps = {
  message: TMessage;
};

const VideoMessage = ({ message }: TVideoMessageProps) => {
  // const [videoLoaded, setVideoLoaded] = useState(false);
  const accountId = useAuthStore((state) => state.accountId);

  if (message.type !== "video") return null;
  const videoLink = message?.media?.video?.id
    ? `${getWhatsappMediaUrl(String(accountId), message.media?.video?.id)}`
    : message.media?.video?.link || "";

  if (!videoLink) return null;

  return (
    <div>
      {/* VIDEO */}
      <div className="overflow-hidden rounded-2xl ">
        {/* {!videoLoaded && videoLink && (
          <div className="w-60 h-36 object-cover rounded-2xl animate-pulse bg-gray-200" />
        )} */}
        <video
          controls
          playsInline
          preload="metadata"
          // onLoad={() => setVideoLoaded(true)}
          // onError={() => setVideoLoaded(true)}
          className="w-full h-auto rounded-2xl"
        >
          <source src={videoLink} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </div>
    </div>
  );
};

export default VideoMessage;
