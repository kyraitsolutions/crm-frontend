import { Button } from "@/components/ui/button";
import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { MessageSquare, Upload, Video } from "lucide-react";
import { Handle, Position, useReactFlow } from "reactflow";
import type { TAppNodeData, TMessageType } from "../types/types";
import NodeHeader from "./NodeHeader";
import { SortableItem } from "./SortableItem";
import { ToastMessageService } from "@/services";
import { FILE_LIMITS } from "@/constants";

type TSendMessageNodeProps = {
  id: string;
  data: TAppNodeData;
};

const MESSAGE_TYPES = [
  { label: "Message", value: "text" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
];

const createMessageItem = (type: TMessageType) => {
  const base = {
    id: crypto.randomUUID(),
    type,
  };

  const typeMap = {
    text: {
      content: "",
    },
    image: {
      image: { url: "", caption: "" },
    },
    video: {
      video: { url: "" },
    },
  };

  return {
    ...base,
    ...typeMap[type],
  };
};

export default function SendMessageNode({ id, data }: TSendMessageNodeProps) {
  const { setNodes } = useReactFlow();
  const toastService = new ToastMessageService();
  const payload = data?.type === "send_message" ? data.payload : [];

  const handleFile = (
    index: number,
    type: Omit<TMessageType, "text">,
    file?: File,
  ) => {
    if (!file) return;

    if (type === "image" && file.size > FILE_LIMITS.IMAGE.MAX_SIZE_MB) {
      toastService.error("Max Size 5MB");
      return;
    }

    const newPayload = [...payload];
    const item = newPayload[index];

    if (item.type === "image") {
      newPayload[index] = {
        ...item,
        image: {
          ...item.image,
          // file,
          url: URL.createObjectURL(file),
        },
      };
    }

    if (item?.type === "video") {
      newPayload[index] = {
        ...item,
        video: {
          url: URL.createObjectURL(file),
          // file,
          // preview: URL.createObjectURL(file),
        },
      };
    }

    updatePayload(newPayload);
  };

  const addMessage = (type: "text" | "image" | "video") => {
    const newItem = createMessageItem(type);
    updatePayload([...payload, newItem]);
  };

  const updatePayload = (newPayload: any[]) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                payload: newPayload,
              },
            }
          : node,
      ),
    );
  };

  const updateItem = (index: number, updatedItem: any) => {
    const newPayload = [...payload];
    newPayload[index] = updatedItem;
    updatePayload(newPayload);
  };
  const removeItem = (index: number) => {
    const newPayload = payload.filter((_, i) => i !== index);
    updatePayload(newPayload);
  };

  const handleInputChange = (index: number, value: string) => {
    const newPayload = [...payload];
    newPayload[index] = { ...newPayload[index], content: value, type: "text" };
    updatePayload(newPayload);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = payload.findIndex((i) => i.id === active.id);
    const newIndex = payload.findIndex((i) => i.id === over.id);

    const newPayload = [...payload];
    const [movedItem] = newPayload.splice(oldIndex, 1);
    newPayload.splice(newIndex, 0, movedItem);

    updatePayload(newPayload);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="min-w-94 w-full group relative bg-card rounded-none shadow-lg antialiased overflow-visible "
    >
      {/* HEADER */}
      <NodeHeader
        title="Send Message"
        icon={<MessageSquare />}
        className="bg-primary/90"
      />

      <div className="px-5 py-2 space-y-4">
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={payload.map((i) => i.id)}>
            {payload.map((item, index) => (
              <SortableItem key={item.id} id={item.id} length={payload.length}>
                <div key={item.id} className="space-y-6 relative">
                  {/* TEXT */}
                  {item.type === "text" && (
                    <Textarea
                      placeholder="Enter message..."
                      className={`input-field nodrag`}
                      value={item.content || ""}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                    />
                  )}

                  {/* IMAGE */}
                  {item.type === "image" && (
                    <div className="rounded-xl space-y-3 bg-slate-200/50 border border-blue-100 p-3">
                      {/* ✅ IMAGE PREVIEW */}
                      {item.image?.url && (
                        <div className="relative group">
                          <img
                            src={item.image?.url}
                            alt="preview"
                            className="w-full h-40 object-cover rounded-lg border"
                          />

                          <label className="group-hover:opacity-100 opacity-0 flex justify-center items-center flex-col  absolute top-0 left-0 w-full h-full  p-6 cursor-pointer border-2 border-dashed border-blue-200 rounded-lg  transition-all duration-500 backdrop-blur-xs bg-black/10">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mb-2">
                              <Upload size={18} />
                            </div>

                            <p className="text-sm font-medium text-white">
                              Replace Image
                            </p>

                            <Input
                              type="file"
                              accept={FILE_LIMITS.IMAGE.ACCEPTED_TYPES}
                              className="hidden"
                              onChange={(e) =>
                                handleFile(index, "image", e.target.files?.[0])
                              }
                            />
                          </label>
                        </div>
                      )}

                      {/* Upload Box */}
                      {!item.image?.url && (
                        <div>
                          <label className="flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-dashed border-blue-200 rounded-lg bg-white transition-all duration-200 hover:bg-blue-50">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mb-2">
                              <Upload size={18} />
                            </div>

                            <p className="text-sm font-medium text-gray-700">
                              Upload Image
                            </p>

                            <Input
                              type="file"
                              accept={FILE_LIMITS.IMAGE.ACCEPTED_TYPES}
                              className="hidden"
                              onChange={(e) =>
                                handleFile(index, "image", e.target.files?.[0])
                              }
                            />
                          </label>

                          <p className="text-end p-1 text-xs text-primary">
                            (Formats: png, jpg, jpeg) / (Max size: 5mb)
                          </p>
                        </div>
                      )}

                      {/* Caption */}
                      <div className="space-y-1">
                        <p className="text-[10px] text-gray-500">(optional)</p>
                        <Input
                          placeholder="Caption..."
                          value={item.image?.caption || ""}
                          className="input-field bg-white text-xs!"
                          onChange={(e) =>
                            updateItem(index, {
                              ...item,
                              image: {
                                ...item.image,
                                caption: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {/* VIDEO */}
                  {item.type === "video" && (
                    <div className="rounded-xl space-y-3 bg-slate-200/50 border border-purple-100 p-3">
                      {/* Upload Box */}
                      <label className="flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-dashed border-purple-200 rounded-lg bg-white hover:bg-purple-50 transition-all duration-200">
                        {/* Icon */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-600 mb-2">
                          <Video />
                        </div>

                        {/* Text */}
                        <p className="text-sm font-medium text-gray-700">
                          Upload Video
                        </p>
                        <p className="text-xs text-gray-400">
                          Click or drag & drop
                        </p>

                        {/* Hidden Input */}
                        <Input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];

                            if (file && file.size > 20 * 1024 * 1024) {
                              alert("Max 20MB");
                              return;
                            }

                            updateItem(index, {
                              ...item,
                              video: { file },
                            });
                          }}
                        />
                      </label>

                      {/* Footer Info */}
                      <p className="text-[11px] text-gray-400 text-center">
                        Max size: 20MB
                      </p>
                    </div>
                  )}

                  {/* REMOVE BUTTON */}
                  {index !== 0 && (
                    <ButtonClose
                      iconSize={2}
                      onClose={() => removeItem(index)}
                      className="absolute -top-2 -right-2 border rounded-full flex items-center justify-center text-xs shadow opacity-0 group-hover:opacity-100 transition"
                    />
                  )}
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>

        {/* TYPE SELECTOR */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {MESSAGE_TYPES.map(({ label, value: type }) => (
            <Button
              key={type}
              onClick={() => addMessage(type as "text" | "image" | "video")}
              className="actions-btn text-xs! px-4! py-1! font-normal! flex-1"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* HANDLES */}
      <Handle
        className="bg-slate-600! size-3!"
        type="target"
        position={Position.Left}
      />
      <Handle
        className="bg-primary! size-3!"
        type="source"
        position={Position.Right}
      />
    </motion.div>
  );
}
