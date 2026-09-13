import { formatDateTime } from "@/utils/date-utils";
import { CheckCircle2, FileText, MessageCircle, X } from "lucide-react";
import React from "react";
import type { TemplateJourney } from "../../../types/templates/template.type";

interface TemplateJourneyModalProps {
  template: TemplateJourney;
  onClose: () => void;
}

const TemplateJourneyModal: React.FC<TemplateJourneyModalProps> = ({
  template,
  onClose,
}) => {
  const statusClass = {
    APPROVED: "bg-green-50 text-green-600",
    PENDING: "bg-yellow-50 text-yellow-600",
    REJECTED: "bg-red-50 text-red-600",
  };

  const header = template?.components.find(
    (component) => component.type === "HEADER",
  );

  const body = template?.components.find(
    (component) => component.type === "BODY",
  );

  const footer = template?.components.find(
    (component) => component.type === "FOOTER",
  );

  const buttons = template?.components.find(
    (component) => component.type === "BUTTONS",
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="relative w-full max-w-200 overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-7">
          <div className="flex items-center gap-4">
            <h2 className="text-md font-medium text-gray-900">
              {template.name}
            </h2>

            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusClass[template.status]
              }`}
            >
              {template.status}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
            aria-label="Close"
          >
            <X size={22} strokeWidth={1.8} />
          </button>
        </div>

        {/* Content */}
        <div className="px-8 py-8">
          <h3 className="mb-7 text-lg font-medium text-gray-900">
            Template Journey
          </h3>

          <div className="grid grid-cols-[1fr_1fr] gap-12">
            {/* Timeline */}
            <div className="relative">
              {/* Created */}
              <div className="relative flex gap-5">
                <div className="relative flex flex-col items-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-gray-50">
                    <FileText
                      size={20}
                      strokeWidth={1.8}
                      className="text-gray-700"
                    />
                  </div>

                  <div className="absolute top-12 h-12 border-l border-dashed border-gray-300" />
                </div>

                <div className="pt-0.5">
                  <div className="inline-flex rounded-2xl bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
                    Created
                  </div>

                  <p className="mt-2 text-sm text-gray-500">
                    {formatDateTime(template.createdAt)}
                  </p>
                </div>
              </div>

              {/* Approved */}
              <div className="mt-7 flex gap-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white">
                  {template.status === "APPROVED" ? (
                    <CheckCircle2
                      size={20}
                      strokeWidth={1.8}
                      className="text-green-600"
                    />
                  ) : (
                    <MessageCircle
                      size={20}
                      strokeWidth={1.8}
                      className="text-gray-700"
                    />
                  )}
                </div>

                <div className="pt-0.5">
                  <div
                    className={`inline-flex rounded-2xl px-3 py-2 text-sm font-medium ${template.status === "APPROVED" ? "text-green-600 bg-green-100" : "text-orange-400 bg-orange-50"}`}
                  >
                    {template.status}
                  </div>

                  {template.updatedAt && (
                    <p className="mt-2 text-sm text-gray-500">
                      {formatDateTime(template.updatedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* WhatsApp Preview */}
            <div className="w-full max-w-100 overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              {/* WhatsApp header bar */}
              <div className="flex items-center gap-2 bg-[#075E54] px-3 py-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-300 text-xs font-bold text-green-800">
                  Y
                </div>
                <span className="flex-1 text-xs font-semibold text-white">
                  Your Business ✓
                </span>
                <span className="text-xs text-green-200">⋯</span>
              </div>

              {/* Chat area */}
              <div className="min-h-50 bg-[#e5ddd5] p-3">
                <div className="max-w-[95%] overflow-hidden rounded-2xl rounded-tl-none bg-white shadow-sm">
                  <div className="p-3">
                    {/* HEADER */}
                    {header?.text && (
                      <p className="mb-2 wrap-break-word text-[13px] font-semibold leading-5 text-gray-900">
                        {header.text}
                      </p>
                    )}

                    {/* BODY */}
                    {body?.text && (
                      <p className="whitespace-pre-line wrap-break-word text-[13px] leading-relaxed text-gray-800">
                        {body.text}
                      </p>
                    )}

                    {/* FOOTER */}
                    {footer?.text && (
                      <p className="mt-2 text-[11px] text-gray-400">
                        {footer.text}
                      </p>
                    )}
                  </div>

                  {/* BUTTONS */}
                  {buttons && buttons?.buttons.length > 0 ? (
                    <div className="border-t border-gray-100">
                      {buttons?.buttons?.map((button, index: number) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full border-b border-gray-100 px-4 py-2.5 text-center text-[13px] font-medium text-blue-500 last:border-b-0 hover:bg-gray-50"
                        >
                          {button?.text}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateJourneyModal;
