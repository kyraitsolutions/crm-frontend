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
        file: File | Blob;
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
  if (composer.selectedFile) {
    return {
      type: "media",
      payload: {
        file: composer.selectedFile,
        attachmentType: composer.selectedAttachmentType ?? "document",
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
