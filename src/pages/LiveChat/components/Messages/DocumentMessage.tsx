import {
  // File,
  // FileSpreadsheet,
  // FileText,
  // FileArchive,
  // Presentation,
  Download,
} from "lucide-react";

import type { TMessage } from "../../types/message.type";
// import { FaFilePdf } from "react-icons/fa";
import { getDocumentMeta } from "@/components/chatFlowEditior/utils/getDocumentMeta";
import { getWhatsappMediaUrl } from "../../utils/getWhatsappMediaUrl";
import { useAuthStore } from "@/stores";

type TDocumentMessageProps = {
  message: TMessage;
};

const getFileName = (url?: string) => {
  if (!url) return "document";

  try {
    return decodeURIComponent(url.split("/").pop() || "document");
  } catch {
    return "document";
  }
};

const DocumentMessage = ({ message }: TDocumentMessageProps) => {
  const accountId = useAuthStore((state) => state.accountId);

  if (message.type !== "document") return null;

  const document = message.media?.document;

  const documentLink = document?.id
    ? `${getWhatsappMediaUrl(String(accountId), document?.id)}`
    : document?.link || "";

  // const fileType = getFileType(documentLink);
  // const fileName = getFileName(documentLink);
  const fileName = document.filename || getFileName(documentLink) || "Document";
  const mimeType = document.mimetype || "";

  const doc = getDocumentMeta({
    fileName,
    mimeType,
  });

  // PDF preview
  if (["application/pdf"].includes(mimeType)) {
    return (
      <div className="w-full max-w-md overflow-hidden rounded-2xl border-0 bg-white">
        {/* <iframe
          src={documentLink}
          title={fileName}
          seamless
          className="w-full h-40 overflow-hidden border-0"
        /> */}

        <div className="flex items-center gap-3 p-3 bg-gray-50">
          <div
            className="shrink-0"
            style={{
              color: doc?.iconColor,
            }}
          >
            {<doc.icon className="size-6" />}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-800 break-all">
              {fileName}
            </p>
          </div>

          <a
            href={documentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0"
          >
            <Download className="size-5 text-blue-500" />
          </a>
        </div>
      </div>
    );
  }

  // Other documents
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
      <div
        className="shrink-0"
        style={{
          color: doc?.iconColor,
        }}
      >
        {<doc.icon className="size-6" />}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-800 break-all">
          {fileName}
        </p>
      </div>

      <a
        href={documentLink}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 cursor-pointer"
      >
        <Download className="size-5 text-blue-500" />
      </a>
    </div>
  );
};

export default DocumentMessage;
