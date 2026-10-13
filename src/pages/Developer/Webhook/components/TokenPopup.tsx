import React, { useState } from "react";
import { Copy, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { webhookService } from "../services/webhook.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TokenPopupProps {
  setToken: React.Dispatch<React.SetStateAction<string>>;
  popupType: string;
  setPopupType: React.Dispatch<React.SetStateAction<string>>;
  accountId: string;
  open: boolean;
  token?: string;
  onClose: () => void;
  onCreated?: () => void;
}

const TokenPopup: React.FC<TokenPopupProps> = ({
  token,
  setToken,
  popupType,
  setPopupType,
  accountId,
  open,
  onClose,
  onCreated,
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const close = () => {
    setName("");
    onClose();
  };

  const generateToken = async () => {
    const tokenName = name.trim();
    if (!tokenName) return;
    try {
      setLoading(true);
      const response = await webhookService.generateToken(String(accountId), {
        name: tokenName,
      });
      console.log(response.data.doc.token);
      if (response.status === 201) {
        setToken(response.data.doc.token);
        setPopupType("success");
        onCreated?.();
      }

      console.log(response?.data?.doc);
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };
  const copyToken = async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    alert("Token copied!");
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl">
        {/* Close */}
        <button
          onClick={close}
          className="absolute right-4 top-4 text-gray-400 hover:text-black cursor-pointer"
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
                  ? "Generate a webhook token?"
                  : "Webhook token generated"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {popupType === "warning"
                  ? "This creates another lifetime token. Tokens you already created keep working."
                  : "Copy this token now. Existing tokens are unchanged."}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {popupType === "warning" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Token name
                </label>
                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Production website"
                  className="input-field"
                />
              </div>
              <div className="rounded-lg border border-orange-300 bg-orange-50 p-4">
                <h3 className="mb-2 font-semibold text-orange-700">
                  ⚠ Important
                </h3>

                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700">
                  <li>A new token is added. Older tokens stay active.</li>
                  <li>Tokens do not expire.</li>
                  <li>The full token is shown only once.</li>
                  <li>Copy it before you close this dialog.</li>
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
                  <code className="flex-1 break-all text-sm">{token}</code>

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
              <Button
                onClick={close}
                className="actions-btn px-4! py-2! rounded-xl!"
              >
                Cancel
              </Button>

              <Button
                disabled={loading || !name.trim()}
                onClick={generateToken}
                className="rounded-xl!"
              >
                {loading ? "Generating..." : "Generate token"}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={close}
                className="actions-btn px-4! py-2! rounded-xl!"
              >
                Close
              </Button>

              <Button
                onClick={copyToken}
                className="rounded-xl"
              >
                Copy Token
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenPopup;
