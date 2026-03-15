import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Edit3, Plus, Sparkles } from "lucide-react"
import { useParams } from "react-router-dom"
import { EmailService } from "@/services/email.service"
import { Method, TemplateCategory, type EmailTemplateData } from "@/types/email.type"

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
    const { accountId } = useParams();
    const emailService = new EmailService();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<Method|null>(null)
    const [templateData,
        setTemplateData
    ] = useState<EmailTemplateData>({
        name: "New Template",
        subject: "Welcome to our service",
        html: "<h1>Hello {{name}}</h1>",
        variables:["name"],
        category:TemplateCategory.NOTIFICATION,
    });

    const createTemplate = async () => {

        console.log("Mode", mode);
        const payload={...templateData,generatedBy:mode??undefined}
        try {
            const response = await emailService.createTemplate(String(accountId), payload);
            console.log("Template created:", response);
        } catch (error) {
            console.log("Error creating template:", error);
        }
    }

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

            <CreateTemplate open={open} createTemplate={() => createTemplate()} onClose={() => setOpen(false)} mode={mode} setMode={setMode} setTemplateData={setTemplateData} />
        </div>
    )
}

function CreateTemplate({ open, createTemplate, onClose, mode,setMode,setTemplateData }: any) {
     const [aiPrompt, setAiPrompt] = useState("");
    const handleManualChange = (field: string, value: any) => {
        setTemplateData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGenerate = () => {
        console.log("AI Prompt",aiPrompt);
        // setTemplateData((prev: any) => ({
        //     ...prev,
        //     generatedBy: Method.AI,
        //     aiPrompt: aiPrompt
        // }));

        // createTemplate();
    };

    const handleSaveManual = () => {
        setTemplateData((prev: any) => ({
            ...prev,
            generatedBy: Method.USER
        }));

        createTemplate();
    };
    return (
        <Dialog open={open} onOpenChange={() => { setMode(null); onClose() }}>
            <DialogContent className="max-w-xl rounded-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Create Email Template
                    </DialogTitle>
                </DialogHeader>

                {!mode && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        <Card
                            onClick={() => setMode(Method.AI)}
                            className="cursor-pointer hover:shadow-lg transition border-dashed"
                        >
                            <CardContent className="p-6 text-center space-y-3">
                                <Sparkles className="mx-auto h-8 w-8 text-primary" />
                                <h3 className="font-semibold text-lg">Generate with AI</h3>
                                <p className="text-sm text-muted-foreground">
                                    Let AI create a high-converting email for you
                                </p>
                            </CardContent>
                        </Card>

                        <Card
                            onClick={() => setMode(Method.USER)}
                            className="cursor-pointer hover:shadow-lg transition"
                        >
                            <CardContent className="p-6 text-center space-y-3">
                                <Edit3 className="mx-auto h-8 w-8 text-primary" />
                                <h3 className="font-semibold text-lg">Create Manually</h3>
                                <p className="text-sm text-muted-foreground">
                                    Start from scratch or use your own design
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {mode === Method.AI && (
                    <div className="mt-6 space-y-4">
                        <h3 className="font-medium">Describe your email</h3>
                        <textarea
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Write a follow-up email for hotel website leads..."
                            className="w-full h-32 rounded-md border p-3 text-sm"
                        />
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setMode(null)}>
                                Back
                            </Button>
                            <Button  onClick={handleGenerate}>
                                Generate Template
                            </Button>
                        </div>
                    </div>
                )}

                {mode === Method.USER && (
                    <div className="mt-6 space-y-4">
                        <h3 className="font-medium">Manual Template</h3>
                        <input
                            placeholder="Template name"
                            className="w-full rounded-md border p-2 text-sm"
                            onChange={(e) => handleManualChange("name", e.target.value)}
                        />

                        <input
                            placeholder="Email subject"
                            className="w-full rounded-md border p-2 text-sm"
                            onChange={(e) => handleManualChange("subject", e.target.value)}
                        />

                        <textarea
                            placeholder="Write your email content here"
                            className="w-full h-32 rounded-md border p-3 text-sm"
                            onChange={(e) => handleManualChange("html", e.target.value)}
                        />

                        {/* Category Dropdown */}
                        <select
                            className="w-full rounded-md border p-2 text-sm"
                            onChange={(e) => handleManualChange("category", e.target.value)}
                        >
                            <option value="">Select Category</option>
                            {Object.values(TemplateCategory).map((cat) => (
                                <option key={cat} value={cat} className="capitalize">
                                    {cat}
                                </option>
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setMode(null)}>
                                Back
                            </Button>
                            <Button onClick={handleSaveManual}>
                                Save Template
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>


    )
}