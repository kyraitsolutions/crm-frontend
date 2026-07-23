import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface IUploadDropzoneProps {
  accept: string;
  inputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (file: File) => void;
}

export function UploadDropzone({ accept, onFileSelect }: IUploadDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;

    onFileSelect(file);
  };

  return (
    <>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);

          handleFile(e.dataTransfer.files[0]);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-all
        ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-300 hover:border-green-400 hover:bg-gray-50"
        }`}
      >
        <UploadCloud size={42} className="mb-3 text-muted-foreground" />

        <p className="text-sm font-medium">Drag & drop your file here</p>

        <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
      </div>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept={accept}
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </>
  );
}
