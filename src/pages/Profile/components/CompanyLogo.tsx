import { Camera } from "lucide-react";
import { useRef } from "react";

const CompanyLogo = ({
  name,
  logo,
  setFormData,
  isEdit,
}: {
  name: string;
  logo: string;
  isEdit: boolean;
  setFormData?: (data: any) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);

      // update parent form state
      if (setFormData)
        setFormData((prev: any) => ({
          ...prev,
          logoUrl: previewUrl,
          logoFile: file, // optional (for API upload later)
        }));
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Image */}
      <div className="relative">
        <div
          className={`w-20 h-20 rounded-full overflow-hidden border border-slate-200 ${isEdit && "cursor-pointer"}`}
          onClick={() => isEdit && handleImageClick()}
        >
          <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>

        {/* Camera Icon */}

        {isEdit && (
          <div
            onClick={handleImageClick}
            className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full cursor-pointer"
          >
            <Camera size={14} />
          </div>
        )}
      </div>

      {/* Name */}
      <div>
        <p className="text-lg font-semibold text-slate-800">
          {name || "Company"}
        </p>
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default CompanyLogo;
