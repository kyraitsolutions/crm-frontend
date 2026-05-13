import type { TMessage } from "../../types/message.type";

type TImageMessageProps = {
  message: TMessage;
};

const ImageMessage = ({ message }: TImageMessageProps) => {
  if (message.type !== "image") return null;

  const imageLink = message.media?.image?.link;
  const caption = message.media?.image?.caption;

  if (!imageLink) return null;

  return (
    <div>
      {/* IMAGE */}
      <div className="overflow-hidden rounded-xl">
        <img
          src={imageLink}
          alt={caption || "image"}
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>

      {/* CAPTION */}
      {caption && (
        <p className="text-sm text-gray-700 mt-2 px-1 break-words">{caption}</p>
      )}
    </div>
  );
};

export default ImageMessage;
