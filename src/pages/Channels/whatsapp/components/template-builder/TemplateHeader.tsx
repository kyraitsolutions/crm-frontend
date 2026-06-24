import { FileText, Info, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TemplateHeader = () => {
  return (
    <div className="flex items-center justify-between  bg-white">
      {/* Left — title + description */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="text-lg font-semibold text-gray-900">
            Create WhatsApp Template
          </h1>
          <button className="flex items-center gap-1 rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 transition-colors">
            <Info size={11} />
            Learn about templates
          </button>
        </div>
        <p className="text-xs text-gray-500">
          Design your template using approved components. Follow guidelines to
          increase approval chances.
        </p>
      </div>

      {/* Right — action buttons */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-6">
        <Button
          variant="outline"
          className="flex items-center gap-1.5 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <FileText size={14} />
          Save as Draft
        </Button>

        <Button className="flex items-center gap-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white">
          <RotateCcw size={14} />
          Submit for Review
        </Button>
      </div>
    </div>
  );
};
