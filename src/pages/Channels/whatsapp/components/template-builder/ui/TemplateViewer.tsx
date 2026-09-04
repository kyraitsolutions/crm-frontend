import React from "react";
import { X, FileText, CheckCircle2, MessageCircle } from "lucide-react";

interface TemplateJourney {
    name: string;
    status: "APPROVED" | "PENDING" | "REJECTED";
    createdAt: string;
    approvedAt?: string;
    message: string;
    buttonText?: string;
}

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="relative w-full max-w-[960px] overflow-hidden rounded-lg bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-8 py-7">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[22px] font-medium text-gray-900">
                            {template.name}
                        </h2>

                        <span
                            className={`rounded-full px-3 py-1 text-[11px] font-medium ${statusClass[template.status]
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
                    <h3 className="mb-7 text-[22px] font-medium text-gray-900">
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
                                        {template.createdAt}
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

                                    {template.approvedAt && (
                                        <p className="mt-2 text-sm text-gray-500">
                                            {template.approvedAt}
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
                                {/* Message */}
                                <div className="whitespace-pre-line px-4 py-4 text-[14px] leading-[1.65] text-gray-800">
                                    {template.message}
                                </div>

                                {/* CTA */}
                                {template.buttonText && (
                                    <div className="border-t border-gray-200 px-4 py-3 text-center">
                                        <button className="text-sm font-medium text-blue-500 hover:text-blue-600">
                                            <span className="mr-1">↗</span>
                                            {template.buttonText}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateJourneyModal;