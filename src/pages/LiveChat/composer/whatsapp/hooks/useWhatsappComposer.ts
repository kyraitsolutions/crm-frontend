import { useRef, useState } from "react";
import { getAttachmentType } from "../utils/getAttachmentType";

export type AttachmentType = "image" | "document" | "video" | "audio";

export const useWhatsappComposer = () => {
  // Message
  const [message, setMessage] = useState("");

  // Template
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Attachment
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedAttachmentType, setSelectedAttachmentType] =
    useState<AttachmentType | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [caption, setCaption] = useState("");

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
  const inputRef = useRef<HTMLInputElement>(null);

  const handleTemplate = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateMenu(false);
  };

  const removeAttachment = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setCaption("");
    setSelectedAttachmentType(null);
  };

  const handleAttachment = (file: File) => {
    setSelectedFile(file);
    // Only preview images/videos
    setPreviewUrl(URL.createObjectURL(file));
    setSelectedAttachmentType(getAttachmentType(file));
    setShowAttachmentMenu(false);
  };

  return {
    message,
    selectedTemplate,
    selectedFile,
    previewUrl,
    caption,

    selectedAttachmentType,
    showEmojiPicker,
    showAttachmentMenu,
    showTemplateMenu,

    isRecording,
    recordedAudio,
    recordedAudioUrl,
    sending,

    inputRef,

    setMessage,
    setCaption,

    setShowEmojiPicker,
    setShowAttachmentMenu,
    setShowTemplateMenu,

    setIsRecording,
    setRecordedAudio,
    setRecordedAudioUrl,
    setSending,

    removeAttachment,
    handleAttachment,
    handleTemplate,
  };
};
