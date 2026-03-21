
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { ArrowLeft, ArrowRight, CalendarIcon, Check, Clock, DollarSign, Eye, FileText, Mail, Plus, Send, Users } from "lucide-react"
import type { CampaignRecord } from "@/types/broadcast.type"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ── Sample data ──
const sampleCampaigns: CampaignRecord[] = [
    {
        id: "1",
        name: "Spring Product Launch",
        subject: "You're invited — exclusive early access",
        status: "sent",
        contacts: 4_312,
        cost: "$12.94",
        date: "Mar 14, 2026",
        openRate: "38.2%",
        clickRate: "6.7%",
    },
    {
        id: "2",
        name: "Weekly Newsletter #47",
        subject: "This week in CRM: top features you missed",
        status: "sent",
        contacts: 8_923,
        cost: "$26.77",
        date: "Mar 11, 2026",
        openRate: "42.1%",
        clickRate: "8.3%",
    },
    {
        id: "3",
        name: "VIP Customer Appreciation",
        subject: "A special thank you — 20% off inside",
        status: "scheduled",
        contacts: 687,
        cost: "$2.06",
        date: "Mar 25, 2026",
    },
    {
        id: "4",
        name: "Re-engagement Flow",
        subject: "We miss you — here's what's new",
        status: "scheduled",
        contacts: 3_241,
        cost: "$9.72",
        date: "Mar 28, 2026",
    },
    {
        id: "5",
        name: "Q2 Feature Announcement",
        subject: "Big updates coming your way",
        status: "draft",
        contacts: 0,
        cost: "$0.00",
        date: "—",
    },
];
const statusConfig: Record<CampaignRecord["status"], { label: string; className: string }> = {
    sent: { label: "Sent", className: "bg-primary/10 text-primary border-primary/20" },
    scheduled: { label: "Scheduled", className: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20" },
    draft: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
};

// ── Wizard constants ──
const steps = [
    { id: 1, label: "Compose", icon: FileText },
    { id: 2, label: "Audience", icon: Users },
    { id: 3, label: "Schedule", icon: Clock },
    { id: 4, label: "Review", icon: Eye },
];

const audienceSegments = [
    { id: "all", label: "All Contacts", count: 12_847 },
    { id: "active", label: "Active Customers", count: 4_312 },
    { id: "leads", label: "New Leads (Last 30 days)", count: 1_876 },
    { id: "inactive", label: "Inactive (90+ days)", count: 3_241 },
    { id: "vip", label: "VIP / High Value", count: 687 },
    { id: "newsletter", label: "Newsletter Subscribers", count: 8_923 },
];

const Campaign = () => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<"list" | "create">("list");
    const [campaigns, setCampaigns] = useState<CampaignRecord[]>(sampleCampaigns);

    // create campaign view
    // ── Create wizard state ──
    const [step, setStep] = useState(1);
    const [campaignName, setCampaignName] = useState("");
    const [subject, setSubject] = useState("");
    const [previewText, setPreviewText] = useState("");
    const [body, setBody] = useState("");
    const [senderName, setSenderName] = useState("CRMflow");
    const [senderEmail, setSenderEmail] = useState("campaigns@crmflow.io");
    const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
    const [scheduleType, setScheduleType] = useState<"now" | "later">("now");
    const [scheduleDate, setScheduleDate] = useState<Date | undefined>();
    const [scheduleTime, setScheduleTime] = useState("09:00");
    const [timezone, setTimezone] = useState("UTC");

    const statusColor = {
        sent: "bg-green-100 text-green-700",
        inprogress: "bg-yellow-100 text-yellow-600",
        draft: "bg-red-100 text-red-700",
        scheduled: "bg-blue-100 text-blue-700",
    } as const;

    const canNext = () => {
        if (step === 1) return campaignName.trim() && subject.trim() && body.trim();
        if (step === 2) return selectedSegments.length > 0;
        if (step === 3) return scheduleType === "now" || scheduleDate !== undefined;
        return true;
    };
    const resetForm = () => {
        setStep(1);
        setCampaignName("");
        setSubject("");
        setPreviewText("");
        setBody("");
        setSenderName("Kyra CRM");
        setSenderEmail("kyraitsolutions@gmail.com");
        setSelectedSegments([]);
        setScheduleType("now");
        setScheduleDate(undefined);
        setScheduleTime("09:00");
        setTimezone("UTC");
    };

    const totalContacts = audienceSegments
        .filter((s) => selectedSegments.includes(s.id))
        .reduce((sum, s) => sum + s.count, 0);
    const COST_PER_EMAIL = 10;
    const estimatedCost = (totalContacts * COST_PER_EMAIL).toFixed(2);
    const toggleSegment = (id: string) =>
        setSelectedSegments((prev) =>
            prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
        );

    const handleSend = () => {
        const newCampaign: CampaignRecord = {
            id: crypto.randomUUID(),
            name: campaignName,
            subject,
            status: scheduleType === "now" ? "sent" : "scheduled",
            contacts: totalContacts,
            cost: `$${estimatedCost}`,
            date:
                scheduleType === "later" && scheduleDate
                    ? format(scheduleDate, "MMM d, yyyy")
                    : format(new Date(), "MMM d, yyyy"),
            openRate: scheduleType === "now" ? "0%" : undefined,
            clickRate: scheduleType === "now" ? "0%" : undefined,
        };

        setCampaigns((prev) => [newCampaign, ...prev]);

        if (scheduleType === "later" && scheduleDate) {
            // toast.success(
            //     `Campaign "${campaignName}" scheduled for ${format(scheduleDate, "PPP")} at ${scheduleTime} ${timezone}`
            // );
        } else {
            // toast.success(`Campaign "${campaignName}" sent to ${totalContacts.toLocaleString()} contacts!`);
        }

        resetForm();
        setView("list");
    };

    const handleSaveDraft = () => {
        if (campaignName.trim()) {
            const draft: CampaignRecord = {
                id: crypto.randomUUID(),
                name: campaignName || "Untitled",
                subject: subject || "—",
                status: "draft",
                contacts: totalContacts,
                cost: `$${estimatedCost}`,
                date: "—",
            };
            setCampaigns((prev) => [draft, ...prev]);
        }
        // toast.info(`Draft "${campaignName || "Untitled"}" saved.`);
        resetForm();
        setView("list");
    };
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className=" animate-fade-up">
                    <h1 className="text-2xl font-bold text-foreground">
                        {view === "list" ? "Campaigns" : "Create Campaign"}
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        {view === "list"
                            ? "Manage all your email campaigns"
                            : "Build and send an email campaign to your audience"}
                    </p>
                </div>
                <div className="flex gap-2  animate-fade-up" style={{ animationDelay: "80ms" }}>
                    {view === "list" ? (
                        <Button size="sm" onClick={() => { resetForm(); setView("create"); }} className="gap-1.5">
                            <Plus className="h-4 w-4" />
                            New Campaign
                        </Button>
                    ) : (
                        <>
                            <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                                Save Draft
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => { resetForm(); setView("list"); }}
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {view === "list" && <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[280px]">Campaign</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Contacts</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Open Rate</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Click Rate</TableHead>
                        <TableHead className="text-right">Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sampleCampaigns.map((c) => {
                        const sc = statusConfig[c.status];
                        return (
                            <TableRow key={c.id} className="group">
                                <TableCell>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{c.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">{c.subject}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant="outline" className={cn("text-xs capitalize", sc.className)}>
                                        {sc.label}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-sm">
                                    {c.contacts.toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-sm">{c.cost}</TableCell>
                                <TableCell className="text-right tabular-nums text-sm hidden md:table-cell">
                                    {c.openRate ?? "—"}
                                </TableCell>
                                <TableCell className="text-right tabular-nums text-sm hidden md:table-cell">
                                    {c.clickRate ?? "—"}
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">
                                    {c.date}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {sampleCampaigns.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                                No campaigns found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>}
            {/* ════════════════════════════════════════════ */}
            {/* CREATE VIEW (wizard)                         */}
            {/* ════════════════════════════════════════════ */}

            <div className="">

                {view === "create" && (
                    <>
                        {/* Stepper */}
                        <div
                            className="flex items-center justify-between mb-8   animate-fade-up"
                            style={{ animationDelay: "100ms" }}
                        >
                            {steps.map((s, i) => {
                                const done = step > s.id;
                                const active = step === s.id;
                                return (
                                    <div key={s.id} className="flex items-center flex-1 last:flex-none">
                                        <button
                                            onClick={() => s.id < step && setStep(s.id)}
                                            className={cn(
                                                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                active && "bg-primary/10 text-primary",
                                                done && "text-primary cursor-pointer",
                                                !active && !done && "text-muted-foreground"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                                                    active && "bg-primary text-primary-foreground",
                                                    done && "bg-primary/15 text-primary",
                                                    !active && !done && "bg-muted text-muted-foreground"
                                                )}
                                            >
                                                {done ? <Check className="h-3.5 w-3.5" /> : s.id}
                                            </span>
                                            <span className="hidden sm:inline">{s.label}</span>
                                        </button>
                                        {i < steps.length - 1 && (
                                            <div className={cn("flex-1 h-px mx-2", step > s.id ? "bg-primary/30" : "bg-border")} />
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Step Content */}
                        <div
                            className="rounded-xl border bg-card shadow-sm p-6 lg:p-8  animate-fade-up"
                            style={{ animationDelay: "160ms" }}
                        >
                            {/* STEP 1: COMPOSE */}
                            {step === 1 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground mb-1">Compose your email</h2>
                                        <p className="text-sm text-muted-foreground">Set up the content and sender details</p>
                                    </div>
                                    <div className="grid gap-5">
                                        <div className="space-y-2">
                                            <Label htmlFor="campaign-name">Campaign Name</Label>
                                            <Input id="campaign-name" placeholder="e.g. Spring Product Launch" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="sender-name">Sender Name</Label>
                                                <Input id="sender-name" value={senderName} onChange={(e) => setSenderName(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="sender-email">Sender Email</Label>
                                                <Input id="sender-email" type="email" value={senderEmail} onChange={(e) => setSenderEmail(e.target.value)} />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="subject">Subject Line</Label>
                                            <Input id="subject" placeholder="e.g. You're invited — exclusive early access" value={subject} onChange={(e) => setSubject(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="preview-text">Preview Text (optional)</Label>
                                            <Input id="preview-text" placeholder="Shown next to the subject in inbox" value={previewText} onChange={(e) => setPreviewText(e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="body">Email Body</Label>
                                            <Textarea id="body" rows={8} placeholder="Write your email content here..." value={body} onChange={(e) => setBody(e.target.value)} className="resize-y" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: AUDIENCE */}
                            {step === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground mb-1">Select Audience</h2>
                                        <p className="text-sm text-muted-foreground">Choose one or more segments to target</p>
                                    </div>
                                    <div className="grid gap-3">
                                        {audienceSegments.map((seg) => {
                                            const checked = selectedSegments.includes(seg.id);
                                            return (
                                                <label
                                                    key={seg.id}
                                                    className={cn(
                                                        "flex items-center gap-4 rounded-lg border px-4 py-3.5 cursor-pointer transition-all",
                                                        checked ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border hover:border-primary/20 hover:shadow-sm"
                                                    )}
                                                >
                                                    <Checkbox checked={checked} onCheckedChange={() => toggleSegment(seg.id)} />
                                                    <div className="flex-1"><span className="text-sm font-medium text-foreground">{seg.label}</span></div>
                                                    <Badge variant="secondary" className="tabular-nums">{seg.count.toLocaleString()} contacts</Badge>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {selectedSegments.length > 0 && (
                                        <div className="rounded-lg bg-muted/60 p-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Users className="h-4 w-4 text-primary" />
                                                <span className="font-medium text-foreground">{totalContacts.toLocaleString()}</span>
                                                <span className="text-muted-foreground">estimated contacts</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <DollarSign className="h-4 w-4 text-primary" />
                                                <span className="font-medium text-foreground">${estimatedCost}</span>
                                                <span className="text-muted-foreground">estimated cost</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 3: SCHEDULE */}
                            {step === 3 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground mb-1">Schedule Delivery</h2>
                                        <p className="text-sm text-muted-foreground">Send immediately or pick a date and time</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setScheduleType("now")}
                                            className={cn("flex-1 rounded-lg border p-4 text-left transition-all", scheduleType === "now" ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border hover:border-primary/20")}
                                        >
                                            <Send className="h-5 w-5 text-primary mb-2" />
                                            <p className="text-sm font-medium text-foreground">Send Now</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">Deliver immediately after review</p>
                                        </button>
                                        <button
                                            onClick={() => setScheduleType("later")}
                                            className={cn("flex-1 rounded-lg border p-4 text-left transition-all", scheduleType === "later" ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border hover:border-primary/20")}
                                        >
                                            <Clock className="h-5 w-5 text-primary mb-2" />
                                            <p className="text-sm font-medium text-foreground">Schedule</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">Pick a specific date & time</p>
                                        </button>
                                    </div>
                                    {scheduleType === "later" && (
                                        <div className="grid sm:grid-cols-3 gap-4">
                                            <div className="space-y-2 sm:col-span-1">
                                                <Label>Date</Label>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !scheduleDate && "text-muted-foreground")}>
                                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                                            {scheduleDate ? format(scheduleDate, "PPP") : "Pick a date"}
                                                        </Button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar mode="single" selected={scheduleDate} onSelect={setScheduleDate} disabled={(date) => date < new Date()} initialFocus className="p-3 pointer-events-auto" />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="time">Time</Label>
                                                <Input id="time" type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Timezone</Label>
                                                <Select value={timezone} onValueChange={setTimezone}>
                                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="UTC">UTC</SelectItem>
                                                        <SelectItem value="EST">EST (UTC−5)</SelectItem>
                                                        <SelectItem value="CST">CST (UTC−6)</SelectItem>
                                                        <SelectItem value="PST">PST (UTC−8)</SelectItem>
                                                        <SelectItem value="IST">IST (UTC+5:30)</SelectItem>
                                                        <SelectItem value="CET">CET (UTC+1)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 4: REVIEW */}
                            {step === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-lg font-semibold text-foreground mb-1">Review & Send</h2>
                                        <p className="text-sm text-muted-foreground">Double-check everything before sending</p>
                                    </div>
                                    <div className="divide-y rounded-lg border overflow-hidden">
                                        <div className="p-4 flex items-start gap-3">
                                            <Mail className="h-4 w-4 text-primary mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Campaign</p>
                                                <p className="text-sm font-medium text-foreground truncate">{campaignName}</p>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-start gap-3">
                                            <FileText className="h-4 w-4 text-primary mt-0.5" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs text-muted-foreground">Subject</p>
                                                <p className="text-sm font-medium text-foreground truncate">{subject}</p>
                                                {previewText && <p className="text-xs text-muted-foreground mt-0.5 truncate">{previewText}</p>}
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-start gap-3">
                                            <Send className="h-4 w-4 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">From</p>
                                                <p className="text-sm font-medium text-foreground">{senderName} &lt;{senderEmail}&gt;</p>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-start gap-3">
                                            <Users className="h-4 w-4 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Audience</p>
                                                <p className="text-sm font-medium text-foreground">{totalContacts.toLocaleString()} contacts</p>
                                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                    {audienceSegments.filter((s) => selectedSegments.includes(s.id)).map((s) => (
                                                        <Badge key={s.id} variant="secondary" className="text-xs">{s.label}</Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-start gap-3">
                                            <Clock className="h-4 w-4 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Delivery</p>
                                                <p className="text-sm font-medium text-foreground">
                                                    {scheduleType === "now" ? "Immediately after confirmation" : scheduleDate ? `${format(scheduleDate, "PPP")} at ${scheduleTime} ${timezone}` : "—"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="p-4 flex items-start gap-3">
                                            <DollarSign className="h-4 w-4 text-primary mt-0.5" />
                                            <div>
                                                <p className="text-xs text-muted-foreground">Estimated Cost</p>
                                                <p className="text-sm font-medium text-foreground">${estimatedCost}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-between mt-6   animate-fade-up" style={{ animationDelay: "220ms" }}>
                            <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 1} className="gap-1.5">
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>
                            {step < 4 ? (
                                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext()} className="gap-1.5">
                                    Next <ArrowRight className="h-4 w-4" />
                                </Button>
                            ) : (
                                <Button onClick={handleSend} className="gap-1.5">
                                    {scheduleType === "now" ? (<><Send className="h-4 w-4" /> Send Campaign</>) : (<><Clock className="h-4 w-4" /> Schedule Campaign</>)}
                                </Button>
                            )}
                        </div>
                    </>
                )}
            </div>

        </div >
    )
}

export default Campaign
