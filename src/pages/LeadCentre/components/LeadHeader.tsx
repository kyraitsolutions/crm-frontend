import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import { useAuthStore } from "@/stores";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ILead } from "../types/lead.type";
import LeadTags from "./Tag";

interface LeadHeaderProps {
  onClick: () => void;
  lead: ILead | null;
}

const LeadHeader = ({ onClick, lead }: LeadHeaderProps) => {
  const { accountId } = useAuthStore((state) => state);
  const navigate = useNavigate();

  return (
    <div className='relative'>
      <header className="bg-white border-b border-[#e5e7eb] px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-4">
            <ButtonWithTitle onClick={() => navigate(`/dashboard/account/${accountId}/leads`)} title="Go back to leads" className="flex items-center">
              <ChevronLeft className="text-slate-600" />
            </ButtonWithTitle>

            {lead?.profileImage ? (
              <img
                src={lead?.profileImage}
                alt="profile"
                className="w-10 h-10 rounded-md"
              />
            ) : (
              <div className="w-10 h-10 rounded-md bg-gray-300 flex items-center justify-center">
                <span className="text-gray-600 text-lg font-bold">
                  {lead?.name?.charAt(0) || "U"}
                </span>
              </div>
            )}

            <div className="relative">
              <h1 className="text-md font-medium ">
                {lead?.name}
                <span className=" text-gray-500">
                  {" "}
                  - {lead?.company || "Company Name"}
                </span>
              </h1>

              <LeadTags lead={lead as ILead} />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <ButtonWithTitle
              onClick={onClick}
              title="Send mail to current user"
              className="cursor-pointer bg-primary border border-primary py-1.5 px-3 text-white rounded-xl text-sm"
            >
              Send Email
            </ButtonWithTitle>

            <ButtonWithTitle
              title="Convert lead into booking"
              className="border border-primary text-primary bg-primary/10 py-1.5 px-3 rounded-xl text-sm"
            >
              Convert
            </ButtonWithTitle>

            {/* <ButtonWithTitle title="Convert lead into booking" className="border border-primary text-primary bg-primary/10 py-1.5 px-3 rounded-xl text-sm">
                            Convert
                        </ButtonWithTitle>

                        <ButtonWithTitle title="Convert lead into booking" className="border border-primary text-primary bg-primary/10 py-1.5 px-3 rounded-xl text-sm">
                            Edit
                        </ButtonWithTitle> */}

            <button className="">
              <MoreHorizontal size={18} />
            </button>

            <ChevronLeft className="text-slate-500" />
            <ChevronRight className="text-slate-500" />
          </div>
        </div>
      </header>
    </div>
  );
};

export default LeadHeader;
