
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import CreateCampaign from "@/components/email/Create"
import { Plus } from "lucide-react"

const campaigns = [
    {
        id: "1",
        name: "Hotel Promo Jan",
        status: "sent" as const,
        recipients: 420,
        cost: "210",
        date: "18 Jan 2026",
    },
    {
        id: "1",
        name: "Hotel Promo Jan",
        status: "inprogress" as const,
        recipients: 420,
        cost: "210",
        date: "18 Jan 2026",
    },
    {
        id: "1",
        name: "Hotel Promo Jan",
        status: "draft" as const,
        recipients: 420,
        cost: "210",
        date: "18 Jan 2026",
    },
    {
        id: "1",
        name: "Hotel Promo Jan",
        status: "scheduled" as const,
        recipients: 420,
        cost: "210",
        date: "18 Jan 2026",
    },
]

const Campaign = () => {
    const [open, setOpen] = useState(false)

    const statusColor = {
        sent: "bg-green-100 text-green-700",
        inprogress: "bg-yellow-100 text-yellow-600",
        draft: "bg-red-100 text-red-700",
        scheduled: "bg-blue-100 text-blue-700",
    } as const;
    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Campaigns</h1>
                <Button onClick={() => setOpen(true)}><Plus />Create Campaign</Button>
            </div>

            <div className="grid lg:grid-cols-4 gap-5">
                {campaigns.map((c) => (
                    <Card key={c.id} className="flex  py-0 border-0 w-full p-0">
                        <CardContent className="flex flex-col gap-4 justify-between border p-2">
                            <div className="flex item-start justify-between">
                                <div>
                                    <h3 className="font-medium">{c.name}</h3>
                                    <p className="text-xs text-muted-foreground">
                                        {c.recipients} recipients • {c.date}
                                    </p>
                                </div>
                                <div>
                                    <Badge className={`px-3 capitalize ${statusColor[c.status]}`}>{c.status}</Badge>

                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <span className="text-md">₹{c.cost}</span>
                                <Button variant="outline" size="sm">
                                    View
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>


            <CreateCampaign open={open} onClose={() => setOpen(false)} />
        </div >
    )
}

export default Campaign
