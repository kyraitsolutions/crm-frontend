import { Button } from "@/components/ui/button";
import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { useReactFlow } from "reactflow";
import { Plus, Trash2 } from "lucide-react";
import { ToastMessageService } from "@/services";
import type { TAppNodeData, TListSection } from "../types/types";
import { transformToApi } from "../utils/transformToApi.utils";
import { createId } from "../utils/utils";

const MAX_HEADER = 60;
const MAX_FOOTER = 60;
const MAX_BODY = 1024;

const MAX_SECTION_TITLE = 24;
const MAX_ROW_TITLE = 24;
const MAX_ROW_DESC = 72;
type TListNodeSettingProps = {
  id?: string;
  data: TAppNodeData;
  onClose?: () => void;
};

const buildId = (sectionIndex: number, rowIndex: number) => {
  return `section_${sectionIndex}_row_${rowIndex}_${createId()}`;
};

const ListNodeSetting = ({ id, data, onClose }: TListNodeSettingProps) => {
  const { setNodes } = useReactFlow();
  const toast = new ToastMessageService();

  const payload = data.type === "list" ? data.payload : null;

  const listRef = useRef<HTMLDivElement>(null);

  const [header, setHeader] = useState("");
  const [body, setBody] = useState("");
  const [footer, setFooter] = useState("");
  const [buttonText, setButtonText] = useState("");

  const [sections, setSections] = useState<TListSection[]>([]);

  useEffect(() => {
    if (payload) {
      setHeader(payload.interactive.header.text || "");
      setBody(payload.interactive.body.text || "");
      setFooter(payload.interactive.footer.text || "");
      setButtonText(payload.interactive.action.button || "");
      setSections(payload.interactive.action.sections || []);
    }
  }, [payload]);

  // -------- VALIDATION --------
  const validate = () => {
    if (!body.trim()) return toast.error("Body is required");
    if (header.length > MAX_HEADER)
      return toast.error("Header max 60 characters");
    if (footer.length > MAX_FOOTER)
      return toast.error("Footer max 60 characters");
    if (body.length > MAX_BODY) return toast.error("Body max 1024 characters");

    sections.forEach((sec, i) => {
      if (!sec.title.trim())
        return toast.error(`Section ${i + 1} title required`);

      if (!sec.rows.length)
        return toast.error(`Section ${i + 1} must have at least 1 row`);

      sec.rows.forEach((row: any, rIndex: number) => {
        if (!row.title.trim())
          return toast.error(`Row ${rIndex + 1} in section ${i + 1} is empty`);
      });
    });
  };

  const addSection = () => {
    setSections((prev) => [
      ...prev,
      {
        title: `Section ${prev.length + 1}`,
        rows: [
          {
            id: buildId(prev.length + 1, 1),
            title: `Row`,
            description: "",
          },
        ],
      },
    ]);
  };

  const updateSection = (sectionIndex: number, key: "title", value: string) => {
    setSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex ? { ...sec, [key]: value } : sec,
      ),
    );
  };

  const removeSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const addRow = (sectionIndex: number) => {
    const newRow = {
      id: buildId(sectionIndex + 1, sections[sectionIndex].rows.length + 1),
      title: `Row`,
      description: "",
    };

    setSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex ? { ...sec, rows: [...sec.rows, newRow] } : sec,
      ),
    );
  };

  const updateRow = (
    sectionIndex: number,
    rowId: string,
    key: "title" | "description",
    value: string,
  ) => {
    let finalValue = value;

    if (key === "title") {
      finalValue = value.slice(0, MAX_ROW_TITLE);
    }

    if (key === "description") {
      finalValue = value.slice(0, MAX_ROW_DESC);
    }

    setSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              rows: sec.rows.map((r: any) =>
                r.id === rowId ? { ...r, [key]: finalValue } : r,
              ),
            }
          : sec,
      ),
    );
  };

  const removeRow = (sectionIndex: number, rowId: string) => {
    setSections((prev) =>
      prev.map((sec, i) =>
        i === sectionIndex
          ? {
              ...sec,
              rows: sec.rows.filter((r: any) => r.id !== rowId),
            }
          : sec,
      ),
    );
  };

  // -------- AUTO SCROLL --------
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [sections]);

  const handleSave = () => {
    validate();

    const payloadData = {
      type: data.type,
      label: data.label,
      payload: transformToApi({
        type: "interactive",
        interactive: {
          type: "list",
          header: { type: "text", text: header },
          body: { text: body },
          footer: { type: "text", text: footer },
          action: {
            button: buttonText,
            sections,
          },
        },
      }),
    };

    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: payloadData } : n)),
    );
  };

  console.log(sections);

  return (
    <div className="h-full flex flex-col bg-ternary text-white">
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">List Message</h2>
          <p className="text-xs text-gray-400">Configure interactive list</p>
        </div>
        <ButtonClose onClose={() => onClose && onClose()} />
      </div>

      {/* BODY */}
      <div ref={listRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {/* HEADER */}
        <div>
          <label className="text-xs text-gray-400">Header</label>
          <Input
            value={header}
            onChange={(e) => {
              if (e.target.value.length > MAX_HEADER) return;
              setHeader(e.target.value);
            }}
            className="input-field bg-white/5 border-white/15! text-white"
          />
          <div className="text-right text-[10px] text-gray-500">
            {header.length}/{MAX_HEADER}
          </div>
        </div>

        {/* BODY */}
        <div>
          <label className="text-xs text-gray-400">Body *</label>
          <Textarea
            value={body}
            onChange={(e) => {
              if (e.target.value.length > MAX_BODY) return;
              setBody(e.target.value);
            }}
            className="input-field bg-white/5 border-white/15! text-white min-h-32"
          />
          <div className="text-right text-[10px] text-gray-500">
            {body.length}/{MAX_BODY}
          </div>
        </div>

        {/* FOOTER */}
        <div>
          <label className="text-xs text-gray-400">Footer</label>
          <Input
            value={footer}
            onChange={(e) => {
              if (e.target.value.length > MAX_FOOTER) return;
              setFooter(e.target.value);
            }}
            className="input-field bg-white/5 border-white/15! text-white"
          />
          <div className="text-right text-[10px] text-gray-500">
            {footer.length}/{MAX_FOOTER}
          </div>
        </div>

        {/* BUTTON TEXT */}
        <div>
          <label className="text-xs text-gray-400">Button Text *</label>
          <Input
            value={buttonText}
            onChange={(e) => setButtonText(e.target.value)}
            className="input-field bg-white/5 border-white/15! text-white"
          />
        </div>

        {/* SECTIONS */}
        <div className="space-y-4">
          {sections.length > 0 &&
            sections.map((section, sIndex) => (
              <div
                key={sIndex}
                className="group/section bg-white/5 border border-white/10 rounded-lg p-3 space-y-3 relative"
              >
                {/* SECTION HEADER */}
                <div>
                  <div className="flex flex-1 flex-col gap-2">
                    <label className="text-xs text-gray-400">
                      Section Title
                    </label>
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        updateSection(
                          sIndex,
                          "title",
                          e.target.value.slice(0, MAX_SECTION_TITLE),
                        )
                      }
                      //   onChange={(e) => {
                      //     if (e.target.value.length > MAX_SECTION_TITLE) return;
                      //     setSections((prev) =>
                      //       prev.map((s, i) =>
                      //         i === sIndex ? { ...s, title: e.target.value } : s,
                      //       ),
                      //     );
                      //   }}
                      className="input-field node-setting-input-field"
                    />
                    <div className="text-right text-[10px] text-gray-500">
                      {section.title.length}/{MAX_SECTION_TITLE}
                    </div>
                  </div>
                </div>

                {/* ROWS */}
                <div className="space-y-2">
                  {section?.rows?.map((row, rIndex) => (
                    <div
                      key={row.id}
                      className="group/row relative flex flex-col bg-black/20 px-2 py-4 rounded-md"
                    >
                      <div className="flex flex-col gap-2">
                        <label className="text-xs text-gray-400">
                          Row Title
                        </label>
                        <Input
                          value={row.title}
                          onChange={(e) =>
                            updateRow(sIndex, row.id, "title", e.target.value)
                          }
                          placeholder="Row title"
                          className="input-field node-setting-input-field"
                        />

                        <div className="text-right text-[10px] text-gray-500">
                          {row.title.length}/{MAX_ROW_TITLE}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-gray-400">
                          Row Description (optional)
                        </label>
                        <Input
                          value={row.description}
                          onChange={(e) =>
                            updateRow(
                              sIndex,
                              row.id,
                              "description",
                              e.target.value,
                            )
                          }
                          placeholder="Description"
                          className="input-field node-setting-input-field"
                        />

                        <div className="text-right text-[10px] text-gray-500">
                          {row.description?.length || 0}/{MAX_ROW_DESC}
                        </div>
                      </div>

                      {/* REMOVE ROW BUTTON */}
                      {rIndex > 0 && (
                        <Button
                          onClick={() => removeRow(sIndex, row.id)}
                          className="absolute top-1.5 right-2 bg-red-500 text-white size-6 flex justify-center items-center rounded-full opacity-0 group-hover/row:opacity-100 hover:bg-red-600 transition duration-200 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* ADD ROW */}
                <Button size="sm" onClick={() => addRow(sIndex)}>
                  + Add Row
                </Button>

                {/* REMOVE SECTION BUTTON   */}
                {sIndex > 0 && (
                  <Button
                    className="absolute top-1 right-2 bg-red-500 text-white size-6 flex justify-center items-center rounded-full opacity-0 group-hover/section:opacity-100 hover:bg-red-600"
                    onClick={() => removeSection(sIndex)}
                  >
                    <Trash2 size={12} />
                  </Button>
                )}
              </div>
            ))}

          <Button onClick={addSection} className="w-full">
            <Plus size={14} /> Add Section
          </Button>
        </div>
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t border-white/10 flex justify-end gap-2 bg-[#0f172a]">
        <Button
          className="border border-white/60 bg-transparent hover:bg-red-500 hover:text-white"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button onClick={handleSave}>Save</Button>
      </div>
    </div>
  );
};

export default ListNodeSetting;
