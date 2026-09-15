import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { KeyboardEvent } from "react";
import { MdSend } from "react-icons/md";

interface IComposerInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSend: () => void;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  disabled?: boolean;
  inputDisabled?: boolean;
  canSend?: boolean;
  onKeyDown?: (event: KeyboardEvent<HTMLTextAreaElement>) => boolean | void;
  onCursorChange?: (cursor: number) => void;
}

const ComposerInput = ({
  value,
  placeholder = "Type your message here...",
  onChange,
  onSend,
  inputRef,
  disabled,
  inputDisabled,
  canSend,
  onKeyDown,
  onCursorChange,
}: IComposerInputProps) => {
  const textareaDisabled = inputDisabled ?? disabled;
  const sendEnabled = canSend ?? (value.trim().length > 0 && !disabled);

  const emitCursor = (el: HTMLTextAreaElement) => {
    onCursorChange?.(el.selectionStart ?? el.value.length);
  };

  return (
    <div className="flex items-center gap-3 flex-1">
      <Textarea
        ref={inputRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          emitCursor(e.target);
        }}
        onClick={(e) => emitCursor(e.currentTarget)}
        onKeyUp={(e) => emitCursor(e.currentTarget)}
        onSelect={(e) => emitCursor(e.currentTarget)}
        onKeyDown={(e) => {
          const handled = onKeyDown?.(e);
          if (handled || e.defaultPrevented) return;

          if (e.key === "Enter" && sendEnabled && !e.shiftKey) {
            onSend();
            onChange("");
            e.preventDefault();
          }
        }}
        placeholder={placeholder}
        disabled={textareaDisabled}
        className={`input-field resize-none ${textareaDisabled && "placeholder:text-red-600"}`}
      />

      <Button
        type="button"
        onClick={onSend}
        disabled={!sendEnabled}
        className="rounded-full bg-primary p-3 text-white
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <MdSend size={20} />
      </Button>
    </div>
  );
};

export default ComposerInput;
