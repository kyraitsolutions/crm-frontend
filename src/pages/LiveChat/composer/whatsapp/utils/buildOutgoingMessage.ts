import type { AttachmentType } from "../hooks/useWhatsappComposer";

export type TTemplateOutgoingComponent = {
  type: "HEADER" | "BODY";
  text?: string;
  parameters?: string[];
};

export type TOutgoingMessage =
  | {
      type: "text";
      payload: {
        text: string;
      };
    }
  | {
      type: "media";
      payload: {
        file?: File | Blob;
        link?: string;
        fileName?: string;
        mimeType?: string;
        size?: number;
        attachmentType: AttachmentType;
        caption?: string;
      };
    }
  | {
      type: "audio";
      payload: {
        audio: Blob;
      };
    }
  | {
      type: "template";
      payload: {
        name: string;
        language: string;
        category: string;
        components: any[];
      };
    };

interface ComposerState {
  message: string;

  selectedFile: File | null;
  selectedAttachmentType?: AttachmentType | null;
  caption: string;
  cannedMedia?: {
    url: string;
    fileName?: string;
    mimeType?: string;
    size?: number;
    type: AttachmentType;
  } | null;

  recordedAudio: Blob | null;

  selectedTemplate: {
    id: string;
    name: string;
    language: string;
    parameters?: string[];
  } | null;
}

export const buildOutgoingMessage = (
  composer: ComposerState,
): TOutgoingMessage | null => {
  // Audio
  if (composer.recordedAudio) {
    return {
      type: "media",
      payload: {
        file: composer.recordedAudio as Blob,
        attachmentType: "audio",
      },
    };
  }

  // Media
  if (composer.selectedFile || composer.cannedMedia) {
    return {
      type: "media",
      payload: {
        file: composer.selectedFile || undefined,
        link: composer.cannedMedia?.url,
        fileName: composer.cannedMedia?.fileName || composer.selectedFile?.name,
        mimeType: composer.cannedMedia?.mimeType || composer.selectedFile?.type,
        size: composer.cannedMedia?.size || composer.selectedFile?.size,
        attachmentType:
          composer.selectedAttachmentType ??
          composer.cannedMedia?.type ??
          "document",
        caption: composer.caption,
      },
    };
  }

  // Text

  if (composer.message.trim()) {
    return {
      type: "text",
      payload: {
        text: composer.message.trim(),
      },
    };
  }

  return null;
};
