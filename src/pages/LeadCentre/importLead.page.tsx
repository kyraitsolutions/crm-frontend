import { HelpCircle } from "lucide-react";
import ImportLeadStep from "./components/ImportLeadStep";

const ImportLead = () => {

    return (
        <div className="h-[93vh] bg-gray-50 ">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
                <h1 className="text-lg font-medium!">
                    Import Leads
                </h1>

                <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800">
                    <HelpCircle size={18} />
                    Help
                </button>
            </div>

            <ImportLeadStep />
        </div>
    );
}

export default ImportLead 