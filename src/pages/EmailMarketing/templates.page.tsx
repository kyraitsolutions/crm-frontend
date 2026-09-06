import { FeatureGate } from "@/components/subscription/FeatureGate";
import { FEATURE } from "@/constants/subscription.constant";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { useEmailMarketingStore } from "./store/email-marketing.store";
import { emailMarketingService } from "./services/email-marketing.service";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ToastMessageService } from "@/services";
import DataLoader from "@/components/Loader/data-loader";
import { CreateTemplateDialog } from "./components/CreateTemplateDialog";
import { Plus } from "lucide-react";
import type { EmailTemplate } from "./types";

const TemplatesPage = () => {
  const { accountId } = useAuthStore();
  const { templates, fetchTemplates, loading } = useEmailMarketingStore();
  const toast = new ToastMessageService();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewing, setViewing] = useState<EmailTemplate | null>(null);
  const id = String(accountId || "");

  useEffect(() => {
    if (accountId) void fetchTemplates(String(accountId));
  }, [accountId, fetchTemplates]);

  return (
    <FeatureGate feature={FEATURE.EMAIL_MARKETING}>
      {loading && templates.length === 0 ? (
        <DataLoader className="h-[calc(100vh-220px)]" />
      ) : (
        <div className="space-y-4 pb-6">
          <div className="flex justify-between items-center px-6 pt-6">
            <div>
              <h1 className="text-2xl font-semibold">Templates</h1>
              <p className="text-sm text-muted-foreground">
                Create a template before sending any campaign.
              </p>
            </div>
            <Button onClick={() => setCreateOpen(true)}>
              <Plus /> Create Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
            {templates.map((template) => {
              const templateId = String(template.id || template._id);
              return (
                <Card key={templateId} className="hover:shadow-md transition">
                  <CardContent className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">{template.name}</h3>
                      <Badge className="capitalize">{template.category || "general"}</Badge>
                    </div>
                    <div className="bg-gray-100 py-4 px-3 space-y-2 rounded min-h-24">
                      <p className="text-muted-foreground text-sm">{template.subject}</p>
                      <div
                        className="text-muted-foreground text-sm line-clamp-4 overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: template.html }}
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {template.status || "active"}
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setViewing(template)}>
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            await emailMarketingService.duplicateTemplate(id, templateId);
                            await fetchTemplates(id);
                          }}
                        >
                          Duplicate
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={async () => {
                            await emailMarketingService.deleteTemplate(id, templateId);
                            toast.success("Template deleted");
                            await fetchTemplates(id);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {!loading && templates.length === 0 && (
            <p className="px-6 text-sm text-muted-foreground">
              No templates yet. Create one to start sending campaigns.
            </p>
          )}
        </div>
      )}

      <CreateTemplateDialog
        open={createOpen}
        accountId={id}
        onClose={() => setCreateOpen(false)}
        onCreated={() => void fetchTemplates(id)}
      />

      <Dialog open={Boolean(viewing)} onOpenChange={() => setViewing(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewing?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">{viewing?.subject}</p>
          <div className="border rounded bg-white max-h-[70vh] overflow-auto p-4">
            <div dangerouslySetInnerHTML={{ __html: viewing?.html || "" }} />
          </div>
        </DialogContent>
      </Dialog>
    </FeatureGate>
  );
};

export default TemplatesPage;
