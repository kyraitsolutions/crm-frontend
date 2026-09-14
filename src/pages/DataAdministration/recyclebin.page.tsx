import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores";
import { recyclebinService } from "./services/recyclebin.service";
import { ToastMessageService } from "@/services";
import { Checkbox } from "@/components/ui/checkbox";
import { formatTime } from "@/utils/date-utils";

type RecycleItem = {
  id: string;
  name: string;
  type: string;
  deletedAt?: string;
  expiresAt?: string;
};

const Recyclebin = () => {
  const { accountId } = useAuthStore();
  const toast = new ToastMessageService();
  const [docs, setDocs] = useState<RecycleItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!accountId) return;
    setLoading(true);
    try {
      const response = await recyclebinService.list(String(accountId));
      setDocs(response.data?.docs || []);
      setSelected([]);
    } catch (error: any) {
      toast.error(error?.message || "Could not load recycle bin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, [accountId]);

  const selectedItems = () => selected;

  const restore = async () => {
    if (!accountId || !selected.length) return;
    try {
      await recyclebinService.restore(String(accountId), selectedItems());
      toast.success("Records restored");
      await load();
    } catch (error: any) {
      toast.error(error?.message || "Could not restore");
    }
  };

  const remove = async () => {
    if (!accountId || !selected.length) return;
    try {
      await recyclebinService.remove(String(accountId), selectedItems());
      toast.success("Records deleted permanently");
      await load();
    } catch (error: any) {
      toast.error(error?.message || "Could not delete");
    }
  };

  const empty = async () => {
    if (!accountId) return;
    try {
      await recyclebinService.empty(String(accountId));
      toast.success("Recycle bin emptied");
      await load();
    } catch (error: any) {
      toast.error(error?.message || "Could not empty recycle bin");
    }
  };

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  return (
    <div className="py-10 h-[calc(100vh-114px)] overflow-y-scroll hide-scrollbar bg-gray-50">
      <div className="mx-24">
        <h2 className="text-lg font-semibold mb-2">Recycle Bin</h2>
        <p className="text-sm text-gray-600 mb-4">
          Deleted chats and contacts stay here for 30 days. Restore them before
          they are permanently removed.
        </p>

        <div className="bg-white rounded-2xl p-5 mb-4">
          <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1 mb-4">
            <li>Records are kept for 30 days after deletion.</li>
            <li>Restore brings the conversation (and contact, if deleted) back.</li>
            <li>Permanent delete cannot be undone.</li>
          </ul>

          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                disabled={!selected.length}
                onClick={() => void restore()}
                className="px-4 py-1.5 text-sm bg-blue-100 text-blue-600 rounded disabled:opacity-50"
              >
                Restore
              </button>
              <button
                disabled={!selected.length}
                onClick={() => void remove()}
                className="px-4 py-1.5 text-sm bg-red-100 text-red-600 rounded disabled:opacity-50"
              >
                Delete
              </button>
            </div>

            <button
              onClick={() => void empty()}
              className="px-4 py-1.5 text-sm border border-red-300 text-red-600 rounded"
            >
              Empty Recycle Bin
            </button>
          </div>
          <div className="bg-white border rounded-2xl mt-2">
            <div className="flex justify-between p-4 text-sm text-gray-500 border-b">
              <span>
                {loading
                  ? "Loading..."
                  : `Displaying ${docs.length} record${docs.length === 1 ? "" : "s"}`}
              </span>
            </div>

            <table className="w-full text-sm ">
              <thead className="bg-gray-50 text-gray-800">
                <tr>
                  <th className="p-3">
                    <Checkbox
                      checked={docs.length > 0 && selected.length === docs.length}
                      onCheckedChange={(checked) =>
                        setSelected(checked ? docs.map((item) => item.id) : [])
                      }
                    />
                  </th>
                  <th className="text-left p-3 font-medium!">Name</th>
                  <th className="text-left p-3 font-medium!">Type</th>
                  <th className="text-left p-3 font-medium!">Deleted Time</th>
                  <th className="text-left p-3 font-medium!">Expires</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((item) => (
                  <tr key={item.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">
                      <Checkbox
                        checked={selected.includes(item.id)}
                        onCheckedChange={() => toggle(item.id)}
                      />
                    </td>
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 capitalize">{item.type}</td>
                    <td className="p-3">
                      {item.deletedAt ? formatTime(String(item.deletedAt)) : "-"}
                    </td>
                    <td className="p-3">
                      {item.expiresAt ? formatTime(String(item.expiresAt)) : "-"}
                    </td>
                  </tr>
                ))}
                {!loading && !docs.length && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      Recycle Bin is empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recyclebin;
