import { useEffect, useState } from "react";
import UploadStep from "./UploadStep";
import UniquekeyStep from "./UniquekeyStep";
import FieldMappingStep from "./FieldMappingStep";

import Papa from "papaparse";
import { leadService } from "../../services/lead.service";
import { useAuthStore } from "@/stores";

const MAX_STEP = 4;
const ImportLeadStep = () => {
  const { accountId } = useAuthStore((state) => state);
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<Record<string, any>[]>([]);

  const handleStep = (opt: string) => {
    if (opt === "add") {
      if (step + 1 <= MAX_STEP) {
        setStep((prev) => prev + 1);
      }
    } else {
      if (step - 1 >= 0) {
        setStep((prev) => prev - 1);
      }
    }
  };

  useEffect(() => {
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,

      complete: (result) => {
        console.log("CSV Result", result);

        // CSV Headers
        const headers = result.meta.fields || [];

        setCsvHeaders(headers);

        // Sample Rows (first 5 rows)
        const rows = result.data as Record<string, any>[];

        setSampleRows(rows.slice(0, 5));
      },

      error: (error) => {
        console.error("CSV Parse Error:", error);
      },
    });
  }, [selectedFile]);

  console.log({
    selectedFile,
    csvHeaders,
    sampleRows,
  });

  console.log(step);

  async function handleMappingComplete(mapping: Record<string, string>) {
    console.log("jhgfdxc", sampleRows, mapping);
    // allRows = full parsed CSV (e.g. from papaparse)
    // const allRows: Record<string, any>[] = []; // ← replace with your actual state

    const payloads = await leadService.buildAllLeadPayloads(
      String(accountId),
      sampleRows,
      mapping,
    );

    console.log("Payloads to send:", payloads);

    // ── Call your API here when ready ──────────────────────────────────────
    // Option A: one by one
    // for (const payload of payloads) {
    //     await fetch("/api/leads", { method: "POST", body: JSON.stringify(payload) });
    // }

    // Option B: bulk endpoint
    // await fetch("/api/leads/bulk", { method: "POST", body: JSON.stringify({ leads: payloads }) });
  }

  return (
    <div className="pb-10">
      <div className="min-h-[70vh] h-full">
        {step === 0 && (
          <div>
            <UploadStep
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
          </div>
        )}
        {step === 1 && (
          <div>
            <UniquekeyStep />
          </div>
        )}
        {step === 2 && (
          <div>
            <FieldMappingStep
              csvHeaders={csvHeaders}
              sampleRows={sampleRows}
              onComplete={handleMappingComplete}
            />
          </div>
        )}
        {step === 3 && <div></div>}
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end items-center gap-3 px-20">
        <button
          onClick={() => handleStep("sub")}
          className="rounded-xl border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>

        <button
          onClick={() => handleStep("add")}
          className="rounded-xl bg-primary px-6 py-2 font-medium text-white"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ImportLeadStep;
