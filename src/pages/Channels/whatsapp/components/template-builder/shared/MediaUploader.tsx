import { FileText, UploadCloud } from "lucide-react";

interface IMediaUploaderProps {
  title: string;
  description: string;
  accept: string;
  file?: File | null;
  previewUrl?: string;
  onChange: (file: File | null) => void;
}

export function MediaUploader({
  title,
  description,
  accept,
  file,
  previewUrl,
  onChange,
}: IMediaUploaderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onChange(selected);
  };

  const renderPreview = () => {
    if (!file || !previewUrl) return null;

    if (file.type.startsWith("image/")) {
      return (
        <img
          src={previewUrl}
          alt="preview"
          className="h-44 w-full rounded-lg object-cover"
        />
      );
    }

    if (file.type.startsWith("video/")) {
      return (
        <video src={previewUrl} controls className="h-44 w-full rounded-lg" />
      );
    }

    return (
      <div className="flex items-center gap-3 rounded-lg border p-4">
        <FileText className="h-8 w-8 text-gray-500" />
        <div>
          <p className="font-medium">{file.name}</p>
          <p className="text-xs text-gray-500">
            {(file.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      {renderPreview()}

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-8 transition hover:border-green-500 hover:bg-green-50">
        <UploadCloud className="mb-2 h-8 w-8 text-gray-400" />

        <p className="font-medium">Drag & drop or click to upload</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Supported: {accept}
        </p>

        <input hidden type="file" accept={accept} onChange={handleChange} />
      </label>
    </div>
  );
}
