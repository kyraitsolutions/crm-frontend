import { useMemo, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";

export interface WhatsAppTemplate {
  id: string;
  name: string;
  category: "MARKETING" | "UTILITY" | "AUTHENTICATION";
  language: string;
  body: string;
}

interface TemplatePopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (template: WhatsAppTemplate) => void;
}

const templates: WhatsAppTemplate[] = [
  {
    id: "1",
    name: "Welcome Message",
    category: "UTILITY",
    language: "English",
    body: "Hi {{1}}, welcome to Kyra CRM! We're happy to have you.",
  },
  {
    id: "2",
    name: "Order Confirmation",
    category: "UTILITY",
    language: "English",
    body: "Hello {{1}}, your order {{2}} has been confirmed.",
  },
  {
    id: "3",
    name: "Appointment Reminder",
    category: "UTILITY",
    language: "English",
    body: "Hi {{1}}, this is a reminder for your appointment tomorrow.",
  },
  {
    id: "4",
    name: "Festival Offer",
    category: "MARKETING",
    language: "English",
    body: "🎉 Hi {{1}}, enjoy our special festive discount!",
  },
  {
    id: "5",
    name: "OTP Verification",
    category: "AUTHENTICATION",
    language: "English",
    body: "Your OTP is {{1}}. Valid for 5 minutes.",
  },
];

const TemplatePopup = ({ open, onClose, onSelect }: TemplatePopupProps) => {
  const [search, setSearch] = useState("");

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  if (!open) return null;

  return (
    <div className="absolute bottom-24 left-14 z-50 w-96 rounded-xl border bg-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="font-semibold">Templates</h2>

        <button onClick={onClose}>
          <MdClose size={20} />
        </button>
      </div>

      {/* Search */}
      <div className="border-b p-3">
        <div className="flex items-center rounded-lg border px-3">
          <MdSearch className="text-gray-500" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search template..."
            className="flex-1 px-2 py-2 outline-none"
          />
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              onSelect(template);
              onClose();
            }}
            className="w-full border-b p-4 text-left transition hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{template.name}</h3>

              <span className="rounded-full bg-pink-100 px-2 py-1 text-xs text-pink-600">
                {template.category}
              </span>
            </div>

            <p className="mt-2 line-clamp-2 text-sm text-gray-500">
              {template.body}
            </p>

            <p className="mt-2 text-xs text-gray-400">{template.language}</p>
          </button>
        ))}

        {filteredTemplates.length === 0 && (
          <div className="py-10 text-center text-gray-500">
            No templates found
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatePopup;
