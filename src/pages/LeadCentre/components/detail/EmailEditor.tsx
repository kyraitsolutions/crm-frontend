import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Select from "react-select";
import {
  Maximize2,
  Minimize2,
  Paperclip,
  Clock3,
  ChevronDown,
  Sparkles,
  Loader2,
  X,
} from "lucide-react";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import type { ILead } from "../../types/lead.type";
import { useAuthStore } from "@/stores";
import { EmailService } from "@/services/email.service";
import { useAccountsStore } from "@/stores/accounts.store";

interface Recipient {
  label: string;
  value: string;
}

interface EmailEditorProps {
  lead: ILead;
  isOpen: boolean;
  onClose: () => void;
}

const EmailEditor = ({ lead, isOpen, onClose }: EmailEditorProps) => {
  const emailService = new EmailService();

  const { user, accountId } = useAuthStore((state) => state);
  const { accounts } = useAccountsStore((state) => state);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ccOpen, setCcOpen] = useState(false);
  const [bccOpen, setBccOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [isMaximize, setIsMaximize] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiBox, setShowAiBox] = useState(false);

  const [to, setTo] = useState<Recipient[]>([
    {
      label: lead?.name ?? "",
      value: lead?.email ?? "",
    },
  ]);

  const toolbarOptions = [
    ["bold", "italic", "underline"],
    [{ size: ["small", false, "large"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ];
  const handleGenerateAIEmail = async (
    type: "generate" | "rewrite" | "shorten" | "professional" | "friendly",
  ) => {
    try {
      setAiLoading(true);

      const response = await fetch("/api/ai/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          subject,
          body,
          type,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubject(data.subject);
        setBody(data.body);
        setShowAiBox(false);
      }
    } catch (error) {
      console.log(error);
      alert("AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };
  const handleSendEmail = async () => {
    try {
      if (!to.length) {
        alert("Please add recipient");
        return;
      }

      if (!subject.trim()) {
        alert("Subject is required");
        return;
      }

      if (!body.trim()) {
        alert("Email body is required");
        return;
      }

      setSending(true);

      const payload = {
        leadId: lead.id || null, // optional
        contactId: null, // optional

        emails: to.map((recipient) => recipient.value),
        name: "abhijeet",
        subject,

        html: body, // ReactQuill HTML
      };

      const response = await emailService.sendEmail(String(accountId), payload);
      console.log(response);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      alert("Email queued successfully");

      // reset form
      setSubject("");
      setBody("");
      setTo([]);

      onClose();
    } catch (error: any) {
      console.log(error);

      alert(error.message || "Failed to send email");
    } finally {
      setSending(false);
    }
  };

  console.log("User AuthUser", user, accounts);
  const getCurrentAccount = accounts?.find((acc) => acc.id === accountId);

  console.log(getCurrentAccount);
  const [
    sender,
    //  setSender
  ] = useState(getCurrentAccount);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed top-0 ${isMaximize ? "top-0 w-full" : "max-w-2xl"} h-full  right-0 w-full z-50 bg-black/40 flex items-start justify-end`}
    >
      <div
        className={`w-full ${isMaximize ? "h-screen w-screen" : "h-full max-w-7xl"}  duration-100  bg-white shadow-2xl rounded-t-md overflow-hidden flex flex-col`}
      >
        {/* Top Header */}
        <div className="h-11 bg-[#5468ff] text-white flex items-center justify-between px-5">
          <div className="flex items-center gap-4">
            <h2 className="font-medium text-md">New Message</h2>

            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button>
              {!isMaximize ? (
                <Maximize2 onClick={() => setIsMaximize(true)} size={18} />
              ) : (
                <Minimize2 onClick={() => setIsMaximize(false)} size={18} />
              )}
            </button>

            <button onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-b py-2">
          {/* Sender */}
          <div className="px-7 text-sm flex items-center  gap-4">
            <div className="font-semibold h-8 w-8  capitalize flex text-white items-center justify-center bg-second/80 rounded-full">
              {sender?.email?.charAt(0)}
            </div>{" "}
            {sender?.accountName} {`<${sender?.email}>`}
          </div>
          {/* Template */}
          <div className="flex justify-end px-4 gap-3">
            <button
              onClick={() => setShowAiBox(!showAiBox)}
              className="border border-violet-500 text-violet-600 text-sm px-3 py-1 rounded-xl flex items-center gap-2 hover:bg-violet-50"
            >
              <Sparkles size={16} />
              AI Write
            </button>

            <button className="border border-[#5468ff] text-sm text-[#5468ff] px-3 py-1 rounded-xl flex items-center gap-2 hover:bg-[#eef1ff]">
              Insert Template
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Alert */}
        <div className="bg-[#f8f4dc] border-b px-7 py-2 text-xs text-[#5b5b5b]">
          <span className="font-semibold">Sender email changed</span> : To
          improve email deliverability, CRM will avoid sending emails from
          public domains.
        </div>

        {/* Recipients */}
        <div className="border-b px-6 py-1 flex items-center gap-4 text-sm">
          <span className="w-10 text-gray-600">To</span>

          <div className="flex-1 py-1">
            <Select
              isMulti
              value={to}
              onChange={(val) => setTo(val as Recipient[])}
              placeholder="Add recipient"
              className="py-0! text-sm"
            />
          </div>

          <button
            onClick={() => setBccOpen(!bccOpen)}
            className="text-[#5665ff]"
          >
            Bcc
          </button>

          <button onClick={() => setCcOpen(!ccOpen)} className="text-[#5665ff]">
            Cc
          </button>
        </div>

        {/* CC */}
        {ccOpen && (
          <div className="py-2 border-b">
            <div className="px-6 flex items-center gap-4 text-sm">
              <span className="w-10 text-gray-600">Cc</span>

              <input
                className="flex-1 outline-none py-1 text-sm"
                placeholder="Add CC"
              />
            </div>
          </div>
        )}

        {/* BCC */}
        {bccOpen && (
          <div className="py-2 border-b">
            <div className="px-6 flex items-center gap-4 text-sm">
              <span className="w-10 text-gray-600 ">Bcc</span>

              <input
                className="flex-1 outline-none py-1 text-sm"
                placeholder="Add BCC"
              />
            </div>
          </div>
        )}

        {/* Subject */}
        <div className="px-6 py-4 flex items-center gap-4 text-sm">
          <span className="w-20 text-gray-600">Subject</span>

          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Enter subject"
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <ReactQuill
            theme="snow"
            value={body}
            onChange={setBody}
            modules={{
              toolbar: toolbarOptions,
            }}
            placeholder="Write your email..."
            className="email-editor h-full border-none! w-full!"
          />
        </div>

        {/* Footer */}
        <div className="border-t px-5 py-4 flex items-center justify-between">
          <ButtonWithTitle
            title="Attachment"
            className=" w-8 h-8 rounded-md text-gray-500 flex items-center justify-center"
          >
            <Paperclip size={18} />
          </ButtonWithTitle>

          <div className="flex items-center gap-7">
            <button className="flex items-center gap-2 text-[#374151]">
              <Clock3 size={18} />
              Schedule
            </button>

            <button
              onClick={handleSendEmail}
              disabled={sending}
              className="bg-[#5468ff] text-white px-3 py-1 rounded-md hover:bg-[#4355ef] disabled:opacity-50"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>

      {showAiBox && (
        <div className="border-b bg-violet-50 px-6 py-4 absolute">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-sm">Generate Email with AI</h3>

            <button onClick={() => setShowAiBox(false)}>
              <X size={16} />
            </button>
          </div>

          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Example: Write a follow-up email after product demo"
            className="w-full border rounded-lg p-3 outline-none text-sm resize-none"
            rows={3}
          />

          <div className="flex gap-2 mt-3 flex-wrap">
            <button
              disabled={aiLoading}
              onClick={() => handleGenerateAIEmail("generate")}
              className="bg-[#5468ff] text-white px-3 py-2 rounded-md text-sm"
            >
              {aiLoading ? <Loader2 className="animate-spin" /> : "Generate"}
            </button>

            <button
              onClick={() => handleGenerateAIEmail("rewrite")}
              className="border px-3 py-2 rounded-md text-sm"
            >
              Rewrite
            </button>

            <button
              onClick={() => handleGenerateAIEmail("professional")}
              className="border px-3 py-2 rounded-md text-sm"
            >
              Professional
            </button>

            <button
              onClick={() => handleGenerateAIEmail("friendly")}
              className="border px-3 py-2 rounded-md text-sm"
            >
              Friendly
            </button>

            <button
              onClick={() => handleGenerateAIEmail("shorten")}
              className="border px-3 py-2 rounded-md text-sm"
            >
              Shorten
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailEditor;
