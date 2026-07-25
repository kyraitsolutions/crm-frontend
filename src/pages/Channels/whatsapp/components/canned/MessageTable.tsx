import { Button } from '@/components/ui/button';
import { WHATSAPP_PATHS } from '@/constants/routes/whatsapp.path';
import { useAuthStore } from '@/stores';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { TbStarFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const data = [
    {
        id: 1,
        name: "welcome",
        text: "Hi Welcome to kyra it solutions",
        status: "PUBLISHED",
        type: "TEXT",
        createdBy: "Abhijeet",
        createdAt: "July 24, 2026",
        favourite: false
    },
    {
        id: 2,
        name: "1 BHK",
        text: "Hi Welcome to kyra it solutions",
        status: "DRAFT",
        type: "TEXT",
        createdAt: "March 21, 2026",
        favourite: true,
    },]
const MessageTable = ({ type }: { type: string }) => {
    const { accountId } = useAuthStore((state) => state);
    const navigate = useNavigate()

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PUBLISHED":
                return "text-green-600";
            case "DRAFT":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };
    return (
        <div className="mt-6 overflow-hidden ">
            <div className="flex justify-between items-center py-6">
                <div className="relative max-w-sm w-full ">
                    <input
                        type="text"
                        placeholder="Search templates (status, name etc.)"
                        value={""}
                        // onChange={(e) => setContactQuery({ search: e.target.value, })}
                        className="w-full bg-gray-100 rounded-xl! px-4 border-gray-300 py-2.5 pr-8 text-sm text-[#37322F] placeholder:text-[#847971] focus:outline-none focus:border-gray-300 transition"
                    />


                </div>
                <div className="flex items-center gap-2">

                    <Button
                        onClick={() => navigate(WHATSAPP_PATHS.createCannedMessage(String(accountId)))}
                        className="rounded">
                        <Plus />Create
                    </Button>
                    {/* <Button className="rounded action-btn! bg-teal-900 hover:bg-teal-900/80 text-white  hover:text-white transition-all duration-300">
                                    <RefreshCcw />
                                    Sync Status
                                </Button> */}
                </div>
            </div>
            {/* {type} */}
            <div className="overflow-x-auto">
                <table className="w-full table-auto border-separate border-spacing-y-4 ">
                    <thead className="overflow-hidden ">
                        <tr className="text-left text-sm text-green-700 bg-white ">
                            <th className="rounded-l-xl px-6 py-4 font-medium">Name</th>
                            <th className="px-6 py-4 font-medium">Type</th>
                            <th className="px-6 py-4 font-medium">Text</th>
                            <th className="px-6 py-4 font-medium">Status</th>
                            <th className="px-6 py-4 font-medium">Created By</th>
                            <th className="px-6 py-4 font-medium">Created At</th>
                            <th className="rounded-r-xl px-6 py-4 font-medium text-right">Action</th>
                            <th className="px-6 py-4 font-medium">Favourite</th>
                        </tr>

                    </thead>

                    <tbody className=" space-y-1 ">
                        {data.map((item) => {

                            if (type !== "all" && type !== item.status.toLowerCase()) {
                                return null;
                            }
                            return (
                                <tr key={item.id} className="hover:bg-gray-50 mt-1 rounded-2xl text-sm bg-white">
                                    <td className="max-w-55 rounded-l-xl truncate px-6 py-5">
                                        {item.name}
                                    </td>

                                    <td className="px-6 py-5">{item.type}</td>

                                    <td className="px-6 py-5">{item.text}</td>

                                    <td className={`px-6 py-5 text-sm font-medium ${getStatusColor(
                                        item.status
                                    )}`}
                                    >
                                        {item.status}
                                    </td>
                                    {/* <td className="px-6 py-5">
                                        <span className="rounded-full bg-green-500 px-3 py-1 text-xs font-semibold text-white">
                                            {item.health}
                                        </span>
                                    </td> */}

                                    <td className="px-6 py-5">{item.createdBy}</td>
                                    <td className="px-6 py-5">{item.createdAt}</td>

                                    <td className="px-6 py-5 rounded-r-xl">
                                        <div className="flex items-center justify-end gap-3 text-gray-500">
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
                                    <td className="px-6 py-5 rounded-r-xl">
                                        <div className="flex items-center justify-end gap-3 text-gray-500">
                                            {item.favourite && (
                                                <TbStarFilled size={18} className="cursor-pointer text-amber-300" />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MessageTable