// import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import useOutsideClick from "@/hooks/useOutsideClick";
import GlobalTemplatePreview from "@/pages/Channels/whatsapp/components/GlobalTemplatePreview";
import { useTemplateListStore } from "@/pages/Channels/whatsapp/store/template-list.store";
import type { TTemplate } from "@/pages/Channels/whatsapp/types/templates";
import { getComponentText } from "@/pages/Channels/whatsapp/utils/template/template.utils";
import { useAuthStore } from "@/stores";
import { useEffect, useMemo, useRef, useState } from "react";
import { MdClose, MdOutlineRemoveRedEye, MdSearch } from "react-icons/md";

interface TemplatePopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: TTemplate) => void;
}

const STATUS_STYLES: Record<string, string> = {
  APPROVED: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200",
  PENDING: "bg-amber-50 text-amber-600 ring-1 ring-amber-200",
  REJECTED: "bg-red-50 text-red-600 ring-1 ring-red-200",
};

const CATEGORY_STYLES: Record<string, string> = {
  UTILITY: "bg-blue-50 text-blue-600 ring-1 ring-blue-200",
  MARKETING: "bg-pink-50 text-pink-600 ring-1 ring-pink-200",
  AUTHENTICATION: "bg-violet-50 text-violet-600 ring-1 ring-violet-200",
};

const TemplatePopup = ({ open, onClose, onSelect }: TemplatePopupProps) => {
  const { fetchTemplates, loading, templates, resetFilters } =
    useTemplateListStore((state) => state);
  const [previewTemplate, setPreviewTemplate] = useState<TTemplate | null>(
    null,
  );
  const popupRef = useRef<HTMLDivElement>(null);
  const accountId = useAuthStore((state) => state.accountId);
  const [search, setSearch] = useState("");

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, templates]);

  useOutsideClick(popupRef, onClose, open);

  useEffect(() => {
    if (!accountId) return;

    resetFilters();
    fetchTemplates(String(accountId));
  }, [accountId]);

  if (!open) return null;

  return (
    <div
      ref={popupRef}
      className="absolute bottom-24 left-14 z-50 flex w-100 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            Message Templates
          </h2>
          <p className="text-xs text-gray-400">
            {templates.length} template{templates.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <MdClose size={18} />
        </button>
      </div>

      {/* Search */}
      <div className="border-b border-gray-100 p-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition focus-within:border-pink-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-100">
          <MdSearch className="shrink-0 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-80 divide-y divide-gray-100 overflow-y-auto">
        {loading ? (
          <div className="space-y-3 p-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-3.5 w-1/3 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-2/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
            {/* <HiOutlineDocumentText className="text-gray-300" size={32} /> */}
            <p className="text-sm font-medium text-gray-500">
              No templates found
            </p>
            <p className="text-xs text-gray-400">Try a different search term</p>
          </div>
        ) : (
          filteredTemplates.map((template) => {
            const bodyText = getComponentText(template.components, "BODY");
            const footerText = getComponentText(template.components, "FOOTER");

            return (
              <div
                key={template.id}
                onClick={() => {
                  onSelect(template);
                  onClose();
                }}
                className="group relative cursor-pointer p-4 transition hover:bg-gray-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-gray-900">
                    {template.name}
                  </h3>

                  <div className="flex shrink-0 items-center gap-1.5">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewTemplate(template);
                        // onPreview?.(template);
                      }}
                      className="actions-btn"
                      title="Preview template"
                    >
                      <MdOutlineRemoveRedEye size={16} />
                    </Button>
                  </div>
                </div>

                <p className="mt-1.5 line-clamp-2 text-sm text-gray-500">
                  {bodyText || "No preview available"}
                </p>

                {footerText && (
                  <p className="mt-1 truncate text-xs text-gray-400">
                    {footerText}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      CATEGORY_STYLES[template.category] ??
                      "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                    }`}
                  >
                    {template.category}
                  </span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      STATUS_STYLES[template.status] ??
                      "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                    }`}
                  >
                    {template.status}
                  </span>

                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium uppercase text-gray-500">
                    {template.language}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <GlobalTemplatePreview
        open={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
      />
    </div>
  );
};

export default TemplatePopup;

// const TemplatePopup = ({ open, onClose, onSelect }: TemplatePopupProps) => {
//   const { fetchTemplates, loading, templates } = useTemplateListStore(
//     (state) => state,
//   );

//   const popupRef = useRef<HTMLDivElement>(null);

//   const accountId = useAuthStore((state) => state.accountId);

//   const [search, setSearch] = useState("");

//   const filteredTemplates = useMemo(() => {
//     return templates.filter((t) =>
//       t.name.toLowerCase().includes(search.toLowerCase()),
//     );
//   }, [search, templates]);

//   useOutsideClick(popupRef, onClose, open);

//   useEffect(() => {
//     if (!accountId) return;
//     fetchTemplates(String(accountId));
//   }, []);

//   console.log("Templates", filteredTemplates);

//   if (!open) return null;

//   return (
//     <div
//       ref={popupRef}
//       className="absolute bottom-24 left-14 z-50 w-96 rounded-xl border bg-white shadow-2xl"
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between border-b px-4 py-3">
//         <h2 className="font-semibold">Templates</h2>

//         <button onClick={onClose}>
//           <MdClose size={20} />
//         </button>
//       </div>

//       {/* Search */}
//       <div className="border-b p-3">
//         <div className="flex items-center rounded-lg border px-3">
//           <MdSearch className="text-gray-500" />

//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search template..."
//             className="flex-1 px-2 py-2 outline-none"
//           />
//         </div>
//       </div>

//       {/* List */}
//       <div className="max-h-96 overflow-y-auto">
//         {filteredTemplates.map((template) => (
//           <button
//             key={template.id}
//             onClick={() => {
//               onSelect(template);
//               onClose();
//             }}
//             className="w-full border-b p-4 text-left transition hover:bg-gray-50"
//           >
//             <div className="flex items-center justify-between">
//               <h3 className="font-medium">{template.name}</h3>

//               <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-600">
//                 {template.category}
//               </span>
//             </div>

//             <p className="mt-2 line-clamp-2 text-sm text-gray-500">
//               {template.body}
//             </p>

//             <p className="mt-2 text-xs text-gray-400">{template.language}</p>
//           </button>
//         ))}

//         {loading ? (
//           <>
//             <Loader />
//           </>
//         ) : (
//           filteredTemplates.length === 0 && (
//             <div className="py-10 text-center text-gray-500">
//               No templates found
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default TemplatePopup;
