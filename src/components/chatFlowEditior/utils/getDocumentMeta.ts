import { FileSpreadsheet, FileText } from "lucide-react";
import { FaFilePdf } from "react-icons/fa";

export const getDocumentMeta = ({
  mimeType = "",
  fileName = "",
}: {
  mimeType?: string;
  fileName?: string;
}) => {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  // First prefer MIME type
  switch (mimeType) {
    case "application/pdf":
      return {
        label: "PDF",
        icon: FaFilePdf,
        cardClass: "file-card pdf",
        accentColor: "#E24B4A",
        iconColor: "#E24B4A",
        badgeBg: "#FCEBEB",
        badgeText: "#A32D2D",
      };

    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return {
        label: "WORD",
        icon: FileText,
        iconColor: "#378ADD",
        badgeBg: "#E6F1FB",
        badgeText: "#185FA5",
      };

    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    case "text/csv":
      return {
        label: "SHEET",
        icon: FileSpreadsheet,
        cardClass: "file-card sheet",
        accentColor: "#1D9E75",
        iconColor: "#1D9E75",
        badgeBg: "#E1F5EE",
        badgeText: "#0F6E56",
      };
  }

  // Fallback to filename extension
  switch (extension) {
    case "pdf":
      return {
        label: "PDF",
        icon: FaFilePdf,
        cardClass: "file-card pdf",
        accentColor: "#E24B4A",
        iconColor: "#E24B4A",
        badgeBg: "#FCEBEB",
        badgeText: "#A32D2D",
      };

    case "doc":
    case "docx":
      return {
        label: "WORD",
        icon: FileText,
        iconColor: "#378ADD",
        badgeBg: "#E6F1FB",
        badgeText: "#185FA5",
      };

    case "xls":
    case "xlsx":
    case "csv":
      return {
        label: "SHEET",
        icon: FileSpreadsheet,
        cardClass: "file-card sheet",
        accentColor: "#1D9E75",
        iconColor: "#1D9E75",
        badgeBg: "#E1F5EE",
        badgeText: "#0F6E56",
      };
  }

  return {
    label: "FILE",
    icon: FileText,
    cardClass: "file-card generic",
    accentColor: "#888780",
    iconColor: "#888780",
    badgeBg: "#F1EFE8",
    badgeText: "#5F5E5A",
  };
};
