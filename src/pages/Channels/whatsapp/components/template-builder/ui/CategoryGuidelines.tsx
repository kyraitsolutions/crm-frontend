import React from "react";
import { Info } from "lucide-react";

const GUIDELINES: Record<string, string> = {
  Utility:
    "Utility templates are for order updates, account alerts, transactions and more.",
  Marketing:
    "Marketing templates include promotions, offers, and other marketing messages.",
  Authentication:
    "Authentication templates are used for OTPs and account verification.",
};

interface CategoryGuidelinesProps {
  category: string;
}

export const CategoryGuidelines: React.FC<CategoryGuidelinesProps> = ({
  category,
}) => {
  const text = GUIDELINES[category] ?? GUIDELINES["Utility"];

  return (
    <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
      <div className="flex items-center gap-2 mb-1">
        <Info size={14} className="text-blue-500 shrink-0" />
        <span className="text-sm font-medium text-blue-700">
          Category Guidelines
        </span>
      </div>
      <p className="text-xs text-blue-600 mb-1">{text}</p>
      {/* <button className="text-xs text-blue-600 underline font-medium">
        View Details ↗
      </button> */}
    </div>
  );
};
