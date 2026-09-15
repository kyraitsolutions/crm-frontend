import { useRef, useState } from "react";
import { getAttachmentType } from "../utils/getAttachmentType";
import type { TemplateVariable } from "@/pages/Channels/whatsapp/types/templates/template.type";
import { extractTemplateVariables } from "@/pages/Channels/whatsapp/utils/template/template.utils";
import type { TTemplate } from "@/pages/Channels/whatsapp/types/templates";

export type AttachmentType = "image" | "document" | "video" | "audio";

export type CannedComposerMedia = {
  url: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
  type: AttachmentType;
};

export const useWhatsappComposer = () => {
  // Message
  const [message, setMessage] = useState("");

  // Template
  const [selectedTemplate, setSelectedTemplate] = useState<TTemplate | null>(
    null,
  );
  const [showVariableMapping, setShowVariableMapping] = useState(false);

  const [templateVariables, setTemplateVariables] = useState<
    TemplateVariable[]
  >([]);

  const [templateVariableValues, setTemplateVariableValues] = useState<
    Record<string, string>
  >({});

  // Attachment
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAttachmentType, setSelectedAttachmentType] =
    useState<AttachmentType | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [cannedMedia, setCannedMedia] = useState<CannedComposerMedia | null>(
    null,
  );

  // Popups
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);

  // Voice
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");

  // Loading
  const [sending, setSending] = useState(false);

  // Refs
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleVariableChange = (variableId: string, value: string) => {
    setTemplateVariableValues((prev) => ({
      ...prev,
      [variableId]: value,
    }));
  };

  const handleTemplate = (template: TTemplate) => {
    setSelectedTemplate(template);

    const variables = extractTemplateVariables(template);

    setTemplateVariables(variables);

    if (variables.length === 0) {
      setTemplateVariableValues({});
      setShowVariableMapping(false);
      setShowTemplateMenu(false);
      return;
    }

    const initialValues: Record<string, string> = {};

    variables.forEach((variable) => {
      initialValues[variable.id] = variable.exampleValue;
    });

    setTemplateVariableValues(initialValues);

    setShowTemplateMenu(false);
    setShowVariableMapping(true);
  };

  const removeAttachment = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setCaption("");
    setSelectedAttachmentType(null);
    setCannedMedia(null);
  };

  const handleAttachment = (file: File) => {
    setCannedMedia(null);
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedAttachmentType(getAttachmentType(file));
    setShowAttachmentMenu(false);
  };

  const handleCannedMedia = (media: CannedComposerMedia, nextCaption = "") => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setCannedMedia(media);
    setPreviewUrl(media.url);
    setSelectedAttachmentType(media.type);
    setCaption(nextCaption);
    setShowAttachmentMenu(false);
  };

  return {
    // message
    message,
    setMessage,

    // template
    selectedTemplate,
    templateVariables,
    templateVariableValues,

    setTemplateVariableValues,
    handleVariableChange,

    showVariableMapping,
    setShowVariableMapping,

    handleTemplate,
    // clearTemplate,

    // attachment
    selectedFile,
    previewUrl,
    caption,
    selectedAttachmentType,
    cannedMedia,

    setCaption,
    removeAttachment,
    handleAttachment,
    handleCannedMedia,

    // popups
    showEmojiPicker,
    showAttachmentMenu,
    showTemplateMenu,

    setShowEmojiPicker,
    setShowAttachmentMenu,
    setShowTemplateMenu,

    // voice
    isRecording,
    recordedAudio,
    recordedAudioUrl,

    setIsRecording,
    setRecordedAudio,
    setRecordedAudioUrl,

    // loading
    sending,
    setSending,

    // ref
    inputRef,

    // message,
    // selectedTemplate,
    // templateVariables,
    // templateVariableValues,

    // setTemplateVariableValues,

    // showVariableMapping,
    // setShowVariableMapping,
    // selectedFile,
    // previewUrl,
    // caption,

    // selectedAttachmentType,
    // showEmojiPicker,
    // showAttachmentMenu,
    // showTemplateMenu,

    // isRecording,
    // recordedAudio,
    // recordedAudioUrl,
    // sending,

    // inputRef,

    // setMessage,
    // setCaption,

    // setShowEmojiPicker,
    // setShowAttachmentMenu,
    // setShowTemplateMenu,

    // setIsRecording,
    // setRecordedAudio,
    // setRecordedAudioUrl,
    // setSending,

    // removeAttachment,
    // handleAttachment,
    // handleTemplate,
  };
};
