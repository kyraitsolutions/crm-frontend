import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

const CreateCampaign = ({ open, onClose }: any) => {
    const [step, setStep] = useState(1)

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Campaign</DialogTitle>
                </DialogHeader>

                {/* STEP 1 */}
                {step === 1 && (
                    <div className="space-y-4">
                        <Label>Campaign Name</Label>
                        <Input placeholder="Hotel Offer January" />

                        <Label>Sender Email</Label>
                        <Input placeholder="marketing@client.com" />
                    </div>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <div className="space-y-3">
                        <h3 className="font-medium">Select Audience</h3>
                        {["All Leads", "Warm Leads", "Hotel Leads"].map((item) => (
                            <div key={item} className="flex items-center gap-2">
                                <Checkbox />
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <div className="space-y-4">
                        <Label>Email Subject</Label>
                        <Input type="email" placeholder="Special Offer Just for You 🎉" />

                        <Label>Email Body</Label>
                        <Textarea rows={6} placeholder="<h1>Hello {{name}}</h1>" />
                    </div>
                )}

                {/* STEP 4 */}
                {step === 4 && (
                    <div className="space-y-3">
                        <h3 className="font-medium">Review & Cost</h3>

                        <div className="flex justify-between text-sm">
                            <span>Recipients</span>
                            <span>1,000</span>
                        </div>

                        <div className="flex justify-between text-sm">
                            <span>Cost / Email</span>
                            <span>₹0.5</span>
                        </div>

                        <Separator />

                        <div className="flex justify-between font-medium">
                            <span>Total Cost</span>
                            <span>₹500</span>
                        </div>
                    </div>
                )}

                {/* FOOTER */}
                <div className="flex justify-between pt-4">
                    <Button
                        variant="outline"
                        disabled={step === 1}
                        onClick={() => setStep(step - 1)}
                    >
                        Back
                    </Button>

                    {step < 4 ? (
                        <Button onClick={() => setStep(step + 1)}>Next</Button>
                    ) : (
                        <Button>Send Campaign</Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCampaign