import { Copy, Star, Trash2 } from "lucide-react";
import { useTemplateListStore } from "../../store/template-list.store";

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
  const templates = useTemplateListStore((state) => state.templates);

  console.log("templates", templates);

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
              <th className="rounded-r-xl px-6 py-4 font-medium text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className=" space-y-1 ">
            {templates?.length > 0 ? (
              templates.map((item) => {
                if (type !== "all" && type !== item.status.toLowerCase()) {
                  return null;
                }
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 mt-1 rounded-2xl text-sm bg-white"
                  >
                    <td className="max-w-[220px] rounded-l-xl truncate px-6 py-5">
                      {item.name}
                    </td>

                    <td className="px-6 py-5">{item.category}</td>

                    <td
                      className={`px-6 py-5 text-sm font-medium ${getStatusColor(
                        item.status,
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
                );
              })
            ) : (
              <tr className="mt-1 rounded-2xl text-sm bg-white">
                <td className="rounded-l-xl truncate px-6 py-5 text-black">
                  No templates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TemplateTable;
