import { useState } from "react";
import Media from "./components/Media";
import Email from "./components/Email";
import Data from "./components/Data";

export default function Storage() {
    const [tab, setTab] = useState("data");

    return (
        <div className="p-6 bg-white min-h-screen text-gray-900!">
            {/* Tabs */}
            <div className="flex gap-6 border-b mb-6 text-sm font-medium">
                <button onClick={() => setTab("data")} className={`pb-2 ${tab === "data" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-800"}`}>
                    Data Storage
                </button>
                <button onClick={() => setTab("email")} className={`pb-2 ${tab === "email" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-800"}`}>
                    Email Storage
                </button>
                <button onClick={() => setTab("media")} className={`pb-2 ${tab === "media" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-800"}`}>
                    Media & File Storage
                </button>
            </div>

            {/* ================= DATA STORAGE ================= */}
            {tab === "data" && (
                <Data />
            )}

            {/* ================= EMAIL STORAGE ================= */}
            {tab === "email" && (
                <Email />
            )}
            {/* ================= Media & File STORAGE ================= */}
            {tab === "media" && (
                <Media />
            )}
        </div>
    );
}
