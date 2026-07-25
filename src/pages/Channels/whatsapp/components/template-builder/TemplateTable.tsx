import { Copy, Star, Trash2 } from "lucide-react";

const columns = [
    "Name",
    "Category",
    "Status",
    "Type",
    "Health",
    "Created At",
    "Action",
];

const data = [
    {
        id: 1,
        name: "marketing_english_24...",
        category: "MARKETING",
        status: "PENDING",
        type: "CAROUSEL",
        health: "High",
        createdAt: "July 24, 2026",
    },
    {
        id: 2,
        name: "holi_abandoned_cart_...",
        category: "UTILITY",
        status: "APPROVED",
        type: "TEXT",
        health: "High",
        createdAt: "March 21, 2026",
        favourite: true,
    },
    {
        id: 3,
        name: "cart_drop_without_inc...",
        category: "MARKETING",
        status: "REJECTED",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 4,
        name: "order_information",
        category: "UTILITY",
        status: "REJECTED",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 5,
        name: "cart_drop_with_incent...",
        category: "MARKETING",
        status: "REJECTED",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
    {
        id: 6,
        name: "cart_drop_with...",
        category: "MARKETING",
        status: "DRAFT",
        type: "TEXT",
        health: "High",
        createdAt: "May 14, 2025",
    },
];


const getStatusColor = (status: string) => {
    switch (status) {
        case "APPROVED":
            return "text-green-600";
        case "REJECTED":
            return "text-red-500";
        case "DRAFT":
            return "text-red-500";
        default:
            return "text-gray-500";
    }
};

const TemplateTable = ({ type }: { type: string }) => {
    console.log("Fetch templates according to this type", type);

    return (
        <div className="mt-6 overflow-hidden ">

            {/* {type} */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-separate border-spacing-y-4 ">
                    <thead className="overflow-hidden ">
                        <tr className="text-left text-sm text-green-700 bg-white ">
                            <th className="rounded-l-xl px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Category</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Health</th>
                            <th className="px-6 py-4 font-medium">Created At</th>
                            <th className="rounded-r-xl px-6 py-4 font-medium text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody className=" space-y-1 ">
                        {data.map((item) => {

                            if (type !== "all" && type !== item.status.toLowerCase()) {
                                return null;
                            }
                            return (
                                <tr key={item.id} className="hover:bg-gray-50 mt-1 rounded-2xl text-sm bg-white">
                                    <td className="max-w-[220px] rounded-l-xl truncate px-6 py-5">
                                        {item.name}
                                    </td>

                                    <td className="px-6 py-5">{item.category}</td>

                                    <td
                                        className={`px-6 py-5 text-sm font-medium ${getStatusColor(
                                            item.status
                                        )}`}
                                    >
                                        {item.status}
                                    </td>

                                    <td className="px-6 py-5">{item.type}</td>

                                    <td className="px-6 py-5">
                                        <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                            {item.health}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5">{item.createdAt}</td>

                                    <td className="px-6 py-5 rounded-r-xl">
                                        <div className="flex items-center justify-end gap-3 text-gray-500">
                                            {item.favourite && (
                                                <Star size={18} className="cursor-pointer" />
                                            )}

                                            <Copy
                                                size={18}
                                                className="cursor-pointer hover:text-black"
                                            />

                                            <Trash2
                                                size={18}
                                                className="cursor-pointer hover:text-red-500"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TemplateTable;