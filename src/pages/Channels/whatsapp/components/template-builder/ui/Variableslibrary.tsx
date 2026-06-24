import React from "react";
import { SuggestedVariables } from "./SuggestedVariables";

// type VarTab = "Suggested" | "Custom";

interface VariablesLibraryProps {
  suggestedVariables: string[];
  onInsert: (varName: string) => void;
}

export const VariablesLibrary: React.FC<VariablesLibraryProps> = ({
  suggestedVariables,
  onInsert,
}) => {
  // const [activeTab, setActiveTab] = useState<VarTab>("Suggested");

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-800 mb-0.5">
        Variables Library
      </h3>
      <p className="text-xs text-gray-500 mb-2">
        Use variables to personalize your message.
      </p>

      {/* Tab bar */}
      {/* <div className="flex border-b border-gray-200 mb-3">
        {(["Suggested", "Custom"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "border-b-2 border-green-600 text-green-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div> */}

      {/* Tab content */}

      <SuggestedVariables variables={suggestedVariables} onInsert={onInsert} />
    </div>
  );
};
