import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MdSend } from "react-icons/md";

interface IComposerInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
}

const ComposerInput = ({
  value,
  placeholder = "Type your message here...",
  onChange,
  onSend,
  inputRef,
  disabled,
}: IComposerInputProps) => {
  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="flex items-center gap-3 flex-1">
      <Textarea
        // ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canSend) {
            onSend();
          }
        }}
        placeholder={placeholder}
        disabled={disabled}
        className="input-field resize-none"
      />

      <Button
        type="button"
        onClick={onSend}
        // disabled={!canSend}
        className="rounded-full bg-primary p-3 text-white
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MdSend size={20} />
      </Button>
    </div>
  );
};

export default ComposerInput;
