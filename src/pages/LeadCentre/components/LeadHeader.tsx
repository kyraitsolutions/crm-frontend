import ButtonWithTitle from '@/components/ui/Buttons/ButtonWithTitle'
import { useAuthStore } from '@/stores';
import { ChevronLeft, ChevronRight, MoreHorizontal, Tag } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom';

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


interface LeadHeaderProps {
    onClick: () => void;
}
const LeadHeader = ({ onClick }: LeadHeaderProps) => {
    const { accountId } = useAuthStore((state) => state);
    const navigate = useNavigate();
    return (
        <div>
            <header className="bg-white border-b border-[#e5e7eb] px-3 py-2">
                <div className="flex items-start justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-4">
                        <ButtonWithTitle onClick={() => navigate(`/dashboard/account/${accountId}/leads`)} title="Go back to leads" className="flex items-center">
                            <ChevronLeft className="text-slate-600" />
                        </ButtonWithTitle>

                        <img
                            src="https://i.pravatar.cc/80?img=5"
                            alt="profile"
                            className="w-10 h-10 rounded-md"
                        />

                        <div>
                            <h1 className="text-md font-medium ">
                                {leadData.name}
                                <span className=" text-gray-500">
                                    {" "}
                                    - {leadData.company}
                                </span>
                            </h1>

                            <button className="flex items-center gap-2 text-sm  hover:text-blue-600">
                                <Tag size={16} />
                                Add Tags
                            </button>
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <ButtonWithTitle onClick={onClick} title="Send mail to current user" className="cursor-pointer bg-primary border border-primary py-1.5 px-3 text-white rounded-xl text-sm">
                            Send Email
                        </ButtonWithTitle>

                        <ButtonWithTitle title="Convert lead into booking" className="border border-primary text-primary bg-primary/10 py-1.5 px-3 rounded-xl text-sm">
                            Convert
                        </ButtonWithTitle>

                        <ButtonWithTitle title="Convert lead into booking" className="border border-primary text-primary bg-primary/10 py-1.5 px-3 rounded-xl text-sm">
                            Edit
                        </ButtonWithTitle>

                        <button className="">
                            <MoreHorizontal size={18} />
                        </button>

                        <ChevronLeft className="text-slate-500" />
                        <ChevronRight className="text-slate-500" />
                    </div>
                </div>
            </header>
        </div>
    )
}

export default LeadHeader