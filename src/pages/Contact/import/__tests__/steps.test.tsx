import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { MappingStep } from "../components/MappingStep";
import { ProgressStep } from "../components/ProgressStep";
import { UploadStep } from "../components/UploadStep";
import { mappingFromPreview } from "../utils/mapping";
import { dryRunFixture, importConfigFixture, jobFixture, previewFixture } from "./fixtures";

describe("import steps", () => {
  it("disables continue when country is missing", () => {
    render(
      <MappingStep
        config={importConfigFixture}
        preview={previewFixture}
        mapping={mappingFromPreview(previewFixture, importConfigFixture)}
        policy="update"
        defaultCountry=""
        dryRun={dryRunFixture}
        dryRunLoading={false}
        onTarget={vi.fn()}
        onTransform={vi.fn()}
        onPolicy={vi.fn()}
        onCountry={vi.fn()}
        onContinue={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /continue to review/i })).toBeDisabled();
    expect(screen.getByText(/choose a default country/i)).toBeInTheDocument();
  });

  it("shows sample invalid reasons without raw codes alone", () => {
    render(
      <MappingStep
        config={importConfigFixture}
        preview={previewFixture}
        mapping={mappingFromPreview(previewFixture, importConfigFixture)}
        policy="update"
        defaultCountry="IN"
        dryRun={dryRunFixture}
        dryRunLoading={false}
        onTarget={vi.fn()}
        onTransform={vi.fn()}
        onPolicy={vi.fn()}
        onCountry={vi.fn()}
        onContinue={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /continue to review/i })).toBeEnabled();
    expect(screen.getAllByText(/phone number could not be read/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText(/^INVALID_PHONE$/)).not.toBeInTheDocument();
  });

  it("renders progress counters with reserved height", () => {
    render(
      <ProgressStep
        job={jobFixture({
          status: "processing",
          processed: 4,
          total: 10,
          percent: 40,
          totals: { processed: 4, inserted: 3, updated: 1, skipped: 0, failed: 0, duplicates: 0 },
        })}
        rowsPerSec={12}
        eta={10}
        onPause={vi.fn()}
        onResume={vi.fn()}
        onCancel={vi.fn()}
        onDownloadErrors={vi.fn()}
      />,
    );
    expect(screen.getByText("Inserted")).toBeInTheDocument();
    expect(screen.getByText("Inserted").parentElement).toHaveTextContent("3");
    expect(screen.getByText(/safe to leave this page/i)).toBeInTheDocument();
  });

  it("lets the parent receive a dropped file", async () => {
    const user = userEvent.setup();
    const onFile = vi.fn();
    render(
      <UploadStep
        config={importConfigFixture}
        fileName={null}
        uploadPercent={0}
        uploading={false}
        analyzing={false}
        onFile={onFile}
        onCancel={vi.fn()}
      />,
    );
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["name,phone\nAda,+9198\n"], "contacts.csv", { type: "text/csv" });
    await user.upload(input, file);
    expect(onFile).toHaveBeenCalled();
  });
});
