import React, { useState } from "react";
import type { AutomationDraft } from "../../store/automation.store";
import {
  ACTION_OPTIONS,
  TRIGGER_OPTIONS,
} from "../../constants/automation.constants";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ReviewStepProps {
  draft: AutomationDraft;
  onBack: () => void;
  onSave: ({
    name,
    status,
  }: {
    name: string;
    status: "published" | "draft";
  }) => void;
  loading?: boolean;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  draft,
  onBack,
  onSave,
  loading,
}) => {
  const [name, setName] = useState("");
  const [currentButton, setCurrentButton] = useState<
    "draft" | "published" | null
  >(null);

  const triggerLabel =
    TRIGGER_OPTIONS.find((t) => t.value === draft.trigger)?.label || "";

  const getActionLabel = (type: string) =>
    ACTION_OPTIONS.find((a) => a.value === type)?.label || type;

  return (
    <div>
      <h2 className="text-base font-semibold text-gray-800 mb-1">
        Review Automation
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Review your automation settings before saving
      </p>

      <div className="space-y-3">
        {/* Name */}
        <div>
          <label className="text-xs font-medium text-gray-500 block mb-1">
            Automation Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Qualified Lead Assignment"
            className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:border-violet-400"
          />
        </div>

        {/* When */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            When
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700">
              {triggerLabel}
            </span>
          </div>

          {draft.conditions.length > 0 && (
            <>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1">
                Is Equal To
              </p>
              {draft.conditions.map((c, i) => (
                <div key={i} className="text-xs text-gray-600">
                  <span className="font-medium">{c.field}</span>{" "}
                  <span className="text-gray-400">{c.operator}</span>{" "}
                  <span className="font-medium text-violet-600">
                    {c.values}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Then */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
            Then
          </p>
          <div className="space-y-1.5">
            {draft.actions.map((action, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                <div className="text-xs text-gray-600">
                  <span className="font-medium">
                    {getActionLabel(action.type)}
                  </span>
                  {Object.entries(action.config).length > 0 && (
                    <span className="text-gray-400 ml-1">
                      → {Object.values(action.config).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button onClick={onBack} className="actions-btn px-2!">
          <ArrowLeft /> Back
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={() => {
              if (!name.trim()) return;
              setCurrentButton("draft");

              onSave({
                name: name.trim(),
                status: "draft",
              });
            }}
            disabled={!name.trim() || loading}
            className="actions-btn px-4!"
          >
            Save Draft
            {loading && currentButton === "draft" && <Loader color="gray" />}
          </Button>

          <Button
            onClick={() => {
              if (!name.trim()) return;

              setCurrentButton("published");

              onSave({
                name: name.trim(),
                status: "published",
              });
            }}
            disabled={!name.trim() || loading}
            className="px-5 py-2 bg-primary/90 text-white text-sm font-medium rounded-xl hover:bg-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            Save Automation{" "}
            {loading && currentButton === "published" && <Loader />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
