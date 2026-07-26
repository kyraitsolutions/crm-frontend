import { ArrowUpRight } from "lucide-react";

interface SampleTemplateCardProps {
    title: string;
    content: string;
    image?: string;
    type: string;
    previewLabel?: string;
    submitLabel?: string;
    onPreview?: () => void;
    onSubmit?: () => void;
    onOpen?: () => void;
}

const SampleTemplateCard = ({
    title,
    content,
    image,
    type,
    previewLabel = "Preview",
    submitLabel = "Submit",
    onPreview,
    onSubmit,
    onOpen,
}: SampleTemplateCardProps) => {
    return (
        <div className="rounded-xl border border-gray-100 bg-white p-5">
            {/* Image */}
            <div className="flex justify-center">
                <img
                    src={image || "https://placehold.co/90x90?text=Image"}
                    alt={title}
                    className="h-16 w-16 rounded-full border object-cover"
                />
            </div>

            {/* Title */}
            <h3 className="mt-2 text-center text-sm font-semibold text-gray-800">
                {title}
            </h3>

            {/* Badge */}
            <div className="mt-3 flex items-center justify-center gap-2">
                <span className="rounded bg-orange-100 px-3 py-1 text-xs font-medium uppercase text-orange-600">
                    {type}
                </span>

                <button
                    onClick={onOpen}
                    className="rounded border border-gray-200 p-1 transition hover:bg-gray-50"
                >
                    <ArrowUpRight size={14} className="text-gray-500" />
                </button>
            </div>

            {/* Content */}
            <p className="mt-5 line-clamp-4  text-xs leading-5 text-gray-600">
                {content}
            </p>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-between">
                <button
                    onClick={onPreview}
                    className="rounded-xl border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                >
                    {previewLabel}
                </button>

                <button
                    onClick={onSubmit}
                    className="rounded-xl bg-teal-900 border border-teal-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-teal-800"
                >
                    {submitLabel}
                </button>
            </div>
        </div>
    );
};

export default SampleTemplateCard;