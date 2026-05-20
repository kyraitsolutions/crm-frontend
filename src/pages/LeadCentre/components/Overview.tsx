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
    source: string;
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
    source: "External Referral",
    website: "http://www.feltzprintingservice.com",
};
const Overview = () => {
    return (
        <div className="bg-white rounded-xl py-8">
            <div className="max-w-4xl mx-auto">
                <FieldRow
                    label="Lead Owner"
                    value={leadData.owner}
                />
                <FieldRow
                    label="Email"
                    value={leadData.email}
                />
                <FieldRow
                    label="Phone"
                    value={leadData.phone}
                    isPhone
                />
                <FieldRow
                    label="Mobile"
                    value={leadData.mobile}
                    isPhone
                />
                <FieldRow
                    label="Lead Status"
                    value={leadData.status}
                />
            </div>
        </div>
    )
}

export default Overview