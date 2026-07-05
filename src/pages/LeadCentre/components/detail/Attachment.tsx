import { useRef, useState } from "react";
import {
    ChevronDown,
    FileImage,
    FileText,
    Link as LinkIcon,
    Upload,
    X,
} from "lucide-react";

interface Attachment {
    id: string;
    type: "url" | "file";
    fileName: string;
    url?: string;
    uploadedBy: string;
    dateAdded: string;
    size?: string;
    fileType: "image" | "pdf" | "link";
}

const Attachment = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [showDropdown, setShowDropdown] = useState(false);
    const [showUrlModal, setShowUrlModal] = useState(false);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);

    const [url, setUrl] = useState("");
    const [urlName, setUrlName] = useState("");

    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [attachments, setAttachments] = useState<Attachment[]>([
        {
            id: "1",
            type: "file",
            fileName: "Screenshot 2025-06-18 153055.png",
            uploadedBy: "Abhijeet Singh",
            dateAdded: "19/05/2026 09:13 AM",
            size: "24.14 KB",
            fileType: "image",
        },
        {
            id: "2",
            type: "url",
            fileName: "301 Moved",
            url: "https://example.com",
            uploadedBy: "Abhijeet Singh",
            dateAdded: "19/05/2026 09:12 AM",
            size: "-",
            fileType: "link",
        },
        {
            id: "3",
            type: "file",
            fileName: "Invoice.pdf",
            uploadedBy: "Abhijeet Singh",
            dateAdded: "19/05/2026 09:10 AM",
            size: "1.2 MB",
            fileType: "pdf",
        },
    ]);

    const getCurrentDateTime = () => {
        return new Date().toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(2)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    };

    const handleSaveUrl = () => {
        if (!url || !urlName) return;

        const newAttachment: Attachment = {
            id: Date.now().toString(),
            type: "url",
            fileName: urlName,
            url,
            uploadedBy: "Abhijeet Singh",
            dateAdded: getCurrentDateTime(),
            size: "-",
            fileType: "link",
        };

        setAttachments((prev) => [newAttachment, ...prev]);

        setUrl("");
        setUrlName("");
        setShowUrlModal(false);
    };

    const handleSaveMedia = () => {
        if (!selectedFile) return;

        const fileExtension =
            selectedFile.type === "application/pdf"
                ? "pdf"
                : "image";

        const newAttachment: Attachment = {
            id: Date.now().toString(),
            type: "file",
            fileName: selectedFile.name,
            uploadedBy: "Abhijeet Singh",
            dateAdded: getCurrentDateTime(),
            size: formatFileSize(selectedFile.size),
            fileType: fileExtension,
        };

        setAttachments((prev) => [newAttachment, ...prev]);

        setSelectedFile(null);
        setShowMediaModal(false);
    };

    const renderIcon = (
        type: Attachment["fileType"]
    ) => {
        switch (type) {
            case "image":
                return (
                    <FileImage
                        size={16}
                        className="text-green-600 shrink-0"
                    />
                );

            case "pdf":
                return (
                    <FileText
                        size={16}
                        className="text-red-500 shrink-0"
                    />
                );

            case "link":
                return (
                    <LinkIcon
                        size={16}
                        className="text-blue-500 shrink-0"
                    />
                );

            default:
                return null;
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl overflow-hidden">
                {/* Header */}
                <div onClick={() => setShowAttachment((prev) => !prev)} className={`flex cursor-pointer items-center justify-between ${showAttachment && "border-b"} border-gray-200 px-5 py-2.5`}>
                    <h2 className="text-md font-semibold">
                        Attachments
                    </h2>

                    <div className="relative">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowDropdown((prev) => !prev)
                            }
                            }
                            className="bg-second/10 text-sm  text-second font-medium border border-second rounded-xl px-4 py-1 flex items-center gap-2 hover:opacity-90 transition"
                        >
                            Attach
                            <ChevronDown size={16} />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 bg-white  rounded-xl shadow-md z-20 overflow-hidden">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowMediaModal(true);
                                        setShowDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left whitespace-nowrap text-sm hover:bg-gray-100"
                                >
                                    Upload Media
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowUrlModal(true);
                                        setShowDropdown(false);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                >
                                    Add URL
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Table */}
                {showAttachment && <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-white border-b">
                            <tr className="text-left">
                                <th className="px-5 py-3 font-medium ">
                                    File Name
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Attached By
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Date Added
                                </th>
                                <th className="px-5 py-3 font-medium">
                                    Size
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {attachments.map((item) => (
                                <tr
                                    key={item.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            {renderIcon(item.fileType)}

                                            {item.type === "url" ? (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {item.fileName}
                                                </a>
                                            ) : (
                                                <span className="text-gray-700">
                                                    {item.fileName}
                                                </span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4 text-gray-700">
                                        {item.uploadedBy}
                                    </td>

                                    <td className="px-5 py-4 text-gray-700">
                                        {item.dateAdded}
                                    </td>

                                    <td className="px-5 py-4 text-gray-700">
                                        {item.size}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </div>

            {/* URL Modal */}
            {showUrlModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-5">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-md font-semibold">
                                Add URL
                            </h3>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowUrlModal(false)
                                }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <input
                                value={url}
                                type="url"
                                required
                                onChange={(e) =>
                                    setUrl(e.target.value)
                                }
                                placeholder="Enter URL"
                                className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                            />

                            {url && (
                                <input
                                    value={urlName}
                                    onChange={(e) =>
                                        setUrlName(e.target.value)
                                    }
                                    placeholder="Enter URL Name"
                                    className="w-full border rounded-xl px-3 py-2 text-sm outline-none"
                                />
                            )}

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() =>
                                        setShowUrlModal(false)
                                    }
                                    className="px-4 py-1 text-sm border rounded-xl"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSaveUrl}
                                    className="px-4 py-1 text-sm bg-second rounded-xl text-white"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Media Modal */}
            {showMediaModal && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl w-full max-w-md p-5">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-md font-semibold">
                                Upload Media
                            </h3>

                            <button
                                onClick={() =>
                                    setShowMediaModal(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div
                                onClick={() =>
                                    fileInputRef.current?.click()
                                }
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer flex flex-col items-center justify-center"
                            >
                                <Upload size={24} />

                                <p className="text-sm text-gray-600 mt-2">
                                    Upload Image or PDF
                                </p>

                                {selectedFile && (
                                    <p className="text-sm mt-2 text-gray-800">
                                        {selectedFile.name}
                                    </p>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                hidden
                                accept="image/*,.pdf"
                                onChange={(e) =>
                                    setSelectedFile(
                                        e.target.files?.[0] || null
                                    )
                                }
                            />

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() =>
                                        setShowMediaModal(false)
                                    }
                                    className="px-4 py-1 text-sm border rounded-xl"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleSaveMedia}
                                    className="px-4 py-1 text-sm bg-second text-white rounded-xl"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Attachment;