import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WHATSAPP_PATHS } from '@/constants/routes/whatsapp.path';
import { ToastMessageService } from '@/services';
import { useAuthStore } from '@/stores';
import type { ApiError } from '@/types';
import { Copy, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { TbStarFilled } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { whatsappCannedMessageService } from '../../services/whatsapp-canned.service';
import { useCannedMessageStore } from '../../store/canned-message.store';
import { filterCannedMessages } from '../../utils/canned-message.utils';

const MessageTable = ({ type }: { type: string }) => {
    const { accountId } = useAuthStore((state) => state);
    const navigate = useNavigate()
    const { messages, loading, fetchMessages, removeMessage, upsertMessage } =
        useCannedMessageStore((state) => state);
    const [search, setSearch] = useState("");
    const toastService = new ToastMessageService();

    useEffect(() => {
        if (!accountId) return;
        void fetchMessages(String(accountId), { force: true });
    }, [accountId, fetchMessages]);

    const rows = useMemo(() => {
        return filterCannedMessages(messages, search).filter((item) => {
            if (type === "all") return true;
            return item.status.toLowerCase() === type.toLowerCase();
        });
    }, [messages, search, type]);

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

    const handleCopy = async (shortcut: string) => {
        try {
            await navigator.clipboard.writeText(`/${shortcut}`);
            toastService.success("Shortcut copied");
        } catch {
            toastService.error("Unable to copy shortcut");
        }
    };

    const handleDelete = async (id: string) => {
        if (!accountId) return;
        try {
            await whatsappCannedMessageService.remove(String(accountId), id);
            removeMessage(id);
            toastService.success("Canned message deleted");
        } catch (error) {
            const err = error as ApiError;
            toastService.apiError(err.message || "Failed to delete canned message");
        }
    };

    const handleFavourite = async (id: string) => {
        if (!accountId) return;
        try {
            const response = await whatsappCannedMessageService.toggleFavourite(
                String(accountId),
                id,
            );
            if (response.data?.doc) upsertMessage(response.data.doc);
        } catch (error) {
            const err = error as ApiError;
            toastService.apiError(err.message || "Failed to update favourite");
        }
    };

    return (
        <div className="mt-6 overflow-hidden ">
            <div className="flex justify-between items-center py-6">
                <div className="relative max-w-sm w-full ">
                    <Input
                        type="text"
                        placeholder="Search templates (status, name etc.)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field bg-white!"
                    />


                </div>
                <div className="flex items-center gap-2">

                    <Button
                        onClick={() => navigate(WHATSAPP_PATHS.createCannedMessage())}
                        className="rounded py-1.5!">
                        <Plus />Create
                    </Button>
                </div>
            </div>
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
                        {loading && messages.length === 0 ? (
                            <tr className="bg-white text-sm">
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                                    Loading canned messages...
                                </td>
                            </tr>
                        ) : rows.length === 0 ? (
                            <tr className="bg-white text-sm">
                                <td colSpan={8} className="px-6 py-8 text-center text-gray-400">
                                    {search ? "No canned messages found" : "No canned messages yet"}
                                </td>
                            </tr>
                        ) : rows.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 mt-1 rounded-2xl text-sm bg-white">
                                    <td className="max-w-55 rounded-l-xl truncate px-6 py-5">
                                        {item.name}
                                    </td>

                                    <td className="px-6 py-5 uppercase">{item.type}</td>

                                    <td className="px-6 py-5 max-w-xs truncate">{item.text}</td>

                                    <td className={`px-6 py-5 text-sm font-medium ${getStatusColor(
                                        item.status
                                    )}`}
                                    >
                                        {item.status}
                                    </td>

                                    <td className="px-6 py-5">{item.createdByName}</td>
                                    <td className="px-6 py-5">
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString("en-US", {
                                                month: "long",
                                                day: "numeric",
                                                year: "numeric",
                                            })
                                            : ""}
                                    </td>

                                    <td className="px-6 py-5 rounded-r-xl">
                                        <div className="flex items-center justify-end gap-3 text-gray-500">
                                            <Copy
                                                size={18}
                                                className="cursor-pointer hover:text-black"
                                                onClick={() => handleCopy(item.shortcut)}
                                            />

                                            <Trash2
                                                size={18}
                                                className="cursor-pointer hover:text-red-500"
                                                onClick={() => handleDelete(item.id)}
                                            />
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 rounded-r-xl">
                                        <div className="flex items-center justify-end gap-3 text-gray-500">
                                            <TbStarFilled
                                                size={18}
                                                className={`cursor-pointer ${item.favourite ? "text-amber-300" : "text-gray-300"}`}
                                                onClick={() => handleFavourite(item.id)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default MessageTable
