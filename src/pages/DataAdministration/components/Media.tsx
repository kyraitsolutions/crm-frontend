import { FileSpreadsheet, FileText, ImageIcon, Upload, Video } from "lucide-react";
import { useState } from "react";


type MediaType =
    | "image"
    | "video"
    | "document"
    | "spreadsheet"
    | "other";

type MediaItem = {
    id: number;
    name: string;
    url: string;
    type: MediaType;
    size: string;
    createdAt: string;
};

const mediaData: MediaItem[] = [
    {
        id: 1,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
    {
        id: 2,
        name: "video.mp4",
        url: "",
        type: "video",
        size: "20 MB",
        createdAt: "5 days ago",
    },
    {
        id: 3,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 4,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 5,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 6,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
    {
        id: 7,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 8,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
    {
        id: 9,
        name: "video.mp4",
        url: "",
        type: "video",
        size: "20 MB",
        createdAt: "5 days ago",
    },
    {
        id: 10,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 11,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 12,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
    {
        id: 13,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 14,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 15,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 16,
        name: "video.mp4",
        url: "",
        type: "video",
        size: "20 MB",
        createdAt: "5 days ago",
    },
    {
        id: 17,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 18,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 19,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 20,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
    {
        id: 21,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 22,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
    {
        id: 23,
        name: "video.mp4",
        url: "",
        type: "video",
        size: "20 MB",
        createdAt: "5 days ago",
    },
    {
        id: 24,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 25,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 26,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 27,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 28,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 29,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
    {
        id: 30,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
    {
        id: 31,
        name: "report.pdf",
        url: "",
        type: "document",
        size: "1.2 MB",
        createdAt: "1 week ago",
    },
    {
        id: 32,
        name: "data.xlsx",
        url: "",
        type: "spreadsheet",
        size: "800 KB",
        createdAt: "3 days ago",
    },
    {
        id: 33,
        name: "image1.png",
        url: "",
        type: "image",
        size: "2 MB",
        createdAt: "2 days ago",
    },
];

const getIcon = (type: MediaType) => {
    switch (type) {
        case "image":
            return <ImageIcon size={28} className="text-blue-500" />;
        case "video":
            return <Video size={28} className="text-purple-500" />;
        case "spreadsheet":
            return <FileSpreadsheet size={28} className="text-green-600" />;
        default:
            return <FileText size={28} className="text-gray-500" />;
    }
};

const Media = () => {

    const [filter, setFilter] = useState<MediaType | "all">("all");
    const [filterData, setFilterData] = useState<MediaItem[]>(mediaData);
    const handleFilter = (type: MediaType) => {
        setFilter(type)
        console.log("Type", type)
        const filteredData = type as string === "all" ? mediaData : mediaData.filter((item) => item.type === type);
        setFilterData(filteredData)
    }
    return (
        <div className="">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <div className="">
                    <h1 className="text-xl font-semibold text-gray-700">Media & File Storage</h1>

                    <p className="max-w-6xl text-sm mt-1 text-gray-500">This is your central media library. Every file shared through WhatsApp, chatbot, or campaigns is automatically saved here, making it easy to manage, reuse, and organize your content. You can also upload new media for future use</p>
                </div>


                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    <Upload size={16} />
                    Upload Media
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 mt-4">
                {["all", "image", "video", "document", "spreadsheet"].map((type: any) => (
                    <button
                        key={type}
                        onClick={() => handleFilter(type)}
                        className={`px-3 py-1 rounded-full text-sm border capitalize ${filter === type
                            ? "bg-green-100 text-green-700 border-green-400"
                            : "text-gray-600 border-gray-300"
                            }`}
                    >
                        {type}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-8 gap-4">
                {filterData.map((item) => (
                    <div
                        key={item.id}
                        className="border rounded-xl p-4 hover:shadow-md transition cursor-pointer bg-white"
                    >
                        <div className="h-28 flex items-center justify-center bg-gray-50 rounded-lg mb-3">
                            {item.url && item.type === "image" ? (
                                <img
                                    src={item.url}
                                    alt={item.name}
                                    className="h-full object-cover rounded"
                                />
                            ) : (
                                getIcon(item.type)
                            )}
                        </div>

                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.size}</p>
                        <p className="text-xs text-gray-400">{item.createdAt}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Media