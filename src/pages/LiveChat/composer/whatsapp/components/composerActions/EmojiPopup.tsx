import { Button } from "@/components/ui/button";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { X } from "lucide-react";

interface EmojiPopupProps {
  open: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPopup = ({ open, onClose, onSelect }: EmojiPopupProps) => {
  if (!open) return null;

  return (
    <div className="absolute bottom-26 left-2 z-50">
      <EmojiPicker
        theme={Theme.LIGHT}
        lazyLoadEmojis
        onEmojiClick={(emoji) => onSelect(emoji.emoji)}
        className="h-100! pt-5!"
      />
      <Button
        className="absolute top-2 right-2 actions-btn! bg-red-500! rounded-full size-4"
        onClick={onClose}
      >
        <X className="size-3" />
      </Button>
    </div>
  );
};

export default EmojiPopup;
