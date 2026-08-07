import type { AttachmentType } from "../hooks/useWhatsappComposer";

export type OutgoingMessage =
  | {
      type: "text";
      payload: {
        text: string;
      };
    }
  | {
      type: "media";
      payload: {
        file: File;
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
        templateId: string;
        templateName: string;
        language: string;
        parameters?: string[];
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
): OutgoingMessage | null => {
  // Template

  if (composer.selectedTemplate) {
    return {
      type: "template",
      payload: {
        templateId: composer.selectedTemplate.id,
        templateName: composer.selectedTemplate.name,
        language: composer.selectedTemplate.language,
        parameters: composer.selectedTemplate.parameters,
      },
    };
  }

  // Audio
  if (composer.recordedAudio) {
    return {
      type: "media",
      payload: {
        file: composer.recordedAudio,
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
