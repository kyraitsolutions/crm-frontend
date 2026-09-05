import React from "react";
import { X, FileText, CheckCircle2, MessageCircle } from "lucide-react";
import type { TemplateButton, TemplateJourney } from "../../../types/templates/template.type";
import { formatDateTime } from "@/utils/date-utils";

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
        (component) => component.type === "HEADER"
    );

    const body = template?.components.find(
        (component) => component.type === "BODY"
    );

    const footer = template?.components.find(
        (component) => component.type === "FOOTER"
    );

    const buttons = template?.components.find(
        (component) => component.type === "BUTTONS"
    );



    console.log("template", template);
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-[860px] overflow-hidden rounded-xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-8 py-7">
                    <div className="flex items-center gap-4">
                        <h2 className="text-md font-medium text-gray-900">
                            {template.name}
                        </h2>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass[template.status]
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
                                    <div className="inline-flex rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700">
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
                                    <CheckCircle2
                                        size={21}
                                        strokeWidth={1.8}
                                        className="text-green-500"
                                    />
                                </div>

                                <div className="pt-0.5">
                                    <div className="inline-flex rounded-md bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
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
                        <div className="relative pt-1">
                            {/* WhatsApp icon */}
                            <div className="absolute -left-3 -top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366]">
                                    <MessageCircle
                                        size={15}
                                        fill="white"
                                        className="text-white"
                                    />
                                </div>
                            </div>

                            <div className="ml-0 w-full max-w-[345px] overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
                                {/* WhatsApp message */}
                                <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">

                                    {/* HEADER */}
                                    {header?.text && (
                                        <div className="px-4 pt-4 pb-2">
                                            <p className="text-[14px] font-semibold leading-5 text-gray-900">
                                                {header.text}
                                            </p>
                                        </div>
                                    )}

                                    {/* BODY */}
                                    {body?.text && (
                                        <div className="whitespace-pre-line px-4 py-2 text-[14px] leading-[1.6] text-gray-800">
                                            {body.text}
                                        </div>
                                    )}

                                    {/* FOOTER */}
                                    {footer?.text && (
                                        <div className="px-4 pt-1 pb-3">
                                            <p className="text-[12px] text-gray-500">
                                                {footer.text}
                                            </p>
                                        </div>
                                    )}

                                    {/* BUTTONS */}
                                    {buttons?.length ? (
                                        <div className="border-t border-gray-200">
                                            {buttons.map((button: TemplateButton, index: number) => (
                                                <div
                                                    key={index}
                                                    className="border-b border-gray-100 px-4 py-3 text-center last:border-b-0"
                                                >
                                                    <button className="text-[14px] font-medium text-blue-500">
                                                        {button.label}
                                                    </button>
                                                </div>
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