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
    <div className="bg-white! rounded-2xl p-10 max-w-5xl mx-auto">
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
          name="name"
        />
        <InputRow
          {...{ formData, setFormData }}
          label="Line 1"
          name="address.line1"
          isTextArea
        />
        <InputRow
          {...{ formData, setFormData }}
          label="Line 2"
          name="address.line2"
          isTextArea
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">

          <InputRow
            {...{ formData, setFormData }}
            label="City"
            name="address.city"
          />
          <InputRow
            {...{ formData, setFormData }}
            label="State"
            name="address.state"
          />

          <InputRow
            {...{ formData, setFormData }}
            label="Country"
            name="address.country"
          />

          <InputRow
            {...{ formData, setFormData }}
            label="Pincode"
            name="address.pincode"
          />
        </div>

        <InputRow
          {...{ formData, setFormData }}
          label="Website URL"
          name="website"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
          <InputRow {...{ formData, setFormData }} label="Phone" name="phone" />
          <InputRow
            {...{ formData, setFormData }}
            label="Industry"
            name="industry"
          />
        </div>

        <InputRow
          {...{ formData, setFormData }}
          label="Privacy Policy"
          name="privacyPolicy"
        />
        <InputRow
          {...{ formData, setFormData }}
          label="Terms"
          name="terms"
        />
      </div>

      <div className="flex justify-center gap-4 mt-10">
        <Button onClick={onSave} className="rounded-2xl">
          Update
        </Button>
        <Button variant="outline" onClick={onCancel} className="rounded-2xl">
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CompanyProfileForm;
