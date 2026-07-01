import { COOKIES_STORAGE } from "@/constants";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { Code, Copy, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { webhookService } from "./services/webhook.service";
import { timeAgo } from "@/utils/date.utils";
import type { TokenData } from "./types/webhook.type";
import TokenPopup from "./components/TokenPopup";
import DataLoader from "@/components/Loader/data-loader";

export default function Webhook() {
  const accountId = CookieUtils.getItem(COOKIES_STORAGE.accountId);

  const webhookUrl = `${import.meta.env.VITE_API_URL}/api/webhook/${accountId}/lead`;
  // const copyWebhookUrl = `${import.meta.env.VITE_API_URL}/api/webhook/<app_secret>/lead`;

  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | {}>({});
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<string>("warning");

  const [formData] = useState({
    name: "Abhijeet",
    email: "john@example.com",
    phone: "+911234567890",
    message: "Interested in your service",
    mobile: "",
    description: "",
    company: "",
    title: "",
    website: "",
  });

  const [customFields] = useState([{ key: "service", value: "Looking for homestay" }]);

  const [devTab, setDevTab] = useState("fetch");
  const [token, setToken] = useState<string>("");

  const generatePayload = () => {
    const custom: Record<string, string> = {};
    customFields.forEach((f: { key: string; value: string }) => {
      if (f.key) custom[f.key] = f.value;
    });

    return {
      ...formData,
      customFields: custom,
    };
  };

  const webhookToken = "Copied token from the table above";

  const sendTestLead = async () => {
    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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


  const getToken = async () => {
    try {
      setLoading(true);
      const response = await webhookService.getToken(String(accountId));

      // console.log(response?.data?.doc)
      setTokenData(response?.data?.doc)
    } catch (error) {
      console.error("Error", error)
    }
    finally {
      setLoading(false);
    }
  }

  const generateToken = async () => {
    try {
      setLoading(true);
      const response = await webhookService.generateToken(String(accountId));
      // console.log(response)
      // console.log(response?.data?.doc)
      setPopupOpen(true);
      setPopupType("success")
      setToken(response?.data?.doc.token)
      setTokenData(response?.data?.doc.savedToken)
    } catch (error) {
      console.error("Error", error)
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getToken()
  }, [])

  // console.log(tokenData)
  const payloadString = JSON.stringify(generatePayload(), null, 2);

  if (loading) {
    return <DataLoader />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-800">
              Incoming Webhook
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              This webhook allows you to send lead data from your website, CRM, or
              any external system directly into the dashboard in real-time.
              <br />
              Whenever a user submits a form, you simply send a POST request with
              JSON payload to the webhook URL.
            </p>
          </div>
          <div className="flex flex-col w-fit gap-2">
            {tokenData ? <button onClick={() => setPopupOpen(true)} className="text-md font-medium text-primary bg-primary/20 px-5 rounded-xl  py-1.75">Regenerate Token</button>
              : <button onClick={() => generateToken()} className="text-md font-medium text-primary bg-primary/20 px-5 rounded-xl  py-1.75">Generate Token</button>}
          </div>
        </div>

        <div className="border rounded-xl! overflow- bg-white">
          <table className="w-full text-sm ">
            <thead className="text-muted-foreground border-b">
              <tr className="text-primary">
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Description</th>
                <th className="p-3 text-left font-medium">Is Active</th>
                <th className="p-3 text-left font-medium">Token Prefix</th>
                <th className="p-3 text-left font-medium">Last Used</th>
                <th className="p-3 text-left font-medium">Age</th>
              </tr>
            </thead>

            <tbody>
              {tokenData && <tr className="even:bg-muted capitalize">

                <td className="p-3 font-medium capitalize">{(tokenData as TokenData)?.name}</td>
                <td className="p-3 font-medium capitalize whitespace-nowrap">{(tokenData as TokenData)?.description || "No description provided"}</td>
                <td className="p-3 ">{(tokenData as TokenData)?.isActive === true ? <span>Active</span> : <span>Inactive</span>}</td>

                <td className="p-3 lowercase">{(tokenData as TokenData)?.tokenPrefix}</td>
                <td className="p-3 text-muted-foreground whitespace-nowrap">
                  {timeAgo(String((tokenData as TokenData)?.lastUsedAt))}
                </td>
                <td className="p-3 text-muted-foreground whitespace-nowrap">
                  {timeAgo(String((tokenData as TokenData)?.createdAt))}
                </td>

              </tr>}
            </tbody>
          </table>
        </div>
        {/* Webhook URL */}
        {/* <div className="bg-white p-6">
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
          <div className="flex items-end gap-2 mb-4 w-full">
            <div className="flex flex-col w-[70%] gap-2">
              <h2 className="text-md font-semibold">API Token</h2>
              <Input value={accountId as string} type="" />
            </div>

          </div>

        </div> */}

        {/* Developer Guide */}
        <div className="bg-white p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Code size={18} />
            <h2 className="text-md font-semibold">Developer Integration</h2>
          </div>

          <p className="text-gray-600 text-sm">
            Send a <b>POST</b> request to this webhook URL with JSON data
            whenever a user submits your form.
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
            {devTab === "fetch" &&
              `// Example: Send lead using fetch
fetch("${webhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${(tokenData as TokenData)?.tokenPrefix || webhookToken}"
  },
  body: JSON.stringify(${payloadString})
});`}

            {devTab === "html" &&
              `<!-- Example: HTML Form -->
<form onsubmit="sendLead(event)">
  <input name="name" placeholder="Name" />
  <input name="email" placeholder="Email" />
  <button type="submit">Submit</button>
</form>

<script>
const WEBHOOK_TOKEN = "${(tokenData as TokenData)?.tokenPrefix || webhookToken}";

function sendLead(e) {
  e.preventDefault();

  fetch("${webhookUrl}", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + WEBHOOK_TOKEN
    },
    body: JSON.stringify({
      name: e.target.name.value,
      email: e.target.email.value
    })
  });
}
</script>`}

            {devTab === "node" &&
              `// Example: Node.js (Axios)
import axios from "axios";

await axios.post(
  "${webhookUrl}",
  ${payloadString},
  {
    headers: {
      Authorization: "Bearer ${(tokenData as TokenData)?.tokenPrefix || webhookToken}"
    }
  }
);`}

            {devTab === "curl" &&
              `curl -X POST "${webhookUrl}" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer ${(tokenData as TokenData)?.tokenPrefix || webhookToken}" \\
-d '${payloadString}'`}
          </pre>
        </div>


        {/* Action */}
        <div className="flex items-end justify-between gap-5 px-6">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-md font-semibold">Enter copied api token</h2>
            <Input setToken={setToken} value={token} type="text" placeholder="API Token" />
          </div>
          <div className="">

            <button
              onClick={sendTestLead}
              className="flex items-center gap-2 whitespace-nowrap px-6 py-3 bg-primary text-white rounded-xl"
            >
              <Send size={18} /> Send Test Lead
            </button>
          </div>

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
      <TokenPopup
        token={token}
        setToken={setToken}
        popupType={popupType}
        setPopupType={setPopupType}
        accountId={String(accountId)}
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
      />

    </div>
  );
}

const Input = ({ setToken, value, type = "text" }: any) => {
  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };
  return (
    <div className="flex relative">
      <input
        value={value}
        type={type ? type : "password"}
        // readOnly
        onChange={(e) => setToken(e.target.value)}
        placeholder="Enter copied token here"
        className="w-full border rounded-lg px-4 py-3.25 bg-gray-100 text-sm"
      />
      <button
        onClick={() => copyToClipboard(value)}
        className="px-4 flex items-center h-full cursor-pointer absolute right-0 text-white rounded-lg"
      >
        <Copy size={16} className="text-gray-700" />
      </button>
    </div>
  );
};
