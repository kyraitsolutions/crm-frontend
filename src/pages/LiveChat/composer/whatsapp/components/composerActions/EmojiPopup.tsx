import EmojiPicker, { Theme } from "emoji-picker-react";

interface EmojiPopupProps {
  open: boolean;
  onSelect: (emoji: string) => void;
}

const EmojiPopup = ({ open, onSelect }: EmojiPopupProps) => {
  if (!open) return null;

  return (
    <div className="absolute bottom-26 left-2 z-50">
      <EmojiPicker
        theme={Theme.LIGHT}
        lazyLoadEmojis
        onEmojiClick={(emoji) => onSelect(emoji.emoji)}
      />
    </div>
  );
};

export default EmojiPopup;
