import type { TMessage } from "../../types/message.type";

type TVideoMessageProps = {
  message: TMessage;
};

const VideoMessage = ({ message }: TVideoMessageProps) => {
  if (message.type !== "video") return null;

  const videoLink = message.media?.video?.link;

  if (!videoLink) return null;

  return (
    <div>
      {/* VIDEO */}
      <div className="overflow-hidden rounded-xl bg-black">
        <video
          controls
          playsInline
          preload="metadata"
          className="w-full h-auto rounded-xl"
        >
          <source src={videoLink} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </div>
    </div>
  );
};

export default VideoMessage;
