import React, { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import Select from "react-select";
import {
  X,
  Maximize2,
  Minimize2,
  Paperclip,
  Clock3,
  ChevronDown,
} from "lucide-react";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";

interface Recipient {
  label: string;
  value: string;
}

interface EmailEditorProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmailEditor = ({ isOpen, onClose }: EmailEditorProps) => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [ccOpen, setCcOpen] = useState(false);
  const [bccOpen, setBccOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [isMaximize, setIsMaximize] = useState(false);

  const [to, setTo] = useState<Recipient[]>([
    {
      label: "Ms. Carissa Kidman (Sample)",
      value: "carissa@gmail.com",
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

  const handleSendEmail = async () => {
    try {
      setSending(true);

      const payload = {
        to: to.map((i) => i.value),
        subject,
        body,
      };

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        alert("Email Sent");

        setSubject("");
        setBody("");

        onClose();
      }
    } catch (error) {
      console.log(error);
      alert("Failed to send email");
    } finally {
      setSending(false);
    }
  };

  const [senderEmail, setSenderEmail] = useState("abhijeetsingh5631@gmail.com");

  if (!isOpen) return null;

  return (
    <div
      className={`absolute ${isMaximize ? "top-0" : "top-16"}  left-0 w-full z-50 bg-black/40 flex items-start justify-end`}
    >
      <div
        className={`w-full ${isMaximize ? "h-screen w-screen" : "h-[93vh] max-w-7xl"}  duration-100  bg-white shadow-2xl rounded-t-md overflow-hidden flex flex-col`}
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
              {senderEmail.charAt(0)}
            </div>{" "}
            Abhijeet Singh {`<${senderEmail}>`}
          </div>
          {/* Template */}
          <div className="flex justify-end px-4">
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
    </div>
  );
};

export default EmailEditor;
