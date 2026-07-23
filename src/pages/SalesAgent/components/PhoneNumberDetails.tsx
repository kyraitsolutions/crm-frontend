import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores";
import { useEffect, useState } from "react";
import { callService } from "../services/call.service";
import { useParams } from "react-router-dom";
import DataLoader from "@/components/Loader/data-loader";
import { ArrowLeft } from "lucide-react";

const PhoneNumberDetails = () => {
    const { accountId } = useAuthStore((state) => state);
    const { phoneNumberSID } = useParams();

    console.log(phoneNumberSID)
    const [myNumberDetails, setMyNumberDetails] = useState<{} | any>({});
    const [loading, setLoading] = useState(false);
    const getMyNumbers = async () => {
        setLoading(true)
        try {
            const response = await callService.getMyNumberDetails(String(accountId), String(phoneNumberSID));
            setMyNumberDetails(response.data?.doc)
            console.log(response.data.docs)
        } catch (error) {

            setMyNumberDetails([])
            console.error("error", error)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getMyNumbers()
    }, [])

    if (loading) {
        return <DataLoader />
    }

    console.log(myNumberDetails)
    const handleHistoryBack = () => {
        window.history.back();
    };
    return (
        <div className="p-5">
            <div className="flex items-center border-b pb-3 mb-6 gap-10">

                <Button
                    onClick={handleHistoryBack}
                    className="actions-btn rounded-full! md:w-6 md:h-6"
                >
                    <ArrowLeft />
                </Button>
                <h1 className="text-lg font-semibold  text-slate-700">{myNumberDetails?.friendlyName}</h1>
            </div>

            {/* Tabs */}
            {/* <div className="flex gap-6 border-b mb-8 text-sm">
                <button className="border-b-2 border-primary pb-3 font-medium text-primary">
                    Properties
                </button>
                <button className="pb-3 text-slate-600">Configure</button>
                <button className="pb-3 text-slate-600">Calls Log</button>
                <button className="pb-3 text-slate-600">Messages Log</button>
                <button className="pb-3 text-slate-600">Regulatory Information</button>
            </div> */}

            {/* Properties */}
            <div className="grid grid-cols-3 gap-10 mb-10 text-sm ">
                <div>
                    <p className="font-semibold mb-1">Friendly Name</p>
                    <p>(424) 496-3073</p>

                    <p className="font-semibold mt-6 mb-1">Capabilities</p>
                    <p>Voice, SMS, MMS, SIP</p>
                </div>

                <div>
                    <p className="font-semibold mb-1">Phone Number SID</p>
                    <p className="break-all text-slate-600">
                        PN0c0b2031b4764a141ad74405b59b040a
                    </p>

                    <p className="font-semibold mt-6 mb-1">Phone Number Type</p>
                    <p>Local</p>
                </div>

                <div>
                    <p className="font-semibold mb-1">Locality</p>
                    <p>Compton, CA, US</p>
                </div>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-slate-700">Actions</h2>

            <div className="grid md:grid-cols-2 gap-5">
                {/* Configure */}
                {/* <div className="rounded-xl border p-6">
                    <h3 className="font-semibold mb-3">
                        Configure Voice & Messaging
                    </h3>

                    <p className="text-sm text-slate-600 mb-6">
                        Configure the voice and messaging preferences for this phone
                        number.
                    </p>

                    <button className="rounded border px-4 py-2 hover:bg-gray-50">
                        Go to Configure
                    </button>
                </div> */}

                {/* Release */}
                <div className="rounded-xl border p-4">
                    <h3 className="font-semibold mb-3 text-primary">
                        Release Phone Number
                    </h3>

                    <p className="text-sm text-slate-600 mb-6">
                        Remove this number from your account. It may become available for
                        purchase again later.
                    </p>

                    <Button className="rounded border border-primary bg-primary/20! text-primary hover:bg-red-50">
                        Release Phone Number
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default PhoneNumberDetails;