import { COOKIES_STORAGE } from "@/constants";
import { Pagination } from "@/components/pagination";
import { usePagination } from "@/hooks/usePagination";
import { CookieUtils } from "@/utils/cookie-storage.utils";
import { Code, Copy, RefreshCw, Send, Trash2 } from "lucide-react";
import { ToastMessageService } from "@/services";
import { alertManager } from "@/stores/alert.store";
import type { ApiError } from "@/types";
import { useEffect, useState } from "react";
import { webhookService } from "./services/webhook.service";
import { timeAgo } from "@/utils/date.utils";
import type { TokenData } from "./types/webhook.type";
import TokenPopup from "./components/TokenPopup";
import DataLoader from "@/components/Loader/data-loader";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Loader";

const PAGE_SIZE = 20;

export default function Webhook() {
  const accountId = CookieUtils.getItem(COOKIES_STORAGE.accountId);

  const webhookUrl = `${import.meta.env.VITE_API_URL}/api/webhook/${accountId}/lead`;
  // const copyWebhookUrl = `${import.meta.env.VITE_API_URL}/api/webhook/<app_secret>/lead`;

  const [loading, setLoading] = useState(false);
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [selectedId, setSelectedId] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState<string>("warning");
  const toast = new ToastMessageService();
  const { currentPage, totalPages, goToPage } = usePagination({
    totalItems: totalDocs,
    itemsPerPage: PAGE_SIZE,
  });

  console.log(currentPage);

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

  const [customFields] = useState([
    { key: "service", value: "Looking for homestay" },
  ]);

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

  const sampleToken = token || "<YOUR_WEBHOOK_TOKEN>";

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

  const getToken = async (page = currentPage) => {
    try {
      setLoading(true);
      const response = await webhookService.getToken(String(accountId), {
        page,
        limit: PAGE_SIZE,
        
      });
      const docs = (response?.data?.docs || []) as TokenData[];
      setTokens(docs);
      setTotalDocs(response?.data?.pagination?.totalDocs || 0);
      setSelectedId((current) =>
        docs.some((item) => item.id === current) ? current : docs[0]?.id || "",
      );
    } catch (error) {
      console.error("Error", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken(currentPage);
  }, [currentPage]);

  const deleteToken = async (tokenId: string) => {
    try {
      const response = await webhookService.deleteToken(String(accountId), tokenId);
      if (response.status === 200) {
        toast.apiSuccess(response.message || "Webhook token deleted");
      }
      if (tokens.length === 1 && currentPage > 1) {
        goToPage(currentPage - 1);
      } else {
        await getToken(currentPage);
      }
    } catch (error) {
      const err = error as ApiError;
      toast.apiError(err.message || "Failed to delete webhook token");
    }
  };

  const handleDelete = (item: TokenData) => {
    alertManager.show({
      type: "warning",
      title: "Delete token",
      message: `Are you sure you want to delete "${item.name}"? It will stop working immediately.`,
      onConfirm: () => {
        deleteToken(item.id);
      },
    });
  };

  const payloadString = JSON.stringify(generatePayload(), null, 2);

  if (loading && tokens.length === 0) {
    return <DataLoader />;
  }

  return (
    <div className="py-10 h-[calc(100vh-114px)] overflow-y-scroll hide-scrollbar bg-gray-50">
      <div className="mx-24 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-medium text-gray-800">
              Incoming Webhook
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              This webhook allows you to send lead data from your website, CRM,
              or any external system directly into the dashboard in real-time.
              <br />
              Whenever a user submits a form, you simply send a POST request
              with JSON payload to the webhook URL.
            </p>
          </div>
          <div className="flex flex-col w-fit gap-2">
            <Button
              onClick={() => {
                setPopupType("warning");
                setPopupOpen(true);
              }}
              className="actions-btn px-4! py-2! rounded-xl!"
            >
              <RefreshCw size={16} />
              Generate token
            </Button>
          </div>
        </div>

        <div className="border rounded-2xl! overflow- bg-white">
          <table className="w-full text-sm ">
            <thead className="text-muted-foreground border-b">
              <tr className="text-primary">
                <th className="p-3 text-left font-medium">Name</th>
                <th className="p-3 text-left font-medium">Description</th>
                <th className="p-3 text-left font-medium">Is Active</th>
                <th className="p-3 text-left font-medium">Token Prefix</th>
                <th className="p-3 text-left font-medium">Last Used</th>
                <th className="p-3 text-left font-medium">Age</th>
                <th className="p-3 text-right font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {tokens.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-sm text-gray-400">
                    No webhook tokens yet. Generate one to start receiving leads.
                  </td>
                </tr>
              ) : (
                tokens.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedId(item.id)}
                    className={`cursor-pointer capitalize ${
                      selectedId === item.id ? "bg-primary/5" : "even:bg-muted"
                    }`}
                  >
                    <td className="p-3 font-medium capitalize">{item.name}</td>
                    <td className="p-3 font-medium capitalize whitespace-nowrap">
                      {item.description || "No description provided"}
                    </td>
                    <td className="p-3">
                      {item.isActive ? "Active" : "Inactive"}
                    </td>
                    <td className="p-3 lowercase">{item.tokenPrefix}</td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {item.lastUsedAt ? timeAgo(String(item.lastUsedAt)) : "Never"}
                    </td>
                    <td className="p-3 text-muted-foreground whitespace-nowrap">
                      {timeAgo(String(item.createdAt))}
                    </td>
                    <td className="p-3 text-right">
                      <Button
                        type="button"
                        title="Delete token"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(item);
                        }}
                        className="bg-transparent! text-red-500! hover:text-red-600!"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="px-3 pb-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          </div>
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
                className={`px-3 py-1 rounded-xl text-sm ${
                  devTab === tab ? "bg-primary text-white" : "bg-gray-100"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Code Blocks */}
          <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[13px] leading-6 text-slate-200">
            {devTab === "fetch" &&
              `// Example: Send lead using fetch
fetch("${webhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${sampleToken}"
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
const WEBHOOK_TOKEN = "${sampleToken}";

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
      Authorization: "Bearer ${sampleToken}"
    }
  }
);`}

            {devTab === "curl" &&
              `curl -X POST "${webhookUrl}" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer ${sampleToken}" \\
-d '${payloadString}'`}
          </pre>
        </div>

        {/* Action */}
        <div className="flex items-end justify-between gap-5 px-6">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="text-md font-semibold">Enter copied api token</h2>
            <Input
              setToken={setToken}
              value={token}
              type="text"
              placeholder="API Token"
            />
          </div>

          <div className="">
            <Button
              disabled={!token}
              onClick={sendTestLead}
              className="py-3.5! rounded-xl! disabled:cursor-not-allowed!"
            >
              <Send size={18} /> Send Test Lead {loading && <Loader />}
            </Button>
          </div>
        </div>

        <section className="bg-white p-6">
          <h2 className="text-xl font-semibold mb-3">Response</h2>
          <pre className="overflow-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-[13px] leading-6 text-slate-200">
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
        onCreated={() => {
          if (currentPage === 1) getToken(1);
          else goToPage(1);
        }}
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
