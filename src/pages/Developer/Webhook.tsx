import { useState } from "react";
import { Copy, Send, Plus, Trash, Code } from "lucide-react";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { COOKIES_STORAGE } from "@/constants";

export default function Webhook() {
    const accountId = CookieUtils.getItem(COOKIES_STORAGE.accountId);

    const webhookUrl = `http://localhost:3000/api/account/${accountId}/lead/webhook/create`;
    const copyWebhookUrl = `http://localhost:3000/api/account/<app_secret>/lead/webhook/create`;

    const [formData, setFormData] = useState({
        name: "John Doe",
        email: "john@example.com",
        phone: "+911234567890",
        message: "Interested in your service",
    });

    const [customFields, setCustomFields] = useState([
        { key: "city", value: "Mumbai" },
    ]);

    const [devTab, setDevTab] = useState("fetch");

    const generatePayload = () => {
        const custom = {};
        customFields.forEach((f: any) => {
            if (f.key) custom[f.key] = f.value;
        });

        return {
            ...formData,
            customFields: custom,
        };
    };

    const sendTestLead = async () => {
        try {
            const res = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(generatePayload()),
            });

            if (res.ok) {
                alert("✅ Test lead sent");
            } else {
                alert("❌ Failed");
            }
        } catch (err) {
            console.error(err);
            alert("Error sending lead");
        }
    };

    const payloadString = JSON.stringify(generatePayload(), null, 2);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-xl font-medium text-gray-800">
                        Incoming Webhook
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        This webhook allows you to send lead data from your website, CRM, or any external system directly into the dashboard in real-time.<br />
                        Whenever a user submits a form, you simply send a POST request with JSON payload to the webhook URL.
                    </p>
                </div>

                {/* Webhook URL */}
                <div className="bg-white p-6">
                    <div className="flex gap-2 mb-4 w-full">
                        <div className="flex flex-col w-[70%] gap-2 ">
                            <h2 className="text-md font-semibold">Webhook URL</h2>
                            <Input value={copyWebhookUrl} type="text" />
                        </div>
                        <div className="flex flex-col w-[30%] gap-2">
                            <h2 className="text-md font-semibold">App Secret</h2>
                            <Input value={accountId as string} type="password" />

                        </div>
                    </div>
                </div>

                {/* Developer Guide */}
                <div className="bg-white p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Code size={18} />
                        <h2 className="text-md font-semibold">Developer Integration</h2>
                    </div>

                    <p className="text-gray-600 text-sm">
                        Send a <b>POST</b> request to this webhook URL with JSON data whenever a user submits your form.
                    </p>

                    {/* Dev Tabs */}
                    <div className="flex gap-3">
                        {["fetch", "html", "node", "curl"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setDevTab(tab)}
                                className={`px-3 py-1 rounded-lg text-sm ${devTab === tab ? "bg-primary text-white" : "bg-gray-100"
                                    }`}
                            >
                                {tab.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Code Blocks */}
                    <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-auto">
                        {devTab === "fetch" && `// Example: Send lead using fetch
fetch("${webhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(${payloadString})
});`}

                        {devTab === "html" && `<!-- Example: HTML Form -->
<form onsubmit="sendLead(event)">
  <input name="name" placeholder="Name" />
  <input name="email" placeholder="Email" />
  <button type="submit">Submit</button>
</form>

<script>
function sendLead(e) {
  e.preventDefault();
  fetch("${webhookUrl}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: e.target.name.value,
      email: e.target.email.value
    })
  });
}
</script>`}

                        {devTab === "node" && `// Example: Node.js (Axios)
import axios from "axios";

await axios.post("${webhookUrl}", ${payloadString});`}

                        {devTab === "curl" && `curl -X POST "${webhookUrl}" \\
-H "Content-Type: application/json" \\
-d '${payloadString}'`}
                    </pre>
                </div>

                {/* Tabs */}
                {/* <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab("builder")}
                        className={`px-4 py-2 rounded-lg ${activeTab === "builder" ? "bg-primary text-white" : "bg-white"
                            }`}
                    >
                        Form Builder
                    </button>
                    <button
                        onClick={() => setActiveTab("json")}
                        className={`px-4 py-2 rounded-lg ${activeTab === "json" ? "bg-primary text-white" : "bg-white"
                            }`}
                    >
                        JSON Preview
                    </button>
                </div> */}

                {/* {activeTab === "builder" && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow space-y-4">
                            <h3 className="font-semibold">Lead Details</h3>

                            {Object.keys(formData).map((key) => (
                                <input
                                    key={key}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    placeholder={key}
                                    className="w-full border rounded-lg px-3 py-2"
                                />
                            ))}

                            <h3 className="font-semibold mt-4">Custom Fields</h3>

                            {customFields.map((field, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        placeholder="key"
                                        value={field.key}
                                        onChange={(e) =>
                                            updateField(index, "key", e.target.value)
                                        }
                                        className="w-1/2 border rounded-lg px-3 py-2"
                                    />
                                    <input
                                        placeholder="value"
                                        value={field.value}
                                        onChange={(e) =>
                                            updateField(index, "value", e.target.value)
                                        }
                                        className="w-1/2 border rounded-lg px-3 py-2"
                                    />
                                    <button onClick={() => removeField(index)}>
                                        <Trash size={16} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={addField}
                                className="flex items-center gap-2 text-primary"
                            >
                                <Plus size={16} /> Add Field
                            </button>
                        </div>

                        <div className="bg-black text-green-400 p-6 rounded-2xl text-sm font-mono overflow-auto">
                            {payloadString}
                        </div>
                    </div>
                )}

                {activeTab === "json" && (
                    <div className="bg-black text-green-400 p-6 rounded-2xl text-sm font-mono">
                        {payloadString}
                    </div>
                )} */}

                {/* Action */}
                <div className="flex justify-">
                    <button
                        onClick={sendTestLead}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl"
                    >
                        <Send size={18} /> Send Test Lead
                    </button>
                </div>

                <section className="bg-white p-6">
                    <h2 className="text-xl font-semibold mb-3">Response</h2>
                    <pre className="bg-black text-green-400 p-4 rounded-lg text-sm">
                        {`{
  "success": true,
  "message": "Lead created successfully"
}`}
                    </pre>
                </section>
            </div>
        </div>
    );
}


const Input = ({ value, type = "text" }: any) => {

    const copyToClipboard = (value: string) => {
        navigator.clipboard.writeText(value);

    };
    return (
        <div className="flex relative">
            <input
                value={value}
                type={type ? type : "password"}
                readOnly
                className="w-full border rounded-lg px-4 py-2 bg-gray-100 text-sm"
            />
            <button
                onClick={() => copyToClipboard(value)}
                className="px-4 flex items-center h-full cursor-pointer absolute right-0 text-white rounded-lg"
            >
                <Copy size={16} className="text-gray-700" />
            </button>
        </div>
    )
}