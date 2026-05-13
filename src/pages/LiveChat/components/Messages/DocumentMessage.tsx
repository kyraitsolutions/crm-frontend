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
  if (message.type !== "document") return null;

  const documentLink = message.media?.document?.link;

  // const fileType = getFileType(documentLink);
  const fileName = getFileName(documentLink);
  const doc = getDocumentMeta(documentLink || "");
  const icon = doc && doc.icon;

  return (
    <div>
      {/* DOCUMENT CARD */}
      <a
        href={documentLink}
        target="_blank"
        download
        rel="noopener noreferrer"
        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
      >
        llll
        {/* ICON */}
        <div className="shrink-0">{icon && <doc.icon />}</div>
        {/* INFO */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-800 break-words">
            {fileName}
          </p>

          {/* <p className="text-xs text-gray-500 uppercase mt-1">
            {fileType} document
          </p> */}
        </div>
        {/* DOWNLOAD */}
        <div className="shrink-0">
          <Download className="size-5 text-blue-500" />
        </div>
      </a>
    </div>
  );
};

export default DocumentMessage;
