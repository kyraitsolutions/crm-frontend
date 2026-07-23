import {
  CheckCircle,
  Clock,
  ExternalLink,
  MessageSquare,
  Monitor,
  Phone,
  Smartphone,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { useTemplateStore } from "../../store/template-builder.store";

const resolveVariables = (
  text: string,
  vars: { name: string; exampleValue: string }[],
) => {
  let resolved = text;
  vars.forEach((v, i) => {
    const placeholder = `{{${i + 1}}}`;
    resolved = resolved.replace(
      new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g"),
      v.exampleValue || placeholder,
    );
  });
  return resolved;
};

const ValidationItem: React.FC<{ ok: boolean; label: string }> = ({
  ok,
  label,
}) => (
  <div className="flex items-center gap-2 text-xs">
    {ok ? (
      <CheckCircle size={13} className="text-green-500 flex-shrink-0" />
    ) : (
      <XCircle size={13} className="text-red-400 flex-shrink-0" />
    )}
    <span className={ok ? "text-gray-700" : "text-red-500"}>{label}</span>
  </div>
);

export const TemplatePreviewPanel: React.FC = () => {
  const [viewMode, setViewMode] = useState<"Mobile View" | "Desktop View">(
    "Mobile View",
  );

  const {
    headerText,
    headerVariables,
    bodyText,
    bodyVariables,
    footerText,
    buttons,
  } = useTemplateStore();

  const resolvedHeader = resolveVariables(headerText, headerVariables);
  const resolvedBody = resolveVariables(bodyText, bodyVariables);

  // Validation checks
  const allVarsHaveExamples = [...headerVariables, ...bodyVariables].every(
    (v) => v.exampleValue.trim() !== "",
  );
  const buttonCountOk = buttons.length <= 10;
  const noProhibited = true; // simplified
  const followsGuidelines = bodyText.length <= 1024;
  const hasContent = bodyText.trim().length > 0;

  const validationScore = [
    allVarsHaveExamples,
    buttonCountOk,
    noProhibited,
    followsGuidelines,
    hasContent,
  ].filter(Boolean).length;
  const approvalChance =
    validationScore >= 4 ? "High" : validationScore >= 2 ? "Medium" : "Low";
  const barColor =
    approvalChance === "High"
      ? "bg-green-500"
      : approvalChance === "Medium"
        ? "bg-yellow-400"
        : "bg-red-400";
  const barWidth =
    approvalChance === "High"
      ? "w-full"
      : approvalChance === "Medium"
        ? "w-1/2"
        : "w-1/4";

  const isMobile = viewMode === "Mobile View";

  const renderButtonPreview = (btn: (typeof buttons)[0]) => {
    const icon =
      btn.type === "URL Button" ? (
        <ExternalLink size={12} />
      ) : btn.type === "Phone Button" ? (
        <Phone size={12} />
      ) : (
        <MessageSquare size={12} />
      );
    return (
      <button
        key={btn.id}
        className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 border-t border-gray-200 hover:bg-gray-50 transition-colors"
      >
        {icon}
        {btn.label || "Button"}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-4 border border-primary/20 p-2 shadow-sm rounded-xl">
      {/* Header */}
      <div>
        {/* Toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-4">
          {(["Mobile View", "Desktop View"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors ${
                viewMode === mode
                  ? "bg-gray-100 text-gray-900"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              {mode === "Mobile View" ? (
                <Smartphone size={13} />
              ) : (
                <Monitor size={13} />
              )}
              {mode}
            </button>
          ))}
        </div>

        {/* Phone mockup */}
        <div
          className={`mx-auto rounded-xl overflow-hidden shadow-lg bg-[#ECE5DD] ${
            isMobile ? "max-w-65" : "max-w-full"
          }`}
        >
          {/* WhatsApp header bar */}
          <div className="bg-[#075E54] flex items-center gap-2 px-3 py-2">
            <div className="w-6 h-6 rounded-full bg-green-300 flex items-center justify-center text-xs font-bold text-green-800">
              Y
            </div>
            <span className="text-white text-xs font-semibold flex-1">
              Your Business ✓
            </span>
            <span className="text-green-200 text-xs">⋯</span>
          </div>

          {/* Chat area */}
          <div className="p-3 min-h-50">
            <div className="bg-white rounded-xl rounded-tl-none shadow-sm overflow-hidden max-w-[95%]">
              <div className="p-3">
                {/* Header text */}
                {resolvedHeader && (
                  <p className="text-xs font-semibold text-gray-800 break-all mb-2">
                    {resolvedHeader}
                  </p>
                )}
                {/* Body text */}
                <pre className="text-xs text-gray-700 leading-relaxed break-all whitespace-pre-line font-serif">
                  {resolvedBody || (
                    <span className="text-gray-400 italic">
                      Message body will appear here...
                    </span>
                  )}
                </pre>
                {/* Footer */}
                {footerText && (
                  <p className="text-xs text-gray-400 mt-2">{footerText}</p>
                )}
                <p className="text-right text-[10px] text-gray-400 mt-1">
                  11:30 AM
                </p>
              </div>
              {/* Buttons */}
              {buttons.length > 0 && (
                <div className="border-t border-gray-100">
                  {buttons.map(renderButtonPreview)}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop limitation warning */}
        {!isMobile && buttons.length > 3 && (
          <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 flex gap-2">
            <span className="text-amber-500 text-sm">⚠️</span>
            <div>
              <p className="text-xs font-semibold text-amber-700">
                Desktop Limitation
              </p>
              <p className="text-xs text-amber-600 mt-0.5">
                This template contains {buttons.length} buttons. WhatsApp
                Desktop users may see "View on Phone" instead.
              </p>
              <button className="text-xs text-blue-600 underline mt-1">
                Learn more
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Meta Validation */}
      <div className="border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-800 mb-3">
          Meta Validation
        </p>

        {/* Score bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
          <div
            className={`h-full rounded-full transition-all ${barColor} ${barWidth}`}
          />
        </div>
        <p
          className={`text-xs font-medium mb-3 ${approvalChance === "High" ? "text-green-600" : approvalChance === "Medium" ? "text-yellow-600" : "text-red-500"}`}
        >
          {approvalChance} approval chance
        </p>

        <div className="flex flex-col gap-2">
          <ValidationItem
            ok={allVarsHaveExamples}
            label="All variables are used correctly"
          />
          <ValidationItem
            ok={buttonCountOk}
            label={`Button count within limit (${buttons.length}/10)`}
          />
          <ValidationItem
            ok={noProhibited}
            label="No prohibited content detected"
          />
          <ValidationItem
            ok={followsGuidelines}
            label="Following WhatsApp guidelines"
          />
        </div>

        {/* <button className="mt-3 text-xs text-blue-600 underline font-medium">
          View Full Guidelines ↗
        </button> */}

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 border-t border-gray-100 pt-3">
          <Clock size={13} />
          <span>
            Approval usually takes{" "}
            <strong className="text-gray-700">Up to 24 hours</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
