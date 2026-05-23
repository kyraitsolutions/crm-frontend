import { FieldRow } from "./FieldRow"
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
    source: { name: "External Referral" },
    website: "http://www.feltzprintingservice.com",
};
const Overview = ({ lead }: { lead: Lead | null }) => {
    return (
        <div className="bg-white rounded-xl py-8">
            <div className="max-w-4xl mx-auto">
                <FieldRow
                    label="Lead Owner"
                    value={lead?.owner || "Assignee--"}
                />
                <FieldRow
                    label="Email"
                    value={lead?.email || ""}
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
                    label="Lead Status"
                    value={lead?.status || ""}
                />
            </div>
        </div>
    )
}

export default Overview