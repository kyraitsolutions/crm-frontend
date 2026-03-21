import { Handle, Position } from "reactflow";
import { v4 as uuid } from "uuid";
import { MdAdd,
  //  MdAudiotrack,
    MdCalendarToday, 
    // MdDescription, 
    MdEmail, 
    // MdImage,
     MdMessage, MdMoreVert, MdOutlineDelete, MdPhone, MdQuestionAnswer, 
    //  MdVideocam 
    } from "react-icons/md";
// import ConfirmModal from "@/components/confirm";
import { Fragment, useCallback, useState } from "react";
import {AnimatePresence, motion} from "framer-motion"
export type BaseElement = {
  id: string;
  type: "text" | "option" | "date";
};

export type ChatElement = {
  id: string;
  type: "text" | "option" | "date" | "email"|"phone";
  content: string;
  title?: string;
  choices?: string[];
};

type ChatNodeData = {
  id: string;
  data: {
    label: string;
    value?: "text" | "option" | "email" | "phone" | "date";
    name?: "date";
    elements: ChatElement[];
    headerColor?: "coral" | "orange" | "green" | "blue";
    updateNode: (id: string, elements: ChatElement[]) => void;
    updateNodeLabel: (id: string, label: string) => void;
    deleteNode: (id: string) => void;
  };
};

const headerColors = {
  coral: { bg: "bg-[var(--node-coral)]", icon: "text-white" },
  orange: { bg: "bg-[var(--node-orange)]", icon: "text-white" },
  green: { bg: "bg-[var(--node-green)]", icon: "text-white" },
  blue: { bg: "bg-[var(--node-blue)]", icon: "text-white" },
};


// const tagColors: Record<string, string> = {
//   coral: "border-node-coral text-node-coral hover:bg-node-coral/10",
//   orange: "border-node-orange text-node-orange hover:bg-node-orange/10",
//   green: "border-node-green text-node-green hover:bg-node-green/10",
//   blue: "border-node-blue text-node-blue hover:bg-node-blue/10",
// };
const typeColorMap: Record<
  "text" | "email" | "phone" | "option" | "date",
  "coral" | "orange" | "green" | "blue"
> = {
  text: "coral",
  email: "blue",
  phone: "green",
  option: "orange",
  date: "green",
};

export const ChatNode = ({ id, data }: ChatNodeData) => {
  console.log(data);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  // 🔥 map node type → color

// get type safely
const type = data.value as keyof typeof typeColorMap;

// final color (manual override still possible)
const color = data?.headerColor || typeColorMap[type] || "coral";

const colorStyle = headerColors[color];
// const tagStyle = tagColors[color];



  const addElement = (type: "text" | "email" | "option" | "date") => {
    const newElementObj = {
      id: uuid(),
      type,
      content: "",
      ...(type === "option" && { choices: [""] }),
      date: "",
    };
    const newElement = { ...newElementObj };
    data.updateNode(id, [...data.elements, newElement]);
  };
  const removeElement = useCallback((elId: string) => {
  data.updateNode(
    id,
    data.elements.filter((el) => el.id !== elId)
  );
}, [data, id]);

  const updateElement = (elementId: string, key: string, value: any) => {
    const newElements = data.elements.map((el) =>
      el.id === elementId ? { ...el, [key]: value } : el
    );
    data.updateNode(id, newElements);
  };
  const updateOptionChoice = (
    elementId: string,
    index: number,
    value: string
  ) => {
    const newElements = data.elements.map((el) => {
      if (el.id === elementId && el.type === "option") {
        const updatedChoices = [...(el.choices as string[])];
        updatedChoices[index] = value;
        return { ...el, choices: updatedChoices };
      }
      return el;
    });
    data.updateNode(id, newElements);
  };

  const addOptionChoice = (elementId: string) => {
    const newElements = data.elements.map((el) => {
      if (el.id === elementId && el.type === "option") {
        return { ...el, choices: [...(el.choices as string[]), ""] };
      }
      return el;
    });
    data.updateNode(id, newElements);
  };

  const removeOptionChoice = (elementId: string, index: number) => {
    const newElements = data.elements.map((el) => {
      if (el.id === elementId && el.type === "option" && el.choices) {
        const updatedChoices = el.choices.filter((_, i) => i !== index);
        return { ...el, choices: updatedChoices };
      }
      return el;
    });
    data.updateNode(id, newElements);
  };

  async function handleConfirm() {
    data.deleteNode(id);
  }

  const [showMenu, setShowMenu] = useState(false);
  const headerIcons: Record<string, React.ReactNode> = {
  text: <MdMessage size={16} />,
  email: <MdEmail size={16} />,
  phone: <MdPhone size={16} />,
  option: <MdQuestionAnswer size={16} />,
  date: <MdCalendarToday size={16} />,
};

//  const actionTags = [
//     { label: "Message", icon: <MdMessage size={12} />, type: "text" as const },
//     { label: "Image", icon: <MdImage size={12} />, type: "text" as const },
//     { label: "Video", icon: <MdVideocam size={12} />, type: "text" as const },
//     { label: "Audio", icon: <MdAudiotrack size={12} />, type: "text" as const },
//     { label: "Document", icon: <MdDescription size={12} />, type: "text" as const },
//   ];
const icon = headerIcons[type] || <MdMessage size={16} />;

  return (
    <Fragment>
      <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative w-[260px] bg-card rounded-none shadow-node antialiased overflow-visible"
      style={{ fontFeatureSettings: '"tnum"' }}
    >

      {/* Header top dot */}
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3.5 !h-3.5 !bg-node-handle !border-[3px] !border-card !shadow-sm !-top-[7px] !rounded-full"
      />
       {/* Colored Header */}
      <div className={`${colorStyle.bg} flex items-center justify-between px-3 py-2.5`}>
        <div className="flex items-center gap-2">
          <span className={colorStyle.icon}>
           {icon}

          </span>
          <input
            className="bg-transparent text-[13px] font-semibold text-white outline-none placeholder:text-white/60 w-full"
            value={data?.label}
            onChange={(e) => data.updateNodeLabel(id, e.target.value)}
          />
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-0.5 text-white/80 hover:text-white transition-colors"
          >
            <MdMoreVert size={18} />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute right-0 top-8 bg-card shadow-lg border border-border rounded z-20 min-w-[120px]"
              >
                <button
                  // onClick={() => { setShowMenu(false); }}
                  onClick={handleConfirm}
                  className="w-full px-3 py-2 text-[12px] text-destructive hover:bg-destructive/10 flex items-center gap-2 transition-colors"
                >
                  <MdOutlineDelete size={14} /> Delete
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

        <div className="p-3 space-y-2">
        <AnimatePresence initial={false}>
          {data?.elements?.map((el) => (
            <motion.div
              key={el.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1"
            >
              {/* Text / Email / Phone */}
              {(el.type === "text" || el.type === "email" || el.type === "phone") && (
                <div className="relative">
                  <textarea
                    className="w-full bg-card border border-border rounded-none px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all resize-none"
                    rows={2}
                    value={el.content}
                    onChange={(e) => updateElement(el.id, "content", e.target.value)}
                    placeholder={el.type === "email" ? "name@example.com" : "Enter text here..."}
                  />
                  <button
                    onClick={() => removeElement(el.id)}
                    className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-muted-foreground/40 hover:text-destructive transition-all"
                  >
                    <MdOutlineDelete size={14} />
                  </button>
                </div>
              )}

              {/* Option / Question */}
              {el.type === "option" && (
                <div className="space-y-0">
                  <input
                    className="w-full bg-card border border-border rounded-none px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all mb-2"
                    value={el.content}
                    onChange={(e) => updateElement(el.id, "content", e.target.value)}
                    placeholder="Would what you like to do?"
                  />
                  <div className="space-y-0">
                    {el.choices?.map((choice, i) => (
                      <div key={i} className="flex items-center relative border-b border-border last:border-b-0">
                        <input
                          className="flex-1 bg-card px-3 py-2.5 text-[13px] text-foreground text-center placeholder:text-muted-foreground/60 outline-none transition-all"
                          value={choice}
                          onChange={(e) => updateOptionChoice(el.id, i, e.target.value)}
                          placeholder={`Option ${i + 1}`}
                        />
                        <button
                          onClick={() => removeOptionChoice(el.id, i)}
                          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 px-1 text-destructive transition-all"
                        >
                          ×
                        </button>
                        <Handle
                          type="source"
                          id={`${el.id}-choice-${i}`}
                          position={Position.Right}
                          className="!right-[-8px] !w-2.5 !h-2.5 !bg-node-handle !border-[2px] !border-card !rounded-full !transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => addOptionChoice(el.id)}
                    className="w-full py-2 border border-dashed border-border text-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center justify-center gap-1"
                  >
                    <MdAdd size={14} /> Add Choice
                  </button>
                </div>
              )}

              {/* Date */}
              {el.type === "date" && (
                <input
                  type="text"
                  className="w-full bg-card border border-border rounded-none px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-accent focus:border-accent outline-none transition-all tabular-nums"
                  value={el.content}
                  onChange={(e) => updateElement(el.id, "content", e.target.value)}
                  placeholder="YYYY-MM-DD"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      </motion.div>

      {/* <div className="px-3 pb-3 flex flex-wrap gap-1.5">
        {actionTags.map((tag) => (
          <button
            key={tag.label}
            onClick={() => addElement(tag.type)}
            className={`px-3 py-1.5 border rounded-none text-[11px] font-medium flex items-center gap-1.5 transition-all ${tagStyle}`}
          >
            {tag.icon}
            {tag.label}
          </button>
        ))}
      </div> */}
      <div className="flex gap-1 bg-white p-2">
              {data?.value?.toLowerCase() === "email" && (
                // <button
                //   className="text-xs bg-blue-500 text-white px-2 py-1 rounded flex-1"
                //   onClick={() => addElement("email")}
                // >
                //   + Add More
                // </button>
                <button
                   onClick={() => addElement("email")}
                    className="w-full py-2 border border-dashed border-border text-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center justify-center gap-1"
                  >
                    <MdAdd size={14} /> Add More
                  </button>
              )}

              {data?.value?.toLowerCase() === "text" && (
                <button
                  className="w-full py-2 border border-dashed border-border text-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center justify-center gap-1"
                  onClick={() => addElement("text")}
                >
                  + Add More
                </button>
              )}

              {data?.value?.toLowerCase() === "phone" && (
                <button
                  className="w-full py-2 border border-dashed border-border text-[12px] text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center justify-center gap-1"
                  onClick={() => addElement("text")}
                >
                  + Add More
                </button>
              )}
              </div>

      {data?.value?.toLowerCase() !== "option" && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3.5 !h-3.5 !bg-node-handle !border-[3px] !border-card !shadow-sm !-bottom-[7px] !rounded-full"
        />
      )}


      {/* <ConfirmModal
        isOpen={openConfirmModal}
        title="Delete item"
        description="Are you sure you want to permanently delete this item?"
        confirmText="Yes, delete"
        cancelText="No, keep it"
        // loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpenConfirmModal(false)}
      /> */}
      <AnimatePresence>
        {openConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-card/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3"
          >
            <p className="text-[12px] font-medium text-foreground">Delete this node?</p>
            <div className="flex gap-2">
              <button
                onClick={handleConfirm}
                className="px-4 py-1.5 bg-destructive text-destructive-foreground text-[11px] font-medium hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
              <button
                onClick={() => setOpenConfirmModal(false)}
                className="px-4 py-1.5 bg-secondary text-secondary-foreground text-[11px] font-medium hover:opacity-80 transition-opacity"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Fragment>
  );
};
