import React, { useState } from "react";
import { Copy, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { webhookService } from "../services/webhook.service";

interface TokenPopupProps {
    setToken: React.Dispatch<React.SetStateAction<string>>;
    popupType: string;
    setPopupType: React.Dispatch<React.SetStateAction<string>>;
    accountId: string;
    open: boolean;
    token?: string;
    onClose: () => void;
}

const TokenPopup: React.FC<TokenPopupProps> = ({
    token,
    setToken,
    popupType,
    setPopupType,
    accountId,
    open,
    onClose,
}) => {
    if (!open) return null;

    const [loading, setLoading] = useState(false);
    const generateToken = async () => {
        try {
            setLoading(true);
            const response = await webhookService.generateToken(String(accountId));
            console.log(response.data.doc.token)
            if (response.status === 201) {
                setToken(response.data.doc.token)
                setPopupType("success")
            }

            console.log(response?.data?.doc)
        } catch (error) {
            console.error("Error", error)
        }
        finally {
            setLoading(false);
        }
    }
    const copyToken = async () => {
        if (!token) return;
        await navigator.clipboard.writeText(token);
        alert("Token copied!");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="relative w-full max-w-xl rounded-xl bg-white shadow-2xl">

                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-black"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="border-b px-6 py-5">
                    <div className="flex items-center gap-3">
                        {popupType === "warning" ? (
                            <AlertTriangle className="text-orange-500" size={28} />
                        ) : (
                            <CheckCircle2 className="text-green-500" size={28} />
                        )}

                        <div>
                            <h2 className="text-xl font-semibold">
                                {popupType === "warning"
                                    ? "Regenerate Webhook Token?"
                                    : "New Webhook Token Generated"}
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {popupType === "warning"
                                    ? "Generating a new token will immediately invalidate your current webhook token."
                                    : "Your previous webhook token has been deactivated."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-5 p-6">

                    {popupType === "warning" && (
                        <>
                            <div className="rounded-lg border border-orange-300 bg-orange-50 p-4">
                                <h3 className="mb-2 font-semibold text-orange-700">
                                    ⚠ Important
                                </h3>

                                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                                    <li>The current webhook token will expire immediately.</li>
                                    <li>Any websites using it will stop working.</li>
                                    <li>A new token will be generated.</li>
                                    <li>The new token will only be displayed once.</li>
                                    <li>Make sure to copy it before closing the next dialog.</li>
                                </ul>
                            </div>
                        </>
                    )}

                    {popupType === "success" && (
                        <>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700">
                                    Your New Token
                                </label>

                                <div className="flex items-center rounded-lg border bg-gray-100 p-3">
                                    <code className="flex-1 break-all text-sm">
                                        {token}
                                    </code>

                                    <button
                                        onClick={copyToken}
                                        className="ml-3 rounded-md p-2 transition hover:bg-gray-200"
                                    >
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                <h3 className="font-semibold text-blue-700">
                                    🔒 Security Notice
                                </h3>

                                <p className="mt-2 text-sm text-gray-700">
                                    This token will never be shown again after closing this
                                    window. Store it securely. If you lose it, you'll need to
                                    generate a new one.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t px-6 py-4">
                    {popupType === "warning" ? (
                        <>
                            <button
                                onClick={onClose}
                                className="rounded-lg border px-5 py-2 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={loading}
                                onClick={generateToken}
                                className="rounded-lg bg-red-600 px-5 py-2 text-white transition hover:bg-red-700 disabled:opacity-60"
                            >
                                {loading ? "Generating..." : "Regenerate Token"}
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="rounded-lg border px-5 py-2 hover:bg-gray-100"
                            >
                                Close
                            </button>

                            <button
                                onClick={copyToken}
                                className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
                            >
                                Copy Token
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TokenPopup;