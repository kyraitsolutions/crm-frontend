// import { Phone } from "lucide-react";

// export const FieldRow = ({
//     label,
//     value,
//     isPhone,
// }: {
//     label: string;
//     value: string;
//     isPhone?: boolean;
// }) => {
//     return (
//         <div className="grid grid-cols-[160px_1fr] items-center py-3">
//             <span className="text-[#5b6b82] text-sm">{label}</span>

//             <div className="flex items-center gap-2 text-sm text-[#1f2937]">
//                 <span>{value}</span>

//                 {isPhone && (
//                     <button className="bg-[#dcfce7] p-1.5 rounded-md hover:bg-[#bbf7d0] transition">
//                         <Phone size={14} className="text-green-600" />
//                     </button>
//                 )}
//             </div>
//         </div>
//     );
// };


import { useEffect, useState } from "react";
import { Check, Pencil, Phone, X } from "lucide-react";
import { useLeadsStore } from "../store/lead.store";
import { useAuthStore } from "@/stores";

interface FieldRowProps {
    label: string;
    value: string;
    fieldKey: string;
    leadId?: string;
    isPhone?: boolean;
}

export const FieldRow = ({
    label,
    value,
    fieldKey,
    leadId,
    isPhone,
}: FieldRowProps) => {

    const { accountId } = useAuthStore((state) => state)
    const { editingField, setEditingField, updateLeadField, updatingLead } = useLeadsStore((state) => state);
    const [isHovered, setIsHovered] = useState(false);
    const [tempValue, setTempValue] = useState(value);
    const [loading, setLoading] = useState(false);


    const isEditing = editingField === fieldKey;
    const isAssignedField = fieldKey === "assignedTo";


    useEffect(() => {
        setTempValue(value);
        setEditingField(null);
    }, [value]);

    const handleSave = async () => {
        if (tempValue === value) {
            setEditingField(null);
            return;
        }
        await updateLeadField(String(accountId), String(leadId), fieldKey as any, tempValue);
    };


    const handleCancel = () => {
        setTempValue(value);
        setEditingField(null);
    };


    console.log("Rendering FieldRow")
    return (
        <div className="grid grid-cols-[160px_1fr] items-center">
            <span className="text-[#5b6b82] text-sm">
                {label}
            </span>

            <div className="group flex items-center gap-2 max-w-[420px] w-full">
                <div
                    className={`
                        flex items-center gap-2 rounded-md border transition w-full
                        ${isEditing
                            ? "border-second shadow-md rounded-xl"
                            : "border-transparent hover:border-gray-300"
                        }
                    `}
                >
                    {/* Assigned To Dropdown */}
                    {/* {isAssignedField && isEditing ? (
                        <select
                            value={tempValue}
                            onChange={(e) =>
                                setTempValue(e.target.value)
                            }
                            className="w-full px-2 py-2 bg-transparent outline-none text-sm"
                        >
                            <option value="">
                                Select team member
                            </option>

                            {teams?.map((member) => (
                                <option
                                    key={member.id}
                                    value={member.id}
                                    className="flex flex-col!"
                                >
                                    <p>{member.userProfile.firstName + " " + member.userProfile.lastName}</p>
                                    <p>{member.role.name}</p>
                                </option>
                            ))}
                        </select>
                    ) : ( */}
                    <input
                        type="text"
                        value={tempValue}
                        readOnly={!isEditing}
                        onChange={(e) =>
                            setTempValue(e.target.value)
                        }
                        className="w-full px-2 py-2 bg-transparent outline-none text-sm"
                    />
                    {/*  )} */}
                    {/* <input
                        type="text"
                        value={tempValue}
                        readOnly={!isEditing}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="w-full px-2 py-2 bg-transparent outline-none text-sm"
                    /> */}

                    {isPhone &&
                        !isEditing && (
                            <button className="bg-primary/10 p-1.5 rounded-md mr-2">
                                <Phone className="text-primary" size={14} />
                            </button>
                        )}
                </div>

                {!isEditing && (
                    <button
                        onClick={() => setEditingField(fieldKey)}
                        className="opacity-0 group-hover:opacity-100 transition"
                    >
                        <Pencil size={16} />
                    </button>
                )}

                {isEditing && (
                    <div className="flex items-center gap-2">
                        <button disabled={updatingLead}
                            onClick={handleSave}
                            className="text-blue-500"
                        >
                            <Check size={18} />
                        </button>

                        <button onClick={handleCancel}>
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};