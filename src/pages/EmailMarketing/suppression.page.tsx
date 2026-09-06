import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { emailMarketingService } from "./services/email-marketing.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DataLoader from "@/components/Loader/data-loader";

const SuppressionPage = () => {
  const { accountId } = useAuthStore();
  const [docs, setDocs] = useState<any[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const response = await emailMarketingService.suppression(String(accountId));
      setDocs(response.data?.docs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountId) void load();
  }, [accountId]);

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      {loading && docs.length === 0 ? (
        <DataLoader className="h-[calc(100vh-220px)]" />
      ) : (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Unsubscribes & suppression</h1>
        <form
          className="flex gap-2"
          onSubmit={async (e) => {
            e.preventDefault();
            await emailMarketingService.addSuppression(String(accountId), { email });
            setEmail("");
            await load();
          }}
        >
          <Input placeholder="email@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit">Suppress</Button>
        </form>
        <table className="w-full text-sm border">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Email</th>
              <th className="p-2">Reason</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="p-2">{row.email}</td>
                <td className="p-2">{row.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </FeatureGate>
  );
};

export default SuppressionPage;
