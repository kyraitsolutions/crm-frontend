import { Button } from "@/components/ui/button";
import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FILE_LIMITS } from "@/constants";
import { ToastMessageService } from "@/services";
import { MediaService } from "@/services/media.service";
import { uploadFileToS3WithPresignedUrl } from "@/utils/s3-upload.utils";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { MessageSquare, Upload, Video } from "lucide-react";
import { Handle, Position, useReactFlow } from "reactflow";
import type { TAppNodeData, TMessageType } from "../types/types";
import NodeHeader from "./NodeHeader";
import { SortableItem } from "./SortableItem";
import { getDocumentMeta } from "../utils/getDocumentMeta";

type TSendMessageNodeProps = {
  id: string;
  data: TAppNodeData;
};

const MESSAGE_TYPES = [
  { label: "Message", value: "text" },
  { label: "Image", value: "image" },
  { label: "Video", value: "video" },
  { label: "Document", value: "document" },
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
      image: { link: "", caption: "" },
    },
    video: {
      video: { link: "" },
    },
    document: {
      document: { link: "" },
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
  const mediaService = new MediaService();
  const payload = data?.type === "send_message" ? data.payload : [];

  // const handleFile = (
  //   index: number,
  //   type: Omit<TMessageType, "text">,
  //   file?: File,
  // ) => {
  //   if (!file) return;

  //   const limits = FILE_LIMITS[type.toUpperCase() as keyof typeof FILE_LIMITS];

  //   if (limits && file.size > limits.MAX_SIZE_MB) {
  //     const maxMB = limits.MAX_SIZE_MB / (1024 * 1024);
  //     return toastService.error(`Max size ${maxMB} MB`);
  //   }

  //   const newPayload = [...payload];
  //   const item = newPayload[index];

  //   if (item.type === "image") {
  //     newPayload[index] = {
  //       ...item,
  //       image: {
  //         ...item.image,
  //         link: URL.createObjectURL(file),
  //       },
  //     };
  //   }

  //   if (item?.type === "video") {
  //     newPayload[index] = {
  //       ...item,
  //       video: {
  //         link: URL.createObjectURL(file),
  //       },
  //     };
  //   }
  //   updatePayload(newPayload);

  //   const payload = {
  //     fileName: file.name,
  //     mimeType: fileType,
  //     fileSize: file.size,
  //     type: "chatbot",
  //   };

  //   const response = await mediaService.getMediaUploadPresignedUrl(payload);
  //   const doc = response.data?.doc;

  //   if (response.status === 200 || response.status === 201) {
  //     await uploadFileToS3WithPresignedUrl(doc.uploadUrl, file);

  //     // 🔥 replace preview with real URL
  //     updateHeaderMedia(currentType, doc.fileUrl);
  //   }
  // };

  const handleFile = async (
    index: number,
    type: Omit<TMessageType, "text">,
    file?: File,
  ) => {
    if (!file) return;

    const limits = FILE_LIMITS[type.toUpperCase() as keyof typeof FILE_LIMITS];

    if (limits && file.size > limits.MAX_SIZE_MB) {
      const maxMB = limits.MAX_SIZE_MB / (1024 * 1024);
      return toastService.error(`Max size ${maxMB} MB`);
    }

    // local preview
    const newPayload = [...payload];
    const item = newPayload[index];

    if (item.type === "image") {
      newPayload[index] = {
        ...item,
        image: {
          ...item.image,
          link: URL.createObjectURL(file),
        },
      };
    }

    if (item.type === "video") {
      newPayload[index] = {
        ...item,
        video: {
          ...item.video,
          link: URL.createObjectURL(file),
        },
      };
    }

    if (item.type === "document") {
      newPayload[index] = {
        ...item,
        document: {
          ...item.document,
          link: URL.createObjectURL(file),
        },
      };
    }

    updatePayload(newPayload);

    // upload payload
    const uploadPayload = {
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
      type: "chatbot",
    };

    try {
      const response =
        await mediaService.getMediaUploadPresignedUrl(uploadPayload);

      const doc = response.data?.doc;

      if (response.status === 200 || response.status === 201) {
        await uploadFileToS3WithPresignedUrl(doc.uploadUrl, file);

        // replace local preview with actual CDN url
        // const updatedPayload = [...newPayload];
        // const item = updatedPayload[index];

        console.log("item", item);

        if (item.type === "image") {
          newPayload[index] = {
            ...item,
            image: {
              ...item.image,
              link: doc.fileUrl,
            },
          };
        }

        if (item.type === "video") {
          newPayload[index] = {
            ...item,
            video: {
              ...item.video,
              link: doc.fileUrl,
            },
          };
        }

        if (item.type === "document") {
          newPayload[index] = {
            ...item,
            document: {
              ...item.document,
              link: doc.fileUrl,
            },
          };
        }

        console.log("updatedPayload", newPayload);

        updatePayload(newPayload);
      }
    } catch (error) {
      console.error(error);
      toastService.error("Upload failed");
    }
  };

  const addMessage = (type: TMessageType) => {
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
    const item = newPayload[index];
    if (item.type !== "text") return;
    newPayload[index] = {
      ...item,
      content: value,
    };

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
      className="w-90 group relative bg-card rounded-none shadow-lg antialiased overflow-visible "
    >
      {/* HEADER */}
      <NodeHeader
        title="Send Message"
        icon={<MessageSquare />}
        className="bg-primary/90"
      />

      <div className="px-5 py-2 space-y-4">
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext items={payload?.map((i) => i.id) as string[]}>
            {payload.map((item, index) => (
              <SortableItem
                key={item.id}
                id={String(item?.id)}
                length={payload.length}
              >
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
                      {item.image?.link && (
                        <div className="relative group">
                          <img
                            src={item.image?.link}
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
                      {!item.image?.link && (
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
                    <div>
                      {item.video?.link && (
                        <div className="relative group">
                          <video
                            src={item.video?.link}
                            className="w-full h-40 object-cover rounded-lg border"
                          />
                        </div>
                      )}

                      {!item?.video?.link && (
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
                                handleFile(index, "video", e.target.files?.[0]);
                              }}
                            />
                          </label>

                          {/* Footer Info */}
                          <p className="text-[11px] text-gray-400 text-center">
                            Max size: 20MB
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {item.type === "document" && (
                    <div>
                      {item.document?.link ? (
                        (() => {
                          const doc = getDocumentMeta(item.document.link || "");
                          const Icon = doc?.icon;

                          return (
                            <div className="rounded-xl border border-gray-200 bg-slate-200/50 p-4 space-y-3">
                              <a
                                href={item.document.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3"
                              >
                                <div
                                  style={{
                                    backgroundColor: doc?.badgeBg,
                                    color: doc?.badgeText,
                                  }}
                                  className="size-12 rounded-xl bg-white border flex items-center justify-center"
                                >
                                  {Icon && <Icon />}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-xs text-gray-500">
                                    {doc.label?.toUpperCase()} Document
                                  </p>

                                  <p className="text-sm font-medium break-words">
                                    {decodeURIComponent(
                                      item?.document?.link?.split("/").pop() ||
                                        "",
                                    )}
                                  </p>
                                </div>
                              </a>

                              {/* Replace */}
                              <label className="flex items-center justify-center p-3 cursor-pointer border-2 border-dashed rounded-lg bg-white hover:bg-gray-100 transition">
                                <p className="text-sm">Replace Document</p>

                                <Input
                                  type="file"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleFile(
                                      index,
                                      "document",
                                      e.target.files?.[0],
                                    )
                                  }
                                />
                              </label>
                            </div>
                          );
                        })()
                      ) : (
                        <div className="rounded-xl space-y-3 bg-slate-200/50 border border-gray-200 p-3">
                          <label className="flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-all duration-200">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-700 mb-2">
                              <Upload size={18} />
                            </div>

                            <p className="text-sm font-medium text-gray-700">
                              Upload Document
                            </p>

                            <p className="text-xs text-gray-400">
                              PDF, DOCX, XLSX, PPTX
                            </p>

                            <Input
                              type="file"
                              className="hidden"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                              onChange={(e) =>
                                handleFile(
                                  index,
                                  "document",
                                  e.target.files?.[0],
                                )
                              }
                            />
                          </label>
                        </div>
                      )}
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
