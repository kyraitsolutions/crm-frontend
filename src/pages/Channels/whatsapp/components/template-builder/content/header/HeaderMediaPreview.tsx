import { Button } from "@/components/ui/button";
import { FileText, ImageIcon, Trash2 } from "lucide-react";

interface IHeaderMediaPreviewProps {
  type: "Image" | "Video" | "Document";
  file: File;
  previewUrl?: string;

  onReplace: () => void;
  onRemove: () => void;
}

export function HeaderMediaPreview({
  type,
  file,
  previewUrl,
  //   onReplace,
  onRemove,
}: IHeaderMediaPreviewProps) {
  const renderPreview = () => {
    switch (type) {
      case "Image":
        return (
          <img
            src={previewUrl}
            alt={file.name}
            className="h-56 w-full rounded-lg object-cover"
          />
        );

      case "Video":
        return (
          <video controls src={previewUrl} className="h-56 w-full rounded-lg" />
        );

      case "Document":
        return (
          <div className="flex h-56 flex-col items-center justify-center rounded-lg border bg-muted/30">
            <FileText className="mb-3 h-14 w-14 text-primary" />

            <p className="font-medium">{file.name}</p>

            <p className="text-sm text-muted-foreground">PDF Document</p>
          </div>
        );

      default:
        return (
          <div className="flex h-56 items-center justify-center rounded-lg border">
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 rounded-xl border p-4">
      {renderPreview()}

      <div className="flex items-center justify-between">
        <div>
          <p className="truncate text-sm font-medium">{file.name}</p>

          <p className="text-xs text-muted-foreground">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>

        <div className="flex gap-2">
          {/* <Button type="button" variant="outline" size="sm" onClick={onReplace}>
            <UploadCloud className="mr-2 h-4 w-4" />
            Replace
          </Button> */}

          <Button
            type="button"
            className="actions-btn px-2! hover:bg-destructive! hover:text-white!"
            // variant="destructive"
            // size="sm"
            onClick={onRemove}
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
}
