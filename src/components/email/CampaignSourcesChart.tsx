import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const campaigns = [
    { name: "Welcome Series", sent: 4250, openRate: 58.2, trend: 12, color: "hsl(217, 91%, 60%)" },
    { name: "Weekly Newsletter", sent: 8420, openRate: 42.1, trend: 5, color: "hsl(142, 71%, 45%)" },
    { name: "Product Launch", sent: 3180, openRate: 51.8, trend: -3, color: "hsl(38, 92%, 50%)" },
    { name: "Re-engagement", sent: 1890, openRate: 28.4, trend: 8, color: "hsl(280, 65%, 60%)" },
];

export const CampaignSourcesChart = () => {
    const maxSent = Math.max(...campaigns.map(c => c.sent));

    return (
        <Card className="border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Campaign Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Ranked by volume with open rates</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {campaigns.map((campaign) => (
                    <div key={campaign.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: campaign.color }} />
                                <span className="text-sm text-foreground">{campaign.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">{campaign.sent.toLocaleString()} sent</span>
                                <span className="text-sm font-medium">{campaign.openRate}%</span>
                                <div className={`flex items-center gap-1 text-sm ${campaign.trend >= 0 ? 'text-success' : 'text-destructive'}`}>
                                    {campaign.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    <span>{Math.abs(campaign.trend)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all"
                                style={{
                                    width: `${(campaign.sent / maxSent) * 100}%`,
                                    backgroundColor: campaign.color
                                }}
                            />
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
};
