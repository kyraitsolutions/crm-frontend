import { Button } from "@/components/ui/button";
import InputRow from "./InputRow";
import CompanyLogo from "./CompanyLogo";

const CompanyProfileForm = ({
  formData,
  setFormData,
  onCancel,
  onSave,
  isEdit,
}: any) => {
  return (
    <div className="bg-white rounded p-10 max-w-5xl mx-auto">
      <CompanyLogo
        name={formData.companyName}
        logo={formData.logoUrl}
        setFormData={setFormData}
        isEdit={isEdit}
      />

      <div className="space-y-4 mt-6">
        <InputRow
          {...{ formData, setFormData }}
          label="Company Name"
          name="companyName"
        />
        <InputRow
          {...{ formData, setFormData }}
          label="Address"
          name="address"
          isTextArea
        />
        <InputRow
          {...{ formData, setFormData }}
          label="Website URL"
          name="websiteUrl"
        />
        <InputRow {...{ formData, setFormData }} label="Phone" name="phone" />
        <InputRow
          {...{ formData, setFormData }}
          label="Industry"
          name="industry"
        />
        <InputRow
          {...{ formData, setFormData }}
          label="Privacy Policy"
          name="privacyPolicy"
        />
        <InputRow
          {...{ formData, setFormData }}
          label="Terms"
          name="termsOfUse"
        />
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <Button onClick={onSave}>Update</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
