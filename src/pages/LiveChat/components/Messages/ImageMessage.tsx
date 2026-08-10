import { useAuthStore } from "@/stores";
import { useState } from "react";
import type { TMessage } from "../../types/message.type";
import { getWhatsappMediaUrl } from "../../utils/getWhatsappMediaUrl";

type TImageMessageProps = {
  message: TMessage;
};

const ImageMessage = ({ message }: TImageMessageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const accountId = useAuthStore((state) => state.accountId);
  if (message.type !== "image") return null;

  const imageLink = message?.media?.image?.id
    ? `${getWhatsappMediaUrl(String(accountId), message.media?.image?.id)}`
    : message.media?.image?.link || "";

  const caption = message.media?.image?.caption;

  if (!imageLink) return null;

  return (
    <div>
      {/* IMAGE */}

      <div className="overflow-hidden rounded-2xl relative">
        {!imageLoaded && imageLink && (
          <div className="w-60 h-36 object-cover rounded-2xl animate-pulse bg-gray-200" />
        )}

        <img
          src={imageLink}
          alt={caption || "image"}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          className="w-full h-auto object-cover rounded-2xl"
        />
      </div>

      {/* CAPTION */}
      {caption && (
        <p className="text-sm text-gray-700 mt-2 px-1 break-all">{caption}</p>
      )}
    </div>
  );
};

export default ImageMessage;
