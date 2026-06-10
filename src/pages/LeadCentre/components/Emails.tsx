import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, Calendar, User } from "lucide-react";

interface Email {
    id: string;
    to: string;
    subject: string;
    html: string;
    status: "queued" | "sent" | "failed";
    sentAt?: string;
    createdAt: string;
    fromEmail?: string;
}

interface EmailsProps {
    lead: {
        emails?: Email[];
    };
    onCompose: () => void;
}

const statusColors = {
    sent: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    queued: "bg-yellow-100 text-yellow-700",
};

const Emails = ({ lead, onCompose }: EmailsProps) => {
    const [openEmailId, setOpenEmailId] = useState<string | null>(null);
    const [openEmail, setOpenEmail] = useState(false)

    const emails = lead?.emails || [];

    const handleToggle = (id: string) => {
        setOpenEmailId((prev) =>
            prev === id ? null : id
        );
    };

    return (
        <div className="bg-white rounded-xl border-gray-200 overflow-hidden">

            {/* Header */}
            <div onClick={() => setOpenEmail((prev) => !prev)} className={` ${openEmail && "border-b"} px-5 py-4 flex items-center justify-between`}>

                <div>
                    <h2 className="font-semibold text-lg text-gray-900">
                        Emails
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                        {emails.length} email{emails.length !== 1 ? "s" : ""}
                    </p>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCompose()
                    }}
                    className="bg-primary text-white px-4 py-1.5 rounded-xl cursor-pointer text-sm hover:opacity-90 transition"
                >
                    Compose Email
                </button>
            </div>

            {openEmail && <div>

                {/* Tabs */}
                <div className="border-b px-5">
                    <div className="flex gap-8 text-sm">
                        <button className="border-b-2 border-primary text-primary py-3 font-medium">
                            Mails
                        </button>

                        <button className="text-gray-500 py-3">
                            Drafts
                        </button>

                        <button className="text-gray-500 py-3">
                            Scheduled
                        </button>
                    </div>
                </div>

                {/* Empty State */}
                {!emails.length ? (
                    <div className="h-48 flex flex-col items-center justify-center text-gray-400">

                        <Mail size={32} className="mb-3" />
                        <p>No emails found</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {emails.map((email) => {
                            const isOpen = openEmailId === email.id;
                            return (
                                <div
                                    key={email.id}
                                    className="hover:bg-gray-50 transition"
                                >
                                    {/* Header */}
                                    <button
                                        onClick={() => handleToggle(email.id)}
                                        className="w-full px-5 py-4 text-left flex items-start justify-between"
                                    >
                                        <div className="flex gap-4 flex-1">

                                            {/* Icon */}
                                            <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                <Mail size={18} />
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">

                                                <div className="flex items-center gap-3 flex-wrap">

                                                    <h3 className="font-medium text-gray-900 truncate">{email.subject}</h3>

                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[email.status]}`}>
                                                        {email.status}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">

                                                    <div className="flex items-center gap-1">
                                                        <User size={14} />
                                                        {email.to}
                                                    </div>

                                                    <div className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {new Date(email.sentAt || email.createdAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expand Icon */}
                                        <div className="ml-4 shrink-0 text-gray-500">
                                            {isOpen ? (
                                                <ChevronUp size={18} />
                                            ) : (
                                                <ChevronDown size={18} />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded Body */}
                                    {isOpen && (
                                        <div className="px-5 pb-5">

                                            <div className="border rounded-xl bg-gray-50 overflow-hidden">

                                                {/* Email Meta */}
                                                <div className="border-b bg-white px-5 py-4 text-sm">

                                                    <div className="space-y-1">
                                                        <p>
                                                            <span className="font-medium text-gray-700">
                                                                To:
                                                            </span>{" "}
                                                            {email.to}
                                                        </p>

                                                        {email.fromEmail && (
                                                            <p>
                                                                <span className="font-medium text-gray-700">
                                                                    From:
                                                                </span>{" "}
                                                                {email.fromEmail}
                                                            </p>
                                                        )}

                                                        <p>
                                                            <span className="font-medium text-gray-700">
                                                                Subject:
                                                            </span>{" "}
                                                            {email.subject}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Email Body */}
                                                <div
                                                    className="p-5 prose prose-sm max-w-none bg-white"
                                                    dangerouslySetInnerHTML={{ __html: email.html }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        )}
                    </div>
                )}
            </div>}
        </div>
    );
};

export default Emails;