import StatusBadge from "./StatusBadge";
import { Edit } from "lucide-react";
import DataRow from "./DataRow";
import CompanyLogo from "./CompanyLogo";
import { ROLES } from "@/rbac";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";

const CompanyProfileView = ({ data, onEdit, role }: any) => {
  return (
    <section className="bg-white rounded">
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-4">
          <h2 className="text-primary">Company Profile</h2>
          <StatusBadge isActive={data?.isActive || "Active"} />
        </div>

        {role === ROLES.OWNER && (
          <ButtonWithTitle title="Edit" className="rounded-xl flex items-center gap-1" onClick={onEdit}>
            <Edit className="mr-1 size-5" /> Edit
          </ButtonWithTitle>
        )}
      </div>

      <div className="p-8 flex justify-between">
        <div className="flex-1 space-y-2">
          <DataRow label="Company Name" value={data?.name} />

          <DataRow
            label="Address"
            value={[
              data?.address?.line1,
              data?.address?.line2,
              data?.address?.city,
              data?.address?.state,
              data?.address?.country,
              data?.address?.pincode,
            ]
              .filter(Boolean)
              .join(", ")}
          />

          <DataRow label="Website URL" value={data?.website} isLink />
          <DataRow label="Phone" value={data?.phone} />
          <DataRow label="Industry" value={data?.industry} />
          <DataRow label="Privacy Policy" value={data?.privacyPolicy} isLink />
          <DataRow label="Terms" value={data?.terms} isLink />
        </div>

        <CompanyLogo name={data?.name} logo={data?.logoUrl} isEdit={false} />
      </div>
    </section>
  );
};

export default CompanyProfileView;
