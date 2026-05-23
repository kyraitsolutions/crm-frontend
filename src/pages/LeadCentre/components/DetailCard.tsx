import { useState } from 'react'
import { FieldRow } from './FieldRow'
interface Lead {
    name: string;
    company: string;
    owner: string;
    email: string;
    phone: string;
    mobile: string;
    status: string;
    title: string;
    source: {
        name: string;
    };
    website: string;
}

const leadData: Lead = {
    name: "Ms. Yvonne Tjepkema (Sample)",
    company: "Grayson",
    owner: "Abhijeet Singh",
    email: "yvonne-tjepkema@noemail.invalid",
    phone: "555-555-5555",
    mobile: "555-555-5555",
    status: "Pre-Qualified",
    title: "Office Assistant III",
    source: {
        name: "External Referral"
    },
    website: "http://www.feltzprintingservice.com",
};
const DetailCard = ({ lead }: { lead: Lead | null }) => {
    const [hideDetails, setHideDetails] = useState(true);

    return (
        <div className="bg-white rounded-xl overflow-hidden">
            <div onClick={() => setHideDetails((prev) => !prev)} className={`${hideDetails && "border-b"} cursor-pointer  px-5 py-3 font-semibold text-md`}>
                Hide Details
            </div>
            {hideDetails && <div>

                <div className="p-6">
                    <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
                        Lead Information
                    </h2>

                    <div className="grid grid-cols-2 gap-x-24 max-w-4xl mx-auto">
                        {/* Left */}
                        <div>
                            <FieldRow
                                label="Lead Owner"
                                value={lead?.owner || "Assignee--"}
                            />

                            <FieldRow
                                label="Title"
                                value={lead?.title || ""}
                            />

                            <FieldRow
                                label="Phone"
                                value={lead?.phone || ""}
                                isPhone
                            />

                            <FieldRow
                                label="Mobile"
                                value={lead?.phone || ""}
                                isPhone
                            />

                            <FieldRow
                                label="Lead Source"
                                value={lead?.source.name || ""}
                            />
                        </div>

                        {/* Right */}
                        <div>
                            <FieldRow
                                label="Company"
                                value={lead?.company || ""}
                            />

                            <FieldRow
                                label="Lead Name"
                                value={lead?.name || ""}
                            />

                            <FieldRow
                                label="Email"
                                value={lead?.email || ""}
                            />

                            <FieldRow
                                label="Website"
                                value={lead?.website || ""}
                            />

                            <FieldRow
                                label="Lead Status"
                                value={lead?.status || ""}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-6">
                    <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
                        Address Information
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <FieldRow
                            label="Address"
                            value={"Mohali, India"}
                        />
                    </div>


                </div>
                <div className="p-6">
                    <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
                        Description Information
                    </h2>
                    <div className="max-w-4xl mx-auto">
                        <FieldRow
                            label="Description"
                            value={"Address Information Address 639 Main St Anchorage, AK 99501"}
                        />
                    </div>


                </div>
                <div className="p-6">
                    <h2 className="font-semibold text-md mb-6 text-[#1e293b]">
                        Visit Summary
                    </h2>

                    <div className="grid grid-cols-2 gap-x-24 max-w-4xl mx-auto">
                        {/* Left */}
                        <div>
                            <FieldRow
                                label="Most Recent Visit"
                                value={lead?.owner || "Assignee--"}
                            />

                            <FieldRow
                                label="Average Time Spent (Minutes)"
                                value={lead?.title || ""}
                            />

                            <FieldRow
                                label="Referrer"
                                value={lead?.phone || ""}
                                isPhone
                            />

                            <FieldRow
                                label="First Visit"
                                value={lead?.phone || ""}
                                isPhone
                            />

                        </div>

                        {/* Right */}
                        <div>
                            <FieldRow
                                label="First Page Visited"
                                value={lead?.company || ""}
                            />

                            <FieldRow
                                label="Number Of Chats"
                                value={lead?.name || ""}
                            />

                            <FieldRow
                                label="Visitor Score"
                                value={lead?.email || ""}
                            />

                            <FieldRow
                                label="Days Visited"
                                value={lead?.website || ""}
                            />

                        </div>
                    </div>
                </div>
            </div>}


        </div>
    )
}

export default DetailCard