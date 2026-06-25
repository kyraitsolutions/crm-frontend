import React from "react";
import { TemplateDetailsPanel } from "./TemplateDetailsPanel";
import { TemplateComposerPanel } from "./TemplateComposerPanel";
import { TemplatePreviewPanel } from "./TemplatePreviewPanel";
import { TemplateHeader } from "./TemplateHeader";

export const TemplateBuilder: React.FC = () => {
  return (
    <section>
      <TemplateHeader />

      <div className="grid xl:grid-cols-[320px_1fr_280px] gap-2 h-full mt-6">
        {/* Step 1: Template Details */}
        <div className="flex flex-col overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              <h2 className="text-sm font-semibold text-gray-800">
                Template Details
              </h2>
            </div>
            <p className="text-xs text-gray-500 ml-7">
              Provide basic information about your template.
            </p>
          </div>
          <TemplateDetailsPanel />
        </div>

        {/* Divider */}
        <div className="flex flex-col overflow-y-auto border-gray-200">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="text-sm font-semibold text-gray-800">
                Compose Template
              </h2>
            </div>
          </div>
          <TemplateComposerPanel />
        </div>

        {/* Step 3: Preview */}
        <div className="flex flex-col overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <h2 className="text-sm font-semibold text-gray-800">Preview</h2>
            </div>
          </div>
          <TemplatePreviewPanel />
        </div>
      </div>
    </section>
  );
};

// import { TemplateComposerPanel } from "./TemplateComposerPanel";
// import { TemplateDetailsPanel } from "./TemplateDetailsPanel";
// import { TemplatePreviewPanel } from "./TemplatePreviewPanel";

// export const TemplateBuilder = () => {
//   return (
//     <div className="grid grid-cols-[320px_1fr_360px] gap-4">
//       <TemplateDetailsPanel />
//       <TemplateComposerPanel />
//       <TemplatePreviewPanel />
//     </div>
//   );
// };
