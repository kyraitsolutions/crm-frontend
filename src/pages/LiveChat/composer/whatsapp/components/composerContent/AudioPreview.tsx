import { Button } from "@/components/ui/button";
import { MdDelete, MdSend } from "react-icons/md";

interface AudioPreviewProps {
  audioUrl: string;
  onDelete: () => void;
  onSend: () => void;
}

const AudioPreview = ({ audioUrl, onDelete, onSend }: AudioPreviewProps) => {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-primary/5 p-3 w-full">
      <Button
        type="button"
        onClick={onDelete}
        className="actions-btn text-red-500!"
      >
        <MdDelete size={22} />
      </Button>

      <audio controls src={audioUrl} className="flex-1" />

      <Button
        type="button"
        onClick={onSend}
        disabled={!audioUrl}
        className="rounded-full bg-primary p-3 text-white disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MdSend size={20} />
      </Button>
    </div>
  );
};

export default AudioPreview;
