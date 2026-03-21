import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Edit3, Plus, Sparkles } from "lucide-react"
import { NavLink, useParams } from "react-router-dom"
import { EmailService } from "@/services/email.service"
import { Method, TemplateCategory, type EmailTemplateData } from "@/types/email.type"
import { formatDate } from "@/utils/date-utils"
import { TbTemplate } from "react-icons/tb"
import { AIService } from "@/services/ai.service"

interface TemplateData{
    _id:string,
    accountId:string,
    category:string,
    generatedBy:string,
    html:string,
    name:string,
    status:string,
    subject:string,
    tags:string[],
    updatedAt:string,
    variables:string[],
    version:number
}
export default function Index() {
    const { accountId } = useParams();
    const emailService = new EmailService();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<Method|null>(null)
    const [templates,setTemplates]=useState<TemplateData[]|null>(null)
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
    const getTemplates = async () => {

        console.log("Mode", mode);
        try {
            const response = await emailService.getTemplates(String(accountId));
            console.log("Template created:", response);
            setTemplates(response?.data?.data)

        } catch (error) {
            console.log("Error creating template:", error);
        }
    }

    useEffect(()=>{
        getTemplates()
    },[])

const NAV_ITEMS = [
  { label: "Your Templates", icon: TbTemplate },
  { label: "Templates Library", icon: TbTemplate },

] as const;

type NavLabel = typeof NAV_ITEMS[number]["label"];

const [active, setActive] = useState<NavLabel>("Templates Library");
    return (
        <div className="space-y-4 pb-6">
             {/* <Header /> */}
            <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
                <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">

                    <div className="flex items-center gap-5">
                        {NAV_ITEMS.map((item) => {
                            const Icon=item.icon
                            return(
                            <button
                                key={item.label}
                                // to={item.path}
                                onClick={()=>setActive(item?.label)}
                                className={
                                    `text-sm font-medium  flex  items-center gap-1 transition-colors 
                                ${active===item.label
                                        ? "text-primary border-b-2 border-primary"
                                        : "text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-trasparent"}`
                                }
                            >
                                <Icon/>{item.label}
                            </button>
                        )})}
                    </div>


                    {/* <div className="ml-auto flex items-center gap-2">
                        <Button className=""><Plus size={20} color="#ffffff" /> Create New Campaign</Button>
                    </div> */}
                </div>
            </header>
            <div className="flex justify-between items-center px-6">
                {active==="Your Templates"?<h1 className="text-2xl font-semibold">Templates</h1>:<h1 className="text-2xl font-semibold">Templates Library</h1>}
                {active==="Your Templates"&&<Button onClick={() => setOpen(true)}><Plus /> Create Template</Button>}
            </div>

            {active==="Your Templates"&&
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6">
                {templates?.map((t:any) => (
                    <Card key={t._id} className="hover:shadow-md transition">
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">{t.name}</h3>
                                <Badge className="capitalize" variant={t.category === "System" ? "secondary" : "default"}>
                                    {t.category}
                                </Badge>
                            </div>
                            <div className="bg-gray-100 py-4 px-3 space-y-2 rounded">
                                <p className="text-muted-foreground text-sm">{t.subject}</p>
                                {/* <p className="text-muted-foreground text-sm">{t.html}</p> */}
                                <p className="text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: t.html }}/>
                            </div>
                            <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Last updated: {formatDate(t.updatedAt)}</p>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Edit</Button>
                                <Button variant="outline" size="sm">Use</Button>
                            </div>
                            </div>

                        </CardContent>
                    </Card>
                ))}
            </div>}
            {active==="Templates Library"&&<div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 ">
                {templates?.map((t:any) => (
                    <Card key={t._id} className="hover:shadow-md transition">
                        <CardContent className="space-y-2">
                            <div className="flex justify-between items-center">
                                <h3 className="font-medium">{t.name}</h3>
                                <Badge className="capitalize" variant={t.category === "System" ? "secondary" : "default"}>
                                    {t.category}
                                </Badge>
                            </div>
                            <div className="bg-gray-100 py-4 px-3 space-y-2 rounded">
                                <p className="text-muted-foreground text-sm">{t.subject}</p>
                                {/* <p className="text-muted-foreground text-sm">{t.html}</p> */}
                                <p className="text-muted-foreground text-sm" dangerouslySetInnerHTML={{ __html: t.html }}/>
                            </div>
                            <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">Last updated: {formatDate(t.updatedAt)}</p>
                            <div className="flex gap-2 bottom-0">
                                <Button variant="outline" size="sm">Use Sample</Button>
                                {/* <Button variant="outline" size="sm">Use</Button> */}
                            </div>
                            </div>

                        </CardContent>
                    </Card>
                ))}
        
            </div>}

            <CreateTemplate 
                open={open} 
                createTemplate={() => createTemplate()} 
                onClose={() => setOpen(false)} 
                mode={mode} 
                setMode={setMode} 
                setTemplateData={setTemplateData} 
                accountId={accountId}
            />
        </div>
    )
}

function CreateTemplate({ open, createTemplate, onClose, mode,setMode,setTemplateData, accountId}: any) {
    const aiService=new AIService();
    const [aiPrompt, setAiPrompt] = useState("");
    const handleManualChange = (field: string, value: any) => {
        setTemplateData((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleGenerate = async() => {
        console.log("AI Prompt",aiPrompt);
        try {
            const result=await aiService.createTemplateWithAI(String(accountId),aiPrompt);
            console.log("Result",result);
            setTemplateData(() => ({
                name:result.data.data.name,
                subject:result.data.data.subject,
                html:result.data.data.html,
                variables:result.data.data.variables,
                generatedBy: Method.AI,
                // aiPrompt: aiPrompt
            }));
            createTemplate()
        } catch (error:any) {
            console.log("Error creating template",error.message)
        }
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