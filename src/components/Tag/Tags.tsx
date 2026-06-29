import { useEffect, useRef, useState } from "react";

import { Plus, Tag, X } from "lucide-react";

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

interface SelectedTag {
    label: string,
    color: string,
}
interface TagsProps {
    tags: SelectedTag[];
    onChange: React.Dispatch<
        React.SetStateAction<SelectedTag[]>
    >;
    onSave?: (tags: SelectedTag[]) => Promise<void> | void;
}

const Tags = ({ tags, onChange, onSave }: TagsProps) => {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState("");

    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [selectedColor, setSelectedColor] = useState("#84cc16");
    const [showColorPicker, setShowColorPicker] = useState(false);

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

        const alreadyExists = tags.some((tag) => tag.label.toLowerCase() === input.toLowerCase());

        if (alreadyExists) return;

        const updatedTags = [
            ...tags,
            {
                label: input,
                color: selectedColor,
            },
        ];

        onChange(updatedTags);

        setInput("");
        setShowColorPicker(false);
    };

    const handleSave = async () => {
        console.log("sending tags", tags)
        await onSave?.(tags);
        setOpen(false);
    };
    const removeTag = (tagName: string) => {
        onChange((prev) => prev.filter((tag) =>
            tag.label !== tagName
        ));
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 flex-wrap">
                {tags.length > 0 && <Tag size={16} className="rotate-90" />}

                {tags?.slice(0, 3)?.map((tag) => (
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
                    className="text-sm text-primary hover:text-primary/90 flex items-center gap-1"
                >
                    <Tag size={16} className="rotate-90" /> Add Tags
                </button>
            </div>

            {open && (
                <div className="absolute top-10 left-0 z-50 w-112.5  rounded-xl border bg-white shadow-lg p-3">
                    <div className="flex items-start gap-3">
                        <Tag
                            className="text-gray-500 mt-1"
                            size={18}
                        />

                        <div className="flex-1">
                            {/* Input Container */}
                            <div className=" px-2 flex flex-col gap-2">
                                <h1 className="text-sm text-gray-500">Exiting Tags:</h1>

                                <div className="flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <div
                                            key={tag.label}
                                            className="flex items-center rounded-md overflow-hidden"
                                        >
                                            <div
                                                className="px-2 text-sm text-white flex items-center gap-2"
                                                style={{ background: tag.color ? tag.color : "#84cc16", }}
                                            >
                                                {tag.label}

                                                <button
                                                    onClick={() => removeTag(tag.label)}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h1 className="text-gray-500 text-sm">
                                    Add new tag
                                </h1>
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Enter Tags"
                                    className="flex-1 outline-none text-sm min-w-25 border border-[#5661f6] rounded-md py-2 px-2"
                                />
                            </div>

                            {input && (
                                <div className="mt-2 border rounded-lg p-2 bg-slate-50 relative flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setShowColorPicker((prev) => !prev)}
                                            className="w-8 h-8 rounded-full border flex items-center justify-center"
                                        >
                                            <div
                                                className="w-4 h-4 rounded-full"
                                                style={{ background: selectedColor, }}
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
                                                        onClick={() => { setSelectedColor(color); setShowColorPicker(false) }}
                                                        className="w-6 h-6 rounded-full border"
                                                        style={{ background: color, }}
                                                    />
                                                )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleAddTag}
                                        className="text-xs bg-primary h-5 w-5 flex items-center justify-center text-white rounded-full"><Plus size={15} /> </button>
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
    )
}

export default Tags