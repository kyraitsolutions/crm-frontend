import { useEffect, useState } from "react";
import UploadStep from "./UploadStep";
import UniquekeyStep from "./UniquekeyStep";
import FieldMappingStep from "./FieldMappingStep";

import Papa from "papaparse";
import { leadService } from "../../services/lead.service";
import { useAuthStore } from "@/stores";
import Uploading from "./Uploading";
import { useNavigate } from "react-router-dom";
import { ACCOUNT_PATHS } from "@/constants";

const MAX_STEP = 4;
const CHUNK_SIZE = 1000; // matches backend BATCH_SIZE, one bulk request per chunk
const CONCURRENT_CHUNKS = 3; // small concurrency, not full fan-out

const ImportLeadStep = () => {
  const navigate = useNavigate();
  const { accountId } = useAuthStore((state) => state);
  const [step, setStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [sampleRows, setSampleRows] = useState<Record<string, any>[]>([]);
  const [allRows, setAllRows] = useState<Record<string, any>[]>([]);
  const [progress, setProgress] = useState(0);

  // captured from UniquekeyStep — was never being stored before
  const [uniqueKey, setUniqueKey] = useState<string>("");
  const [mode, setMode] = useState<"upsert" | "insert" | "skip">("skip");

  const [uploadStats, setUploadStats] = useState({
    total: 0,
    uploaded: 0,
    failed: 0,
    duplicates: 0,
    currentChunk: 0,
    totalChunks: 0,
    status: "Preparing...",
    errors: [] as { index: number; message: string }[],
  });

  const handleStep = (opt: string) => {
    if (opt === "add") {
      if (step + 1 <= MAX_STEP) setStep((prev) => prev + 1);
    } else {
      if (step - 1 >= 0) setStep((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!selectedFile) return;

    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      worker: true, // offload parsing off main thread, prevents UI freeze on big files

      complete: (result) => {
        const headers = result.meta.fields || [];
        setCsvHeaders(headers);

        const rows = result.data as Record<string, any>[];
        setAllRows(rows); // full dataset, used for actual upload
        setSampleRows(rows.slice(0, 5)); // preview only, used for field mapping UI
      },

      error: (error) => {
        console.error("CSV Parse Error:", error);
      },
    });
  }, [selectedFile]);

  function chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // runs a limited number of chunk uploads concurrently instead of
  // either fully sequential (slow) or full Promise.all fan-out (crashes)
  async function runWithConcurrency<T>(
    items: T[],
    limit: number,
    worker: (item: T, index: number) => Promise<void>,
  ) {
    let cursor = 0;

    async function next(): Promise<void> {
      const index = cursor++;
      if (index >= items.length) return;
      await worker(items[index], index);
      return next();
    }

    await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
  }

  async function handleMappingComplete(mapping: Record<string, string>) {
    // setStep(3);

    const payloads = await leadService.buildAllLeadPayloads(
      String(accountId),
      allRows,
      mapping,
    );

    const chunks = chunkArray(payloads, CHUNK_SIZE);

    let uploaded = 0;
    let failed = 0;
    let duplicates = 0;
    let processedChunks = 0;
    const allErrors: { index: number; message: string }[] = [];

    setUploadStats({
      total: payloads.length,
      uploaded: 0,
      failed: 0,
      duplicates: 0,
      currentChunk: 0,
      totalChunks: chunks.length,
      status: "Starting...",
      errors: [],
    });

    await runWithConcurrency(chunks, CONCURRENT_CHUNKS, async (chunk, chunkIndex) => {
      try {
        const res = await leadService.createBulkLead(String(accountId), {
          leads: chunk,
          uniqueKey,
          mode,
        } as any);

        const data = (res as any)?.data ?? {};
        uploaded += data.inserted || 0;
        duplicates += data.duplicates?.length || 0;
        failed += data.failed || 0;

        if (data.errors?.length) {
          allErrors.push(
            ...data.errors.map((e: any) => ({
              index: chunkIndex * CHUNK_SIZE + e.index,
              message: e.message,
            })),
          );
        }
      } catch (err) {
        // whole chunk failed (network error, server 500, etc)
        failed += chunk.length;
      }

      processedChunks++;
      setProgress((processedChunks / chunks.length) * 100);
      setUploadStats((prev) => ({
        ...prev,
        uploaded,
        failed,
        duplicates,
        currentChunk: processedChunks,
        status: `Uploaded ${processedChunks}/${chunks.length} chunks`,
        errors: allErrors,
      }));
    });

    setUploadStats((prev) => ({ ...prev, status: "Completed" }));
    // setTimeout(() => {
    //   navigate(`${ACCOUNT_PATHS.byId(String(accountId))}/leads`);
    // }, 3000);
  }

  return (
    <div className="pb-10">
      <div className="min-h-[70vh] h-full">
        {step === 0 && (
          <div>
            <UploadStep
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              step={step}
              setStep={setStep}
              handleStep={handleStep}
              isSelected={selectedFile}
            />
          </div>
        )}
        {step === 1 && (
          <div>
            <UniquekeyStep
              step={step}
              setStep={setStep}
              handleStep={handleStep}
            // csvHeaders={csvHeaders}
            // uniqueKey={uniqueKey}
            // setUniqueKey={setUniqueKey}
            // mode={mode}
            // setMode={setMode}
            />
          </div>
        )}
        {step === 2 && (
          <div>
            <FieldMappingStep
              csvHeaders={csvHeaders}
              sampleRows={sampleRows}
              onComplete={handleMappingComplete}
              step={step}
              handleStep={handleStep}
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <Uploading progress={progress} uploadStats={uploadStats} step={step} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportLeadStep;