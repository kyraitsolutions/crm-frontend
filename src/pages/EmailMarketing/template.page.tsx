import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Plus } from "lucide-react"

const templates = [
    {
        id: "1",
        name: "Welcome Email",
        type: "System",
        updatedAt: "15 Jan 2026",
    },
    {
        id: "2",
        name: "Hotel Promotion",
        type: "Marketing",
        updatedAt: "18 Jan 2026",
    },
    {
        id: "3",
        name: "Hotel Promotion",
        type: "Promotion",
        updatedAt: "18 Jan 2026",
    },
    {
        id: "4",
        name: "Hotel Promotion",
        type: "Marketing",
        updatedAt: "18 Jan 2026",
    },
]

export default function Templates() {
    const [open, setOpen] = useState(false)

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Email Templates</h1>
                <Button onClick={() => setOpen(true)}><Plus /> Create Template</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {templates.map((t) => (
                    <Card key={t.id} className="hover:shadow-md transition">
                        <CardContent className="">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">{t.name}</h3>
                                <Badge variant={t.type === "System" ? "secondary" : "default"}>
                                    {t.type}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">Last updated: {t.updatedAt}</p>
                            <div className="flex gap-2 pt-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm">Use</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <CreateTemplate open={open} onClose={() => setOpen(false)} />
        </div>
    )
}

function CreateTemplate({ open, onClose }: any) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Email Template</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <Input placeholder="Template Name" />
                    <Input placeholder="Email Subject" />
                    <Textarea rows={8} placeholder="<h1>Hello {{name}}</h1>" />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button>Save Template</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}