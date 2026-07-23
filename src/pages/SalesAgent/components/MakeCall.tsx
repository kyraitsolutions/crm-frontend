import { Button } from "@/components/ui/button";
import { Phone, X } from "lucide-react";
import { useState } from "react";
import { callService } from "../services/call.service";
import { useAuthStore } from "@/stores";

const MakeCall = () => {
    const { accountId } = useAuthStore((store) => store)
    const [openCallPopup, setOpenCallPopup] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        customerPhone: "",
        guestId: "1223",
        hotelName: "Stay xp"
    });

    const makeCall = async () => {
        setLoading(true)
        if (!form.customerPhone) {
            setError("Guest phone number is requried!");
            return;
        }
        try {
            const response = await callService.makeCall(String(accountId), form.customerPhone);
            console.log(response.data.docs)
        } catch (error) {

            console.error("error", error)
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <div className="relative inline-block">
            <Button
                onClick={() => setOpenCallPopup((p) => !p)}
                className="border border-primary text-primary bg-primary/20 rounded-xl hover:text-white duration-200 transition-all"
            >
                <Phone className="mr-0 h-4 w-4 rotate-270" />
                CALL
            </Button>

            {openCallPopup && (
                <div className="absolute left-0 top-12 z-50 w-80 rounded-lg border border-primary bg-white">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="flex items-center gap-1 text-sm font-semibold">
                            Make a call
                        </div>

                        <button onClick={() => setOpenCallPopup(false)}>
                            <X className="h-4 w-4 text-primary" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                        <input
                            value={form.customerPhone}
                            required
                            onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                            placeholder="Type a number / name"
                            className="w-full rounded text-sm border px-3 py-2 outline-none focus:border-blue-500"
                        />
                        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
                        <div className="flex items-center justify-between pb-4 mt-4">
                            <Button onClick={makeCall} className="rounded-xl">CALL</Button>

                            <button className="text-sm text-blue-600">Advanced</button>
                        </div>

                        <hr />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MakeCall;