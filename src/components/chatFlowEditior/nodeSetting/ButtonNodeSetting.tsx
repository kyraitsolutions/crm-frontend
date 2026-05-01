import { Button } from "@/components/ui/button";
import ButtonClose from "@/components/ui/Buttons/ButtonClose";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FILE_LIMITS } from "@/constants";
import { ToastMessageService } from "@/services";
import { MediaService } from "@/services/media.service";
import { uploadFileToS3WithPresignedUrl } from "@/utils/s3-upload.utils";
import { DndContext } from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { motion } from "framer-motion";
import { Eye, Pause, Play, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReactFlow } from "reactflow";
import {
  BUTTON_HEADER_CONFIG,
  BUTTON_MODES,
  HEADER_MEDIA_TYPES,
} from "../config";
import { SortableItem } from "../nodes/SortableItem";
import type {
  TAction,
  TAppNodeData,
  TMessageType,
  TMode,
  TQuickReplyButton,
} from "../types/types";
import { getDocumentMeta } from "../utils/getDocumentMeta";
import { getFileExtensionFromMime } from "../utils/getFileExtension.utils";
import { transformToApi } from "../utils/transformToApi.utils";
import { createId } from "../utils/utils";

const MAX_BUTTONS = 10;
const MAX_HEADER = 60;
const MAX_FOOTER = 60;
const MAX_BODY = 1024;
const MAX_BTN_TEXT = 20;

type THeaderState = {
  type: TMessageType;
  text: string;
  media: {
    image?: string | null;
    video?: string | null;
    document?: string | null;
  };
};

type TButtonNodeSettingProps = {
  id?: string;
  data: TAppNodeData;
  onClose?: () => void;
};

const ButtonNodeSetting = ({ id, data, onClose }: TButtonNodeSettingProps) => {
  const { setNodes } = useReactFlow();
  const listRef = useRef<HTMLDivElement>(null);

  const mediaService = new MediaService();
  const toastService = new ToastMessageService();

  const payload = data.type === "button" ? data.payload : null;

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [header, setHeader] = useState<THeaderState>({
    type: "text",
    text: "",
    media: {
      image: payload?.interactive?.header?.image?.link || null,
      video: payload?.interactive?.header?.video?.link || null,
      document: payload?.interactive?.header?.document?.link || null,
    },
  });

  // const [header, setHeader] = useState({
  //   type: payload?.interactive?.header?.type || "text",
  //   text: payload?.interactive?.header?.text || "",
  //   mediaUrl:
  //     payload?.interactive?.header?.image?.link ||
  //     payload?.interactive?.header?.video?.link ||
  //     payload?.interactive?.header?.document?.link ||
  //     "",
  // });

  // const [headerType, setHeaderType] = useState<TMessageType>(
  //   payload?.interactive?.header?.type || "text",
  // );

  // const [headerText, setHeaderText] = useState(
  //   payload?.interactive?.header.text || "",
  // );

  // const [headerImage, setHeaderImage] = useState<string | null>(
  //   payload?.interactive?.header?.image?.link || null,
  // );

  // const [headerVideo, setHeaderVideo] = useState<string | null>(
  //   payload?.interactive?.header?.video?.link || null,
  // );

  // const [headerDocument, setHeaderDocument] = useState<string | null>(
  //   payload?.interactive?.header?.document?.link || null,
  // );

  const [bodyText, setBodyText] = useState(
    payload?.interactive?.body?.text || "",
  );

  const [footerText, setFooterText] = useState(
    payload?.interactive?.footer?.text || "",
  );

  const [urlButton, setUrlButton] = useState({
    text: "",
    url: "",
  });

  const [buttons, setButtons] = useState<TQuickReplyButton[]>(() => {
    const action = payload?.interactive?.action;

    if (action && "buttons" in action) {
      return action.buttons;
    }

    return [];
  });

  const [mode, setMode] = useState<TMode>(() => {
    const action = payload?.interactive?.action;

    if (!action) return "quick_reply";

    return "parameters" in action ? "url" : "quick_reply";
  });

  const handleButtonModeSwitch = (newMode: TMode) => {
    setMode(newMode);

    if (newMode === "url") {
      // clear buttons, init url
      setButtons([]);
      setUrlButton({
        text: "Buy Now",
        url: "",
      });
    } else {
      // clear url, init buttons
      setUrlButton({ text: "", url: "" });

      if (buttons.length === 0) {
        setButtons([
          {
            type: "reply",
            reply: {
              id: createId(),
              title: "Button 1",
            },
          },
        ]);
      }
    }
  };

  const handleHeaderType = (type: string) => {
    setHeader({
      ...header,
      type: type as TMessageType,
    });
  };

  const validate = () => {
    if (!bodyText.trim()) return toastService.error("Body is required");
    if (header?.text.length > MAX_HEADER)
      return toastService.error("Header max 60 characters");
    if (footerText.length > MAX_FOOTER)
      return toastService.error("Footer max 60 characters");
    if (bodyText.length > MAX_BODY)
      return toastService.error("Body max 1024 characters");
    if (buttons.length > 0) {
      buttons.forEach((b, i) => {
        if (b.type === "reply" && !b.reply.title.trim())
          return toastService.error(
            `Button ${i + 1} is empty. Please add text`,
          );
        if (b.type === "reply" && b.reply.title.length > MAX_BTN_TEXT)
          return toastService.error(`Button ${i + 1} exceeds 20 characters`);
      });
    }

    if (mode === "url" && urlButton) {
      if (!urlButton?.text)
        return toastService.error("Button text is required");
      if (!urlButton?.url) return toastService.error("Button url is required");
    }
  };

  const getCurrentMediaUrl = () => {
    return header.media[header.type as keyof typeof header.media];
  };

  // const handleFile = async (file?: File) => {
  //   try {
  //     if (!file) return;

  //     if (file.size > FILE_LIMITS.IMAGE.MAX_SIZE_MB)
  //       return toastService.error("Max Size 5MB");

  //     // setHeader({
  //     //   ...header,
  //     //   type: "image",
  //     // });

  //     const fileType = getFileExtensionFromMime(file.type);

  //     const payload = {
  //       fileName: file.name,
  //       mimeType: fileType,
  //       fileSize: file.size,
  //       type: "chatbot",
  //     };

  //     const response = await mediaService.getMediaUploadPresignedUrl(payload);

  //     const responseStatus = response.status;
  //     const doc = response.data?.doc;

  //     if (responseStatus === 200 || responseStatus === 201) {
  //       await uploadFileToS3WithPresignedUrl(doc.uploadUrl, file);

  //     }
  //   } catch (error: any) {
  //     toastService.apiError(error?.message || "Failed to upload file");
  //   }
  // };
  const handleAddButton = () => {
    if (buttons.length >= MAX_BUTTONS)
      return toastService.error("Max buttons uptp 10. Can't add more");

    setButtons((prev) => [
      ...prev,
      {
        type: "reply",
        reply: {
          id: `btn_${prev.length + 1}_${createId()}`,
          title: `Button ${prev.length + 1}`,
        },
      },
    ]);
  };

  const handleRemove = (id: string) => {
    setButtons((prev) =>
      prev.filter((b) => {
        if (b.type === "reply") {
          return b.reply.id !== id;
        }

        return true;
      }),
    );
  };

  const updateHeaderMedia = (type: TMessageType, url: string) => {
    setHeader((prev) => ({
      ...prev,
      media: {
        image: null,
        video: null,
        document: null,
        [type]: url, // only keep current type
      },
    }));
  };

  const handleFile = async (file?: File) => {
    try {
      if (!file) return;

      const currentType = header.type;

      // 🔹 validate based on type
      const limits =
        FILE_LIMITS[currentType.toUpperCase() as keyof typeof FILE_LIMITS];

      if (limits && file.size > limits.MAX_SIZE_MB) {
        const maxMB = limits.MAX_SIZE_MB / (1024 * 1024);

        return toastService.error(`Max size ${maxMB} MB`);
      }

      // 🔹 instant preview (UX)
      const previewUrl = URL.createObjectURL(file);
      updateHeaderMedia(currentType, previewUrl);

      // 🔹 upload
      const fileType = getFileExtensionFromMime(file.type);

      const payload = {
        fileName: file.name,
        mimeType: fileType,
        fileSize: file.size,
        type: "chatbot",
      };

      const response = await mediaService.getMediaUploadPresignedUrl(payload);
      const doc = response.data?.doc;

      if (response.status === 200 || response.status === 201) {
        await uploadFileToS3WithPresignedUrl(doc.uploadUrl, file);

        // 🔥 replace preview with real URL
        updateHeaderMedia(currentType, doc.fileUrl);
      }
    } catch (error: any) {
      toastService.apiError(error?.message || "Failed to upload file");
    }
  };

  const buildHeaderPayload = (header: THeaderState) => {
    const base = {
      type: header.type,
    };

    if (header.type === "text") {
      return {
        ...base,
        text: header.text,
      };
    }

    const mediaUrl = header.media[header.type];

    if (!mediaUrl) return base;

    return {
      ...base,
      [header.type]: {
        link: mediaUrl,
      },
    };
  };
  const handleSave = () => {
    validate();

    const headerPayload = buildHeaderPayload(header);

    const action =
      mode === "url"
        ? {
            name: "cta_url",
            parameters: {
              display_text: urlButton.text,
              url: urlButton.url,
            },
          }
        : {
            buttons: buttons,
          };

    const payloadData = {
      type: data?.type,
      label: data.label,
      payload: transformToApi({
        type: "interactive",
        interactive: {
          type: "button",
          header: headerPayload,
          body: { text: bodyText },
          footer: { type: "text", text: footerText },
          action: action as TAction,
        },
      }),
    };

    setNodes((nds) =>
      nds.map((n) => (n.id === id ? { ...n, data: payloadData } : n)),
    );
  };

  const setPayloadData = () => {
    // setHeaderText(payload?.interactive?.header.text || "");
    // setHeaderImage(payload?.interactive?.header?.image?.link || null);
    setBodyText(payload?.interactive?.body?.text || "");
    setFooterText(payload?.interactive?.footer?.text || "");
    setHeader({
      type: payload?.interactive?.header?.type || "text",
      text: payload?.interactive?.header?.text || "",
      media: {
        image: payload?.interactive?.header?.image?.link || null,
        video: payload?.interactive?.header?.video?.link || null,
        document: payload?.interactive?.header?.document?.link || null,
      },
    });

    const action = payload?.interactive?.action;
    if (action) {
      const isUrl = (action && "parameters" in action) || false;
      setMode(isUrl ? "url" : "quick_reply");

      if (isUrl && "parameters" in action)
        setUrlButton({
          text: action.parameters.display_text,
          url: action.parameters.url,
        });

      if (!isUrl && "buttons" in action) setButtons(action.buttons);
    }
  };

  useEffect(() => {
    if (payload) setPayloadData();
  }, [payload]);

  // 🔥 Smooth auto scroll
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [buttons.length]);

  const renderHeader = () => {
    const config = BUTTON_HEADER_CONFIG[header.type as TMessageType];
    const currentMediaUrl = getCurrentMediaUrl();
    const doc =
      currentMediaUrl &&
      header.type === "document" &&
      getDocumentMeta(currentMediaUrl || "");
    const Icon = doc && doc.icon;

    const toggleVideo = () => {
      const video = videoRef.current;
      if (!video) return;

      if (video.paused) {
        video.play();
        setIsPlaying(true);
      } else {
        video.pause();
        setIsPlaying(false);
      }
    };

    // 🔹 TEXT
    if (!config.isMedia) {
      return (
        <div>
          <Input
            value={header.text}
            placeholder={config.placeholder}
            onChange={(e) => {
              if (e.target.value.length > MAX_HEADER) return;
              setHeader((prev) => ({
                ...prev,
                text: e.target.value,
              }));
            }}
            className="input-field bg-white/5 border-white/15! text-white"
          />

          <div className="text-right text-[10px] text-gray-500">
            {header.text.length}/{MAX_HEADER}
          </div>
        </div>
      );
    }
    // 🔹 MEDIA (image/video/document SAME UI)
    return (
      <div className="space-y-2">
        {currentMediaUrl ? (
          <div className="relative group border border-white/15 p-1 rounded-lg overflow-hidden">
            {/* PREVIEW */}
            {header.type === "image" && (
              <img
                src={currentMediaUrl}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            {header.type === "video" && (
              <video
                ref={videoRef}
                src={currentMediaUrl}
                className="w-full h-40 object-cover rounded-lg"
                controls
              />
            )}

            {header.type === "document" && doc && (
              <div
                className={`h-40 rounded-lg flex flex-col items-center justify-center gap-3`}
              >
                <div
                  style={{
                    backgroundColor: doc?.badgeBg,
                    color: doc?.iconColor,
                  }}
                  className={`size-16 rounded-2xl flex items-center justify-center`}
                >
                  {Icon && <Icon className="" />}
                </div>

                <div className="text-center space-y-1 px-4">
                  <p className={`text-sm font-medium`}>{doc.label}</p>

                  <p className="text-xs text-white/50 truncate max-w-[220px]">
                    {decodeURIComponent(
                      currentMediaUrl?.split("/").pop() || "",
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* OVERLAY */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition border-2 border-dashed border-white/20 bg-black/40 backdrop-blur-sm rounded-lg">
              {/* ▶ PLAY BUTTON */}
              {/* {header.type === "video" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideo();
                  }}
                  className="size-12 flex justify-center items-center bg-ternary text-primary backdrop-blur-md rounded-full p-3 z-50 cursor-pointer"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
              )} */}

              {header.type === "video" && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleVideo();
                  }}
                  className={` relative size-10 flex items-center justify-center rounded-full cursor-pointer z-50 transition-all duration-300 ease-out shadow-xl border backdrop-blur-xl hover:scale-110 active:scale-95 ${
                    isPlaying
                      ? "bg-red-500/90 border-red-300/40 text-white hover:bg-red-500"
                      : "bg-white/90 border-white/30 text-black hover:bg-white"
                  }`}
                >
                  {/* Icon */}
                  <span className="relative flex items-center justify-center">
                    {isPlaying ? (
                      <Pause size={14} />
                    ) : (
                      <Play size={14} fill="currentColor" />
                    )}
                  </span>
                </button>
              )}

              {header.type === "document" && (
                <Link
                  to={currentMediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="relative size-10 flex items-center justify-center rounded-full cursor-pointer z-50 transition-all duration-300 ease-out shadow-xl border backdrop-blur-xl hover:scale-110 active:scale-95 bg-white/60 border-white/30 text-black hover:bg-white"
                >
                  <Eye size={14} />
                </Link>
              )}

              {/* ⬆ UPLOAD BUTTON */}
              <label className="cursor-pointer flex flex-col items-center gap-1">
                <Upload size={18} />
                <p className="text-sm text-white">Replace {header.type}</p>

                <Input
                  type="file"
                  accept={config.accept}
                  className="hidden"
                  onChange={(e) => handleFile(e.target.files?.[0])}
                />
              </label>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/15 bg-white/5 hover:bg-white/10 rounded-lg cursor-pointer transition h-40">
            <Upload size={18} className="text-blue-400" />
            <p className="text-sm text-white/60">Upload {header.type}</p>

            <Input
              type="file"
              accept={config.accept}
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </label>
        )}

        <p className="text-end p-1 text-xs text-gray-300">
          {`(${config.acceptLabels})`} / (Max size:{" "}
          {config.maxSize / (1024 * 1024)}
          MB)
        </p>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-ternary text-white">
      {/* HEADER */}
      <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Button Message</h2>
          <p className="text-xs text-gray-400">Configure interactive buttons</p>
        </div>
        <ButtonClose onClose={() => onClose && onClose()} />
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto p-5 space-y-3">
        {/* HEADER INPUT */}
        <div className="space-y-3">
          <label className="text-sm text-gray-400 inline-block">
            Header (optional)
          </label>
          {/* TYPE SELECTOR  */}
          <div className="flex gap-2">
            {HEADER_MEDIA_TYPES.map((type) => (
              <Button
                key={type}
                onClick={() => handleHeaderType(type.toLowerCase())}
                className={`node-setting-header-types ${
                  header.type === type.toLowerCase()
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                }`}
              >
                {type}
              </Button>
            ))}
          </div>

          {/* RENDER HEADER  */}
          {renderHeader()}
        </div>

        {/* BODY */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400 inline-block">Body *</label>

          <Textarea
            value={bodyText}
            onChange={(e) => {
              if (e.target.value.length > MAX_BODY) return;
              setBodyText(e.target.value);
            }}
            className="input-field bg-white/5 border-white/15! text-white min-h-40"
            placeholder="Enter message content"
          />

          <div className="text-right text-[10px] text-gray-500">
            {bodyText.length}/{MAX_BODY}
          </div>
        </div>

        {/* FOOTER */}
        <div className="space-y-2">
          <label className="text-sm inline-block text-gray-400">
            Footer (optional)
          </label>

          <Input
            value={footerText}
            onChange={(e) => {
              if (e.target.value.length > MAX_FOOTER) return;
              setFooterText(e.target.value);
            }}
            className="input-field bg-white/5 border-white/15! text-white"
            placeholder="footer"
          />

          <div className="text-right text-[10px] text-gray-500">
            {footerText.length}/{MAX_FOOTER}
          </div>
        </div>

        {/* BUTTON LIST */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label htmlFor="b" className="inline-block">
              Button Mode
            </label>

            <div className="flex items-center gap-2">
              {BUTTON_MODES.map((m) => (
                <Button
                  key={m}
                  onClick={() => handleButtonModeSwitch(m as TMode)}
                  className={`px-3 py-1! text-xs rounded cursor-pointer hover:bg-emerald-500 hover:text-white ${
                    mode === m ? "bg-emerald-500" : "bg-white/5 text-gray-400"
                  }`}
                >
                  {m}
                </Button>
              ))}
            </div>
          </div>

          {mode === "quick_reply" && (
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <label className="text-xs text-slate-500">Buttons</label>

                <p className="text-[11px] text-slate-400">
                  WhatsApp supports only 3 buttons. Extra buttons work in
                  chatbot
                </p>
              </div>

              <Button
                size="sm"
                onClick={handleAddButton}
                className="rounded-xl"
              >
                + Add
              </Button>
            </div>
          )}

          {mode === "quick_reply" ? (
            <div
              ref={listRef}
              className="max-h-52 overflow-y-auto space-y-2 pr-1"
            >
              <DndContext>
                <SortableContext
                  items={buttons.map((b) => {
                    const bData = b.type === "reply" ? b.reply : null;
                    return String(bData?.id);
                  })}
                >
                  {buttons.map((btn, index) => {
                    const btnData = btn.type === "reply" ? btn.reply : null;
                    return (
                      <SortableItem
                        key={btnData?.id}
                        id={String(btnData?.id)}
                        length={buttons.length}
                      >
                        <motion.div
                          layout
                          className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2"
                        >
                          <Input
                            value={btnData?.title}
                            onChange={(e) =>
                              setButtons((prev) =>
                                prev.map((b) => {
                                  if (b.type === "reply") {
                                    return b.reply.id === btnData?.id
                                      ? {
                                          ...b,
                                          reply: {
                                            ...b.reply,
                                            title: e.target.value,
                                          },
                                        }
                                      : b;
                                  }

                                  return b;
                                }),
                              )
                            }
                            className="bg-transparent border-none text-white input-field"
                          />

                          {index !== 0 && (
                            <ButtonClose
                              onClose={() => handleRemove(String(btnData?.id))}
                            />
                          )}
                        </motion.div>
                      </SortableItem>
                    );
                  })}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="space-y-2">
              <Input
                placeholder="Button text"
                value={urlButton.text}
                className="input-field bg-white/5 border-white/15! text-white"
                onChange={(e) =>
                  setUrlButton((prev) => ({
                    ...prev,
                    text: e.target.value,
                  }))
                }
              />

              <Input
                placeholder="https://example.com"
                value={urlButton.url}
                className="input-field bg-white/5 border-white/15! text-white"
                onChange={(e) =>
                  setUrlButton((prev) => ({
                    ...prev,
                    url: e.target.value,
                  }))
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* FOOTER ACTIONS (STICKY) */}
      <div className="p-3 border-t border-white/10 flex justify-end gap-2 bg-[#0f172a]">
        <Button className="node-setting-footer-btns" onClick={onClose}>
          Cancel
        </Button>
        <Button
          className="node-setting-footer-btns node-setting-footer-btns-save"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default ButtonNodeSetting;

// import { Button } from "@/components/ui/button";
// import ButtonClose from "@/components/ui/Buttons/ButtonClose";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { DndContext } from "@dnd-kit/core";
// import { SortableContext } from "@dnd-kit/sortable";
// import { useEffect, useRef, useState } from "react";
// import { useReactFlow } from "reactflow";
// import { SortableItem } from "../nodes/SortableItem";
// import type { TAppNodeData, TButton } from "../types/types";

// const createId = () =>
//   typeof crypto !== "undefined" && "randomUUID" in crypto
//     ? crypto.randomUUID()
//     : Math.random().toString(36).substring(2, 10);

// const MAX_BUTTONS = 3;
// const MAX_HEADER = 60;
// const MAX_FOOTER = 60;
// const MAX_BODY = 1024;
// const MAX_BTN_TEXT = 20;

// type TButtonNodeSettingProps = {
//   id?: string;
//   data: TAppNodeData;
//   onClose?: () => void;
// };

// const ButtonNodeSetting = ({ id, data, onClose }: TButtonNodeSettingProps) => {
//   const { setNodes } = useReactFlow();

//   const payload = data.type === "button" ? data.payload : null;
//   const divRef = useRef<HTMLDivElement>(null);

//   const [header, setHeader] = useState(payload?.interactive?.header.text || "");
//   const [body, setBody] = useState(payload?.interactive?.body?.text || "");
//   const [footer, setFooter] = useState(
//     payload?.interactive?.footer?.text || "",
//   );
//   const [buttons, setButtons] = useState<TButton[] | []>(
//     payload?.interactive?.action?.buttons || [],
//   );
//   const [errors, setErrors] = useState<string[]>([]);

//   const validate = () => {
//     const err: string[] = [];

//     if (!body.trim()) err.push("Body is required");
//     if (header.length > MAX_HEADER) err.push("Header max 60 characters");
//     if (footer.length > MAX_FOOTER) err.push("Footer max 60 characters");
//     if (body.length > MAX_BODY) err.push("Body max 1024 characters");

//     buttons.forEach((b, i) => {
//       if (!b.reply.id.trim()) err.push(`Button ${i + 1} is empty`);
//       if (b.reply.title.length > MAX_BTN_TEXT)
//         err.push(`Button ${i + 1} exceeds 20 characters`);
//     });

//     setErrors(err);
//     return err.length === 0;
//   };

//   const handleAddButton = () => {
//     // const nextCount = buttons.length + 1;

//     setButtons((prev) => [
//       ...prev,
//       {
//         type: "reply",
//         reply: { id: createId(), title: `Button ${prev.length + 1}` },
//       },
//     ]);

//     // if (nextCount > MAX_BUTTONS) {
//     //   // setWaWarningShown(true);
//     //   alert(
//     //     `⚠️ WhatsApp supports only ${MAX_BUTTONS} buttons.\n` +
//     //       `Extra buttons will work in chatbot mode but not in WhatsApp templates.`,
//     //   );
//     // }

//     if (divRef.current) {
//       divRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   const handleRemove = (id: string) => {
//     setButtons((prev) => prev.filter((b) => b.reply.id !== id));
//   };

//   const handleSave = () => {
//     if (!validate()) return;

//     const payload = {
//       type: data?.type,
//       label: data.label,
//       payload: {
//         type: "interactive",
//         interactive: {
//           type: "button",
//           header: { type: "text", text: header },
//           body: { text: body },
//           footer: { text: footer },
//           action: { buttons },
//         },
//       },
//     };

//     setNodes((nds) =>
//       nds.map((n) => (n.id === id ? { ...n, data: payload } : n)),
//     );
//   };

//   useEffect(() => {
//     if (payload) {
//       setHeader(payload?.interactive?.header.text || "");
//       setBody(payload?.interactive?.body?.text || "");
//       setFooter(payload?.interactive?.footer?.text || "");
//       setButtons(payload?.interactive?.action?.buttons || []);
//     }
//   }, [payload]);

//   return (
//     <div className="w-full h-full bg-gradient-to-b from-slate-50 to-white p-5 overflow-y-auto">
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className="text-lg font-semibold text-slate-800">
//           Button Configuration
//         </h2>
//         <p className="text-xs text-slate-500">
//           Design interactive message buttons
//         </p>
//       </div>

//       {/* Errors */}
//       {errors.length > 0 && (
//         <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">
//           {errors.map((e, i) => (
//             <div key={i}>• {e}</div>
//           ))}
//         </div>
//       )}

//       {/* Card Section */}
//       <div className="space-y-4">
//         {/* Header */}
//         <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
//           <label className="text-xs text-slate-500">Header (optional)</label>

//           <Input
//             value={header}
//             onChange={(e) => {
//               if (e.target.value.length > MAX_HEADER) return;
//               setHeader(e.target.value);
//             }}
//             className="input-field mt-1"
//             placeholder="Enter header text"
//           />
//           <div className="text-right text-[11px] text-slate-400 mt-1">
//             {header.length}/{MAX_HEADER}
//           </div>
//         </div>

//         {/* Body */}
//         <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
//           <label className="text-xs text-slate-500">Body (required)</label>
//           <Textarea
//             value={body}
//             onChange={(e) => setBody(e.target.value)}
//             className="input-field min-h-28 mt-2"
//             placeholder="Enter message content"
//           />
//           <div className="text-right text-[11px] text-slate-400 mt-1">
//             {body.length}/{MAX_BODY}
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
//           <label className="text-xs text-slate-500">Footer (optional)</label>
//           <Input
//             value={footer}
//             onChange={(e) => {
//               if (e.target.value.length > MAX_FOOTER) return;
//               setFooter(e.target.value);
//             }}
//             className="input-field mt-1"
//             placeholder="Enter footer text"
//           />
//           <div className="text-right text-[11px] text-slate-400 mt-1">
//             {footer.length}/{MAX_FOOTER}
//           </div>
//         </div>

//         {/* Buttons */}
//         <div className="p-2 rounded-xl bg-white border border-gray-200 space-y-4">
//           <div>
//             <label className="text-xs text-slate-500">Buttons</label>
//             <p className="text-[11px] text-slate-400">
//               WhatsApp supports only {MAX_BUTTONS} buttons. Extra buttons work
//               in chatbot
//             </p>
//           </div>

//           <DndContext>
//             <SortableContext items={buttons?.map((i) => i.reply?.id)}>
//               <div className="space-y-2">
//                 {buttons?.length > 0 &&
//                   buttons?.map((btn) => (
//                     <SortableItem
//                       key={btn.reply?.id}
//                       id={btn.reply?.id}
//                       length={buttons.length}
//                     >
//                       <div className="group actions-btn relative flex items-center rounded-lg  transition">
//                         <Input
//                           value={btn.reply?.title}
//                           onChange={(e) =>
//                             setButtons((prev) =>
//                               prev.map((b) =>
//                                 b.reply?.id === btn.reply?.id
//                                   ? {
//                                       ...b,
//                                       reply: {
//                                         ...b.reply,
//                                         title: e.target.value,
//                                       },
//                                     }
//                                   : b,
//                               ),
//                             )
//                           }
//                           className="flex-1 text-slate-700 bg-transparent input-field border-none"
//                           placeholder="Button text"
//                         />

//                         {/* hover delete */}
//                         <ButtonClose
//                           onClose={() => handleRemove(btn.reply?.id)}
//                           className="absolute right-2 size-5 opacity-0 group-hover:opacity-100 text-xs transition"
//                         />
//                       </div>
//                     </SortableItem>
//                   ))}
//               </div>
//             </SortableContext>
//           </DndContext>

//           <div className="flex justify-end">
//             <Button
//               onClick={handleAddButton}
//               className="text-sm px-3 py-1 rounded-lg bg-slate-800 text-white hover:bg-slate-800 transition"
//             >
//               + Add
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-2 mt-4">
//         <Button
//           onClick={() => onClose && onClose()}
//           className="actions-btn px-4! bg-red-400! hover:bg-red-500! duration-300 text-white!"
//         >
//           Cancel
//         </Button>

//         <Button onClick={handleSave} className="actions-btn px-6!">
//           Save Changes
//         </Button>
//       </div>

//       <div ref={divRef} />
//     </div>
//   );
// };

// export default ButtonNodeSetting;

//   <div className="space-y-3">
//           <label className="text-xs text-gray-400">Header</label>

//           TYPE SELECTOR
//           <div className="flex gap-2">
//             {HEADER_MEDIA_TYPES.map((type) => (
//               <Button
//                 key={type}
//                 onClick={() => setHeaderType(type.toLowerCase())}
//                 className={`node-setting-header-types ${
//                   headerType === type.toLowerCase()
//                     ? "bg-emerald-500 text-white"
//                     : "bg-white/5 text-gray-400 hover:bg-white/10"
//                 }`}
//               >
//                 {type}
//               </Button>
//             ))}
//           </div>

//           TEXT HEADER
//           {headerType === "text" && (
//             <div>
//               <Input
//                 value={headerText}
//                 onChange={(e) => {
//                   if (e.target.value.length > MAX_HEADER) return;
//                   setHeaderText(e.target.value);
//                 }}
//                 className="input-field bg-white/5 border-white/15! text-white"
//                 placeholder="Enter header text"
//               />

//               <div className="text-right text-[10px] text-gray-500">
//                 {headerText.length}/{MAX_HEADER}
//               </div>
//             </div>
//           )}

//           IMAGE HEADER
//           {headerType === "image" && (
//             <div className="space-y-2">
//               {headerImage && (
//                 <div className="relative group border border-white/15! p-1">
//                   <img
//                     src={headerImage}
//                     alt="preview"
//                     className="w-full h-40 object-cover rounded-lg"
//                   />

//                   <label className="group-hover:opacity-100 opacity-0 flex justify-center items-center flex-col  absolute top-0 left-0 w-full h-full  p-6 cursor-pointer border-2 border-dashed border-white/20 rounded-lg  transition-all duration-500 backdrop-blur-xs bg-black/10">
//                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mb-2">
//                       <Upload size={18} />
//                     </div>

//                     <p className="text-sm font-medium text-white">
//                       Replace Image
//                     </p>

//                     <Input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={(e) => handleFile(e.target.files?.[0])}
//                     />
//                   </label>
//                 </div>
//               )}

//               Upload Box
//               {!headerImage && (
//                 <div>
//                   <label className="flex flex-col items-center justify-center p-6 cursor-pointer border-2 border-dashed border-white/15 bg-white/5 hover:bg-white/10 ounded-lg transition-all duration-200">
//                     <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 mb-2">
//                       <Upload size={18} />
//                     </div>

//                     <p className="text-sm font-medium text-white/60">
//                       Upload Image
//                     </p>

//                     <Input
//                       type="file"
//                       accept={FILE_LIMITS.IMAGE.ACCEPTED_TYPES}
//                       className="hidden"
//                       onChange={(e) => handleFile(e.target.files?.[0])}
//                     />
//                   </label>

//                   <p className="text-end p-1 text-xs text-gray-300">
//                     (png, jpg, jpeg) / (Max size: 5mb)
//                   </p>
//                 </div>
//               )}
//             </div>
//           )}
//  </div>
