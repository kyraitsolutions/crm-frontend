// LeadStatusModal.tsx

import { useEffect, useMemo, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

interface LeadStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  initialData?: any;
}

const presetColors = [
  "#22C55E",
  "#F59E0B",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F97316",
];

const generateKey = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "_");
};

const LeadStatusModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: LeadStatusModalProps) => {
  const [form, setForm] = useState({
    label: "",
    color: "#22C55E",
    default: false,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        label: initialData.label,
        color: initialData.color,
        default: initialData.default,
      });
    } else {
      setForm({
        label: "",
        color: "#22C55E",
        default: false,
      });
    }
  }, [initialData]);

  const generatedKey = useMemo(() => {
    return generateKey(form.label);
  }, [form.label]);

  const handleSubmit = () => {
    onSubmit({
      ...form,
      key: generatedKey,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/10 backdrop-blur-[2px]" />
      <DialogContent className="max-w-xl! w-full rounded-3xl border-0 p-4">
        {/* HEADER */}
        <DialogHeader className="border-b">
          <DialogTitle className="text-xl font-semibold text-[#111827]">
            {initialData ? "Edit Status" : "Create Status"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-2">
            {/* STATUS NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Status Name
              </label>

              <input
                value={form.label}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    label: e.target.value,
                  }))
                }
                placeholder="Interested"
                className="
                h-11
                w-full
                rounded-xl
                border
                border-[#E5E7EB]
                px-4
                text-sm
                outline-none
                transition-all
                focus:border-[#16A34A]
                focus:ring-4
                focus:ring-green-100
              "
              />
            </div>

            {/* AUTO GENERATED KEY */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#111827]">
                Generated Key
              </label>

              <div
                className="
                flex
                h-11
                items-center
                rounded-xl
                border
                border-[#E5E7EB]
                bg-[#F8FAFC]
                px-4
                text-sm
                text-[#64748B]
              "
              >
                {generatedKey || "status_key"}
              </div>

              <p className="mt-2 text-xs text-[#94A3B8]">
                Auto generated from status name
              </p>
            </div>
          </div>

          {/* PRESET COLORS */}
          <div>
            <label className="mb-3 block text-sm font-medium text-[#111827]">
              Select Color
            </label>

            <div className="flex flex-wrap items-center gap-3">
              {presetColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      color,
                    }))
                  }
                  className={`
                    relative
                    size-9
                    rounded-full
                    transition-all
                    ${
                      form.color === color
                        ? "scale-110 ring-4 ring-offset-2 ring-[#D1FAE5]"
                        : ""
                    }
                  `}
                  style={{
                    backgroundColor: color,
                  }}
                >
                  {form.color === color && (
                    <div className="absolute inset-0 rounded-full border-2 border-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* CUSTOM COLOR PICKER */}
          <div>
            <label className="mb-3 block text-sm font-medium text-[#111827]">
              Custom Color
            </label>

            <div className="flex items-center gap-4">
              <input
                type="color"
                value={form.color}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    color: e.target.value,
                  }))
                }
                className="
                  h-12
                  w-16
                  cursor-pointer
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-transparent
                  p-1
                "
              />

              <div
                className="
                  flex
                  h-11
                  flex-1
                  items-center
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-[#F8FAFC]
                  px-4
                  text-sm
                  text-[#64748B]
                "
              >
                {form.color}
              </div>
            </div>
          </div>

          {/* LIVE PREVIEW */}
          <div>
            <label className="mb-3 block text-sm font-medium text-[#111827]">
              Preview
            </label>

            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
              <div className="flex items-center gap-3">
                <div
                  className="size-3 rounded-full"
                  style={{
                    backgroundColor: form.color,
                  }}
                />

                <span className="text-sm font-medium text-[#111827]">
                  {form.label || "Status Preview"}
                </span>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="
                rounded-xl
                border
                border-[#E5E7EB]
                bg-white
                px-5
                text-[#475569]
                hover:bg-[#F8FAFC]
              "
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!form.label.trim()}
              className="
                rounded-xl
                bg-[#16A34A]
                px-5
                hover:bg-[#15803D]
              "
            >
              {initialData ? "Save Changes" : "Create Status"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeadStatusModal;

// // LeadStatusModal.tsx

// import { useEffect, useState } from "react";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import { Button } from "@/components/ui/button";

// interface LeadStatusModalProps {
//   open: boolean;
//   onClose: () => void;
//   onSubmit: (values: any) => void;
//   initialData?: any;
// }

// const colors = [
//   "#22C55E",
//   "#F59E0B",
//   "#3B82F6",
//   "#8B5CF6",
//   "#EC4899",
//   "#F97316",
// ];

// const LeadStatusModal = ({
//   open,
//   onClose,
//   onSubmit,
//   initialData,
// }: LeadStatusModalProps) => {
//   const [form, setForm] = useState({
//     label: "",
//     key: "",
//     color: "#22C55E",
//     default: false,
//   });

//   useEffect(() => {
//     if (initialData) {
//       setForm({
//         label: initialData.label,
//         key: initialData.key,
//         color: initialData.color,
//         default: initialData.default,
//       });
//     } else {
//       setForm({
//         label: "",
//         key: "",
//         color: "#22C55E",
//         default: false,
//       });
//     }
//   }, [initialData]);

//   const handleSubmit = () => {
//     onSubmit(form);
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-lg rounded-3xl border-0 p-0">
//         <DialogHeader className="border-b border-[#E5E7EB] px-6 py-5">
//           <DialogTitle className="text-xl font-semibold text-[#111827]">
//             {initialData ? "Edit Status" : "Create Status"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-5 p-6">
//           {/* LABEL */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-[#111827]">
//               Status Name
//             </label>

//             <input
//               value={form.label}
//               onChange={(e) =>
//                 setForm((prev) => ({
//                   ...prev,
//                   label: e.target.value,
//                 }))
//               }
//               placeholder="Interested"
//               className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 outline-none"
//             />
//           </div>

//           {/* KEY */}
//           <div>
//             <label className="mb-2 block text-sm font-medium text-[#111827]">
//               Key
//             </label>

//             <input
//               value={form.key}
//               onChange={(e) =>
//                 setForm((prev) => ({
//                   ...prev,
//                   key: e.target.value,
//                 }))
//               }
//               placeholder="interested"
//               className="h-11 w-full rounded-xl border border-[#E5E7EB] px-4 outline-none"
//             />
//           </div>

//           {/* COLORS */}
//           <div>
//             <label className="mb-3 block text-sm font-medium text-[#111827]">
//               Select Color
//             </label>

//             <div className="flex items-center gap-3">
//               {colors.map((color) => (
//                 <button
//                   key={color}
//                   onClick={() =>
//                     setForm((prev) => ({
//                       ...prev,
//                       color,
//                     }))
//                   }
//                   className={`size-8 rounded-full border-4 ${
//                     form.color === color ? "border-black" : "border-transparent"
//                   }`}
//                   style={{
//                     backgroundColor: color,
//                   }}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* DEFAULT */}
//           {/* <div className="flex items-center gap-3">
//             <input
//               type="checkbox"
//               checked={form.default}
//               onChange={(e) =>
//                 setForm((prev) => ({
//                   ...prev,
//                   default: e.target.checked,
//                 }))
//               }
//             />

//             <span className="text-sm text-[#475569]">
//               Set as default status
//             </span>
//           </div> */}

//           {/* ACTIONS */}
//           <div className="flex justify-end gap-3 pt-3">
//             <Button
//               onClick={onClose}
//               className="bg-transparent border hover:bg-red-500 hover:text-white text-gray-600 rounded-lg duration-500 transition-all"
//             >
//               Cancel
//             </Button>

//             <Button onClick={handleSubmit} className="rounded-lg">
//               {initialData ? "Save Changes" : "Create Status"}
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default LeadStatusModal;
