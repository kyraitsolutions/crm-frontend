import { Button } from "@/components/ui/button";
import { OrganizationService } from "@/services/organization.service";
import { useAuthStore } from "@/stores";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";

const companyData = {
  profile: {
    companyName: "fdg",
    address: "bn",
    websiteUrl: null,
    phone: null,
    industry: "Marketing & Advertising",
    privacyPolicy: null,
    termsOfUse: null,
    logoUrl: "https://cdn-icons-png.flaticon.com/512/3061/3061341.png", // Placeholder building icon
  },
  organization: {
    id: "org60067867423",
    url: "https://campaigns.zoho.in/campaigns/org60067867423/home.do",
    lastModified: "Mar 22, 2026 12:14 AM",
  },
};

const initialData = {
  companyName: "",
  address: "",
  websiteUrl: "",
  phone: "",
  industry: "Marketing & Advertising",
  privacyPolicy: "",
  termsOfUse: "",
  logoUrl: "https://cdn-icons-png.flaticon.com/512/3061/3061341.png",
};

const CompanyDetails = () => {
  // Helper for displaying "No data" links
  const { user } = useAuthStore((state) => state);
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState(initialData);

  const [organizationDetails, setOrganizationDetails] = useState<any>(null);

  const organizationService = new OrganizationService();

  const industries = [
    "Marketing & Advertising",
    "Technology",
    "Finance",
    "Education",
    "Healthcare",
  ];

  const handleSave = (formData: any) => {
    console.log("Form Data", formData);
  };

  const fetchCompanyDetails = async () => {
    try {
      const response =
        await organizationService.getOrganizationDetailsByOrganizationId(
          user?.organization?.id as string,
        );

      if (response.status === 200) {
        setOrganizationDetails(response.data?.docs);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Organization Details", organizationDetails);

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  return (
    <div className="min-h-screen bg-[#f3f7f9] p-6 font-sans">
      {!isEdit ? (
        <div className="space-y-6 ">
          <section className="bg-white rounded border border-slate-100 shadow-xm overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50">
              <div className="flex items-center gap-6">
                <h2 className="text-base text-primary">Company Profile</h2>

                <StatusBadge isActive={organizationDetails?.isActive} />
              </div>
              <Button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 text-xs rounded"
              >
                <Edit />
                Edit
              </Button>
            </div>

            <div className="p-8 flex justify-between">
              <div className="flex-1 space-y-1">
                <DataRow
                  label="Company Name"
                  value={organizationDetails?.name || "-"}
                />
                <DataRow
                  label="Address"
                  value={
                    [
                      organizationDetails?.address?.line1,
                      organizationDetails?.address?.line2,
                      organizationDetails?.address?.city,
                      organizationDetails?.address?.state,
                      organizationDetails?.address?.country,
                      organizationDetails?.address?.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ") || "-"
                  }
                />
                <DataRow
                  label="Website URL"
                  value={organizationDetails?.website || "-"}
                  isLink
                />
                <DataRow
                  label="Phone"
                  value={organizationDetails?.phone || "-"}
                />
                <DataRow
                  label="Industry"
                  value={organizationDetails?.industry || "-"}
                />
                <DataRow
                  label="Privacy Policy link"
                  value={organizationDetails?.privacyPolicy || "-"}
                  isLink
                />
                <DataRow
                  label="Terms of Use link"
                  value={organizationDetails?.terms || "-"}
                  isLink
                />
              </div>

              <div className="w-48 flex flex-col items-center justify-center border-l border-slate-50 pl-8">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                  <img
                    src={companyData.profile.logoUrl}
                    className="w-6 opacity-80"
                    alt="Logo"
                  />
                </div>
                <span className="font-bold text-slate-800 text-sm tracking-tight">
                  {companyData.profile.companyName}
                </span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded border border-slate-100 shadow-xm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-50">
              <h2 className="text-base text-slate-800">Manage Organization</h2>
            </div>
            <div className="p-8">
              <p className="text-[13px] text-slate-600 mb-6 bg-blue-50/50 p-2 border-l-4 border-blue-400 inline-block">
                View your business organization details here. Click "Change" to
                edit the default organization name.
              </p>

              <div className="space-y-2">
                <div className="grid grid-cols-[160px_20px_1fr] items-center text-[13px]">
                  <span className="text-slate-600 font-medium">
                    Organization ID
                  </span>
                  <span className="text-slate-400">:</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-800">
                      {user?.organization?.id}
                    </span>
                    {/* <button className="text-blue-500 text-xs hover:underline">Change</button> */}
                  </div>
                </div>
                <DataRow
                  label="Organization URL"
                  value={companyData.organization.url}
                />
                <DataRow
                  label="Last Modified"
                  value={companyData.organization.lastModified}
                />
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className="bg-white rounded p-10 max-w-5xl mx-auto">
          {/* Logo Upload Section */}
          <div className="flex items-center gap-4 mb-10 ml-45">
            <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center border border-slate-100 overflow-hidden">
              <img
                src={formData.logoUrl}
                alt="Logo"
                className="w-8 opacity-70"
              />
            </div>
            <button className="text-blue-500 text-sm font-medium hover:underline">
              Change
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-1">
            <InputRow
              formData={formData}
              setFormData={setFormData}
              label="Company Name"
              name="companyName"
              placeholder="Company Name"
            />
            <InputRow
              formData={formData}
              setFormData={setFormData}
              label="Address"
              name="address"
              isTextArea
              placeholder="India"
            />
            <InputRow
              formData={formData}
              setFormData={setFormData}
              label="Website URL"
              name="websiteUrl"
              placeholder="Website URL"
            />
            <InputRow
              formData={formData}
              setFormData={setFormData}
              label="Phone"
              name="phone"
              placeholder="Phone"
            />

            {/* Custom Industry Select */}
            <div className="grid grid-cols-[180px_1fr] items-center mb-5">
              <label className="text-sm text-slate-600 text-right pr-6">
                Industry
              </label>
              <div className="relative">
                <select
                  className="w-full border border-slate-200 rounded h-10 px-3 text-sm appearance-none bg-white focus:outline-none focus:border-primary"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                >
                  {industries.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none text-slate-400">
                  ▼
                </div>
              </div>
            </div>

            <InputRow
              formData={formData}
              setFormData={setFormData}
              label="Privacy Policy link"
              name="privacyPolicy"
              placeholder="Privacy Policy link"
            />
            <InputRow
              formData={formData}
              setFormData={setFormData}
              label="Terms of Use link"
              name="termsOfUse"
              placeholder="Terms of Use"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-12 border-t pt-8">
            <button
              onClick={() => handleSave(formData)}
              className="bg-[#ff8a65] text-white px-8 py-2 rounded text-sm font-medium hover:bg-[#ff7b52] transition-colors"
            >
              Update
            </button>
            <button
              onClick={() => setIsEdit(false)}
              className="border border-orange-400 text-orange-500 px-8 py-2 rounded text-sm font-medium hover:bg-orange-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetails;

const DataRow = ({ label, value, isLink = false, isMap = false }: any) => (
  <div className="grid grid-cols-[160px_20px_1fr] items-start text-[13px] py-1.5">
    <span className="text-slate-600 font-medium">{label}</span>
    <span className="text-slate-400">:</span>

    <div>
      {value ? (
        <span
          className={
            isLink || isMap
              ? "text-blue-500 cursor-pointer hover:underline"
              : "text-slate-800"
          }
        >
          {value}
        </span>
      ) : (
        <span className="text-slate-400">No {label}</span>
      )}
      {isMap && value && (
        <p className="text-blue-500 text-[11px] mt-1 cursor-pointer">
          View on Map
        </p>
      )}
    </div>
  </div>
);

const InputRow = ({
  label,
  name,
  type = "text",
  placeholder = "",
  isTextArea = false,
  formData,
  setFormData,
}: any) => (
  <div className="grid grid-cols-[180px_1fr] items-start mb-5">
    <label className="text-sm text-slate-600 mt-2 text-right pr-6">
      {label}
    </label>
    {isTextArea ? (
      <textarea
        className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary min-h-30"
        placeholder={placeholder}
        value={formData[name as keyof typeof formData]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
      />
    ) : (
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-slate-200 rounded h-10 px-3 text-sm focus:outline-none focus:border-primary placeholder:text-slate-300"
        value={formData[name as keyof typeof formData]}
        onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
      />
    )}
  </div>
);

const StatusBadge = ({ isActive }: { isActive: boolean }) => {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
        isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
      }`}
    >
      <span
        className={`w-2 h-2 mr-2 rounded-full ${
          isActive ? "bg-green-500" : "bg-red-500"
        }`}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
};
