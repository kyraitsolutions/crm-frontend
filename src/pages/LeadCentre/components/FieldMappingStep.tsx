import { useMemo, useState } from "react";
import { ChevronDown, Plus, HelpCircle } from "lucide-react";

const STANDARD_FIELDS = [
    "name",
    "email",
    "phone",
    "mobile",
    "message",
    "description",
    "company",
    "title",
    "website",
    "stage",
    "status",
    "source.name"
];

const DEFAULT_CUSTOM_FIELDS = [
    "city",
    "linkedin",
];

// Auto-mapping: csv header (lowercase) → crm field
const AUTO_MAP_RULES: Record<string, string> = {
    name: "name",
    Name: "name",
    "full name": "name",
    fullname: "name",
    email: "email",
    "email address": "email",
    phone: "phone",
    "phone number": "phone",
    mobile: "mobile",
    "mobile number": "mobile",
    message: "message",
    description: "description",
    company: "company",
    "company name": "company",
    title: "title",
    "job title": "title",
    website: "website",
    url: "website",
    stage: "stage",
    status: "status",
    city: "custom.city",
    linkedin: "custom.linkedin",
};

type FilterType = "all" | "mapped" | "unmapped";

type Props = {
    csvHeaders: string[];
    sampleRows: Record<string, any>[];
    onComplete?: (mapping: Record<string, string>, customFields: string[]) => void;
    onPrevious?: () => void;
};

const FieldMappingStep = ({ csvHeaders, sampleRows, onComplete,
    //  onPrevious 
}: Props) => {
    const [mapping, setMapping] = useState<Record<string, string>>({});
    const [customFields, setCustomFields] = useState<string[]>(DEFAULT_CUSTOM_FIELDS);
    const [filter, setFilter] = useState<FilterType>("all");
    const [newFieldName, setNewFieldName] = useState("");
    const [showNewFieldInput, setShowNewFieldInput] = useState(false);
    const [newFieldError, setNewFieldError] = useState("");

    // ── Counts ────────────────────────────────────────────────────────────────
    const mappedCount = useMemo(() =>
        csvHeaders.filter((h) => !!mapping[h]).length,
        [mapping, csvHeaders]
    );
    const unmappedCount = csvHeaders.length - mappedCount;

    // ── All CRM options (standard + custom) ───────────────────────────────────
    const allCrmOptions = useMemo(() => {
        const standard = STANDARD_FIELDS.map((f) => ({ label: f, value: f }));
        const custom = customFields.map((f) => ({ label: f, value: `custom.${f}` }));
        return { standard, custom };
    }, [customFields]);

    // Which CRM values are already claimed by another csv column
    const usedValues = useMemo(() =>
        new Set(Object.values(mapping).filter(Boolean)),
        [mapping]
    );

    // ── Filtered headers ──────────────────────────────────────────────────────
    const visibleHeaders = useMemo(() => {
        if (filter === "mapped") return csvHeaders.filter((h) => !!mapping[h]);
        if (filter === "unmapped") return csvHeaders.filter((h) => !mapping[h]);
        return csvHeaders;
    }, [filter, csvHeaders, mapping]);

    // ── Handlers ──────────────────────────────────────────────────────────────
    const handleMapping = (csvField: string, value: string) => {
        setMapping((prev) => ({ ...prev, [csvField]: value }));
    };

    const handleReset = () => setMapping({});

    const handleAutoMap = () => {
        const auto: Record<string, string> = {};
        csvHeaders.forEach((header) => {
            const key = header.toLowerCase().trim();
            if (AUTO_MAP_RULES[key]) {
                auto[header] = AUTO_MAP_RULES[key];
            }
        });
        setMapping(auto);
    };

    const handleCreateField = () => {
        const name = newFieldName.trim().toLowerCase().replace(/\s+/g, "_");
        if (!name) {
            setNewFieldError("Field name cannot be empty.");
            return;
        }
        if (customFields.includes(name)) {
            setNewFieldError("This custom field already exists.");
            return;
        }
        setCustomFields((prev) => [...prev, name]);
        setNewFieldName("");
        setNewFieldError("");
        setShowNewFieldInput(false);
    };

    const handleNext = () => {
        onComplete?.(mapping, customFields);
    };

    // ── Sample data ───────────────────────────────────────────────────────────
    const getSampleData = (field: string): string[] => {
        return (sampleRows ?? [])
            .slice(0, 2)
            .map((row) => row[field])
            .filter(Boolean);
    };

    // ── Option disabled logic: a value is disabled if it's used by another row ─
    const isDisabled = (value: string, currentCsvField: string) => {
        return usedValues.has(value) && mapping[currentCsvField] !== value;
    };

    return (
        <div className="flex flex-col h-full pb-12">
            {/* ── Filter bar ──────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
                <div className="flex items-center gap-2">
                    {/* All */}
                    <button
                        onClick={() => setFilter("all")}
                        className={`rounded-full border px-4 py-1 text-sm font-medium transition-colors ${filter === "all"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-300 text-gray-500 hover:border-gray-400"
                            }`}
                    >
                        All
                    </button>

                    {/* Mapped */}
                    <button
                        onClick={() => setFilter("mapped")}
                        className={`rounded-full border px-4 py-1 text-sm font-medium transition-colors ${filter === "mapped"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-300 text-gray-500 hover:border-gray-400"
                            }`}
                    >
                        Mapped ({mappedCount})
                    </button>

                    {/* Unmapped */}
                    <button
                        onClick={() => setFilter("unmapped")}
                        className={`rounded-full border px-4 py-1 text-sm font-medium transition-colors ${filter === "unmapped"
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-300 text-gray-500 hover:border-gray-400"
                            }`}
                    >
                        <span className="text-red-500">Unmapped ({unmappedCount})</span>
                    </button>
                </div>

                {/* Create New Field */}
                <div className="relative flex items-center gap-2">
                    {showNewFieldInput && (
                        <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                                <input
                                    autoFocus
                                    type="text"
                                    value={newFieldName}
                                    onChange={(e) => {
                                        setNewFieldName(e.target.value);
                                        setNewFieldError("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleCreateField();
                                        if (e.key === "Escape") {
                                            setShowNewFieldInput(false);
                                            setNewFieldName("");
                                            setNewFieldError("");
                                        }
                                    }}
                                    placeholder="e.g. linkedin"
                                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-primary w-44"
                                />
                                {newFieldError && (
                                    <span className="mt-0.5 text-xs text-red-500">{newFieldError}</span>
                                )}
                            </div>
                            <button
                                onClick={handleCreateField}
                                className="rounded-lg bg-primary px-3 py-1.5 text-sm text-white hover:opacity-90"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setShowNewFieldInput(false);
                                    setNewFieldName("");
                                    setNewFieldError("");
                                }}
                                className="text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    )}

                    {!showNewFieldInput && (
                        <button
                            onClick={() => setShowNewFieldInput(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <Plus size={15} />
                            Create New Fields
                        </button>
                    )}
                </div>
            </div>

            {/* ── Table ───────────────────────────────────────────────────── */}
            <div className="flex-1 overflow-auto">
                <div className="overflow-hidden rounded-none border-0 bg-white">
                    {/* Table Header */}
                    <div className="grid grid-cols-3 border-b bg-gray-50 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <p>Fields in file</p>
                        <div className="flex items-center gap-1">
                            <p>Fields in CRM</p>
                            <HelpCircle size={13} className="text-gray-400" />
                        </div>
                        <p>Sample data from file</p>
                    </div>

                    {/* Rows */}
                    {visibleHeaders.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-gray-400">
                            No {filter} fields found.
                        </div>
                    ) : (
                        visibleHeaders.map((field) => {
                            const samples = getSampleData(field);
                            const isMapped = !!mapping[field];

                            return (
                                <div
                                    key={field}
                                    className="grid grid-cols-3 items-center border-b px-6 py-3 hover:bg-gray-50"
                                >
                                    {/* CSV field name */}
                                    <p className="text-sm font-medium text-gray-700">{field}</p>

                                    {/* CRM field selector */}
                                    <div className="relative w-[280px]">
                                        <select
                                            value={mapping[field] || ""}
                                            onChange={(e) => handleMapping(field, e.target.value)}
                                            className={`w-full appearance-none rounded-lg border px-4 py-2 pr-10 text-sm outline-none transition-colors focus:border-primary ${isMapped
                                                ? "border-green-400 bg-green-50 text-gray-800"
                                                : "border-gray-300 text-gray-500"
                                                }`}
                                        >
                                            <option value="">Select field to import</option>

                                            <optgroup label="STANDARD FIELDS">
                                                {allCrmOptions.standard.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                        disabled={isDisabled(opt.value, field)}
                                                    >
                                                        {opt.label}
                                                        {isDisabled(opt.value, field) ? " (in use)" : ""}
                                                    </option>
                                                ))}
                                            </optgroup>

                                            <optgroup label="CUSTOM FIELDS">
                                                {allCrmOptions.custom.map((opt) => (
                                                    <option
                                                        key={opt.value}
                                                        value={opt.value}
                                                        disabled={isDisabled(opt.value, field)}
                                                    >
                                                        {opt.label}
                                                        {isDisabled(opt.value, field) ? " (in use)" : ""}
                                                    </option>
                                                ))}
                                            </optgroup>
                                        </select>

                                        <ChevronDown
                                            size={16}
                                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                                        />
                                    </div>

                                    {/* Sample data — two values side by side */}
                                    <div className="flex gap-4">
                                        {samples.map((s, i) => (
                                            <span
                                                key={i}
                                                title={s}
                                                className="max-w-[180px] truncate text-sm text-gray-500"
                                            >
                                                {s}
                                            </span>
                                        ))}
                                        {samples.length === 0 && (
                                            <span className="text-sm text-gray-300">—</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Footer ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3">
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleReset}
                        className="text-sm text-red-500 hover:underline"
                    >
                        Reset Field Mapping
                    </button>
                    <button
                        onClick={handleAutoMap}
                        className="text-sm text-primary hover:underline"
                    >
                        Apply Auto Mapping
                    </button>
                </div>

                {/* <div className="flex items-center gap-2">
                    <button
                        onClick={onPrevious}
                        className="rounded-lg border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="rounded-lg bg-primary px-4 py-1.5 text-sm text-white hover:opacity-90"
                    >
                        Next
                    </button>
                </div> */}
            </div>

            <button onClick={handleNext}>next </button>
        </div>
    );
};

export default FieldMappingStep;