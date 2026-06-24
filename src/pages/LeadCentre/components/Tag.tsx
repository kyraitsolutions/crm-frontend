import { useEffect, useRef, useState } from "react";
import { Tag, X } from "lucide-react";
import { useAuthStore } from "@/stores";
import { useLeadsStore } from "../store/lead.store";
import type { ILead } from "../types/lead.type";

const tagColors = [
  "#f87171",
  "#fb923c",
  "#f59e0b",
  "#facc15",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#6366f1",
  "#ec4899",
  "#9ca3af",
  "#78716c",
  "#9333ea",
];

const LeadTags = ({ lead }: { lead: ILead }) => {
  const { accountId } = useAuthStore();
  const { updateLeadField } = useLeadsStore();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const [selectedTags, setSelectedTags] = useState<
    { label: string; color: string }[]
  >([]);

  const [selectedColor, setSelectedColor] = useState("#84cc16");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    if (lead?.tags?.length) {
      const formatted = lead.tags.map((tag: string) => ({
        label: tag,
        color: "#60a5fa",
      }));

      setSelectedTags(formatted);
    }
  }, [lead]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTag = () => {
    if (!input.trim()) return;

    const alreadyExists = selectedTags.some(
      (tag) => tag.label.toLowerCase() === input.toLowerCase(),
    );

    if (alreadyExists) return;

    setSelectedTags((prev) => [
      ...prev,
      {
        label: input,
        color: selectedColor,
      },
    ]);

    setInput("");
    setShowColorPicker(false);
  };

  const removeTag = (tagName: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.label !== tagName));
  };

  const handleSave = async () => {
    const payload = [...(lead.tags || []), input];

    await updateLeadField(
      String(accountId),
      String(lead?.id),
      "tags" as never,
      payload,
    );

    setOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex items-center gap-2 flex-wrap">
        {selectedTags.length > 0 && <Tag size={16} className="rotate-90" />}

        {selectedTags.slice(0, 3).map((tag) => (
          <div
            key={tag.label}
            className="flex items-center rounded-md overflow-hidden text-xs font-medium"
          >
            <div
              className="pl-2  pr-4 rounded-tr-2xl rounded-br-2xl py-0.5 capitalize text-white"
              style={{ background: tagColors[12] }}
            >
              {tag.label}
            </div>
          </div>
        ))}

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="text-sm text-slate-600 hover:text-primary flex items-center gap-1"
        >
          <Tag size={16} className="rotate-90" /> Add Tags
        </button>
      </div>

      {open && (
        <div className="absolute top-10 left-0 z-50 w-112.5  rounded-xl border bg-white shadow-lg p-3">
          <div className="flex items-start gap-3">
            <Tag className="text-gray-500 mt-1" size={18} />

            <div className="flex-1">
              {/* Input Container */}
              <div className=" px-2 flex flex-col gap-2">
                <h1 className="text-sm text-gray-500">Exiting Tags:</h1>

                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => (
                    <div
                      key={tag.label}
                      className="flex items-center rounded-md overflow-hidden"
                    >
                      <div
                        className="px-2 text-sm text-white flex items-center gap-2"
                        style={{ background: tag.color }}
                      >
                        {tag.label}

                        <button onClick={() => removeTag(tag.label)}>
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <h1 className="text-gray-500 text-sm">Add new tag</h1>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter Tags"
                  className="flex-1 outline-none text-sm min-w-25 border border-[#5661f6] rounded-md py-2 px-2"
                />
              </div>

              {input && (
                <div className="mt-2 border rounded-lg p-2 bg-slate-50 relative">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowColorPicker((prev) => !prev)}
                      className="w-8 h-8 rounded-full border flex items-center justify-center"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ background: selectedColor }}
                      />
                    </button>

                    <div>
                      <p className="text-sm text-slate-500">
                        New Tag{" "}
                        <span className="font-medium text-black">{input}</span>
                      </p>
                    </div>
                  </div>

                  {showColorPicker && (
                    <div className="absolute top-12 left-0 bg-white border rounded-xl shadow-lg p-3 w-60">
                      <div className="flex flex-wrap gap-2">
                        {tagColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className="w-6 h-6 rounded-full border"
                            style={{ background: color }}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={handleAddTag} className="hidden" />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={() => setOpen(false)}
                  className="border px-4 py-1.5 rounded-md text-sm"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="bg-primary text-white px-4 py-1.5 rounded-md text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadTags;
