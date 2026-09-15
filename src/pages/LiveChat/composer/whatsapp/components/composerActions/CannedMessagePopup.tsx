import { useEffect, useRef } from "react";
import { MdSearch } from "react-icons/md";
import type { TCannedMessage } from "@/pages/Channels/whatsapp/types/canned-message.type";

interface CannedMessagePopupProps {
  open: boolean;
  search: string;
  items: TCannedMessage[];
  totalCount: number;
  loading?: boolean;
  error?: string | null;
  highlightedIndex: number;
  onSearchChange: (value: string) => void;
  onHighlight: (index: number) => void;
  onSelect: (message: TCannedMessage) => void;
}

const TYPE_META: Record<string, { icon: string; label: string }> = {
  text: { icon: "💬", label: "Text" },
  image: { icon: "🖼", label: "Image" },
  video: { icon: "🎥", label: "Video" },
  document: { icon: "📄", label: "Document" },
  audio: { icon: "🎵", label: "Audio" },
};

const CannedMessagePopup = ({
  open,
  search,
  items,
  totalCount,
  loading,
  error,
  highlightedIndex,
  onSearchChange,
  onHighlight,
  onSelect,
}: CannedMessagePopupProps) => {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, items.length]);

  if (!open) return null;

  return (
    <div
      className="absolute bottom-full left-0 right-0 z-50 mb-2 flex max-h-[min(24rem,45vh)] w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg sm:left-auto sm:w-[22rem]"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="border-b border-gray-100 p-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
          <MdSearch className="shrink-0 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search canned messages..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overscroll-contain">
        {loading && totalCount === 0 ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2].map((item) => (
              <div key={item} className="animate-pulse space-y-2">
                <div className="h-3.5 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            {error}
          </div>
        ) : totalCount === 0 ? (
          <div className="px-4 py-10 text-center">
            <p className="text-sm font-medium text-gray-600">
              No canned messages yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Create a canned message to quickly reply to customers.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-gray-500">
            No canned messages found
          </div>
        ) : (
          items.map((message, index) => {
            const meta = TYPE_META[message.type] || TYPE_META.text;
            const mediaLabel = message.media?.fileName
              ? `${meta.label} · ${message.media.fileName}`
              : "";
            const preview = mediaLabel || message.text || `${meta.label} message`;

            return (
              <button
                key={message.id}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                type="button"
                onMouseEnter={() => onHighlight(index)}
                onClick={() => onSelect(message)}
                className={`w-full border-b border-gray-50 px-4 py-3 text-left last:border-b-0 ${
                  index === highlightedIndex ? "bg-gray-100" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {meta.icon} {message.name}
                  </p>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium uppercase text-gray-500">
                    {message.type}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-primary">/{message.shortcut}</p>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">{preview}</p>
                {message.category ? (
                  <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    {message.category}
                  </span>
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CannedMessagePopup;
