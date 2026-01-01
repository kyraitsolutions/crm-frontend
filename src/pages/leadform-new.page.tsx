"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LocalStorageUtils } from "@/utils";
import { ToastMessageService } from "@/services";
import { DASHBOARD_PATH } from "@/constants";
import Loader from "@/components/Loader";

interface CustomField {
  label: string;
  key: string;
  required: boolean;
}

export default function LeadFormNew() {
  const { accountId } = useParams();
  const toastMessageService = new ToastMessageService();
  const navigate = useNavigate();
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [formName, setFormName] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    "Thank you for submitting your details! Our team will contact you soon."
  );
  const [successCTA, setSuccessCTA] = useState("whatsapp");
  const [successCTADestination, setSuccessCTADestination] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState({
    name: true,
    phoneNumber: true,
    email: true,
    message: false,
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const addCustomField = () => {
    setCustomFields([...customFields, { label: "", key: "", required: false }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = <K extends keyof CustomField>(
    index: number,
    key: K,
    value: CustomField[K]
  ) => {
    const updated = [...customFields];
    updated[index][key] = value;
    setCustomFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        formTitle,
        formDescription,
        headerImage,
        formName,
        formFields: {
          ...formFields,
          customFields,
        },
        successMessage,
        successCTA,
        successCTADestination,
      };

      const response = await axios.post(
        `https://crm-backend-7lf9.onrender.com/api/account/${accountId}/form/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${LocalStorageUtils.getItem("token")}`,
          },
        }
      );
      if (response.status === 200 || response.status === 201) {
        toastMessageService.apiSuccess(response.data.responseMessage);
        navigate(
          `${DASHBOARD_PATH.getAccountPath(String(accountId))}/lead-forms`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 px-6">
      {/* LEFT: Builder */}
      <div className="">
        <Card className="border-none shadow-none bg-transparent">
          <CardHeader className="px-0">
            <CardTitle className="text-2xl font-medium text-[#37322F]">
              Create New Lead Form
            </CardTitle>
            <CardDescription className="text-[#847971]">
              Design a lead form that feels native to your website.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-0">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <Label className="text-sm font-medium text-[#37322F]">
                  Title
                </Label>
                <Input
                  value={formTitle}
                  required
                  placeholder="ACME Residences Showflat Booking"
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="
                mt-2
                bg-[#F7F6F4]
                border-none
                rounded-lg
                focus-visible:ring-0
                text-[#37322F]
              "
                />
              </div>

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-[#37322F]">
                  Description
                </Label>
                <Textarea
                  value={formDescription}
                  placeholder="Tell users why they should submit this form"
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="
                mt-2
                bg-[#F7F6F4]
                border-none
                rounded-lg
                focus-visible:ring-0
              "
                />
              </div>

              {/* Header Image */}
              <div>
                <Label className="text-sm font-medium text-[#37322F]">
                  Header Image URL
                </Label>
                <Input
                  value={headerImage}
                  placeholder="https://..."
                  onChange={(e) => setHeaderImage(e.target.value)}
                  className="
                mt-2
                bg-[#F7F6F4]
                border-none
                rounded-lg
                focus-visible:ring-0
              "
                />
              </div>

              {/* Form Fields */}
              <div>
                <Label className="text-sm font-medium text-[#37322F]">
                  Fields
                </Label>
                <div className="mt-3 flex flex-col gap-3">
                  {Object.keys(formFields).map((field) => (
                    <div
                      key={field}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="capitalize text-[#37322F]">
                        {field}
                      </span>
                      <Switch
                        checked={formFields[field as keyof typeof formFields]}
                        onCheckedChange={(val) =>
                          setFormFields((prev) => ({ ...prev, [field]: val }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Fields */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Label className="text-sm font-medium text-[#37322F]">
                    Custom Fields
                  </Label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={addCustomField}
                    className="text-[#37322F]"
                  >
                    <PlusCircle className="w-4 h-4 mr-1" /> Add
                  </Button>
                </div>

                <div className="flex flex-col gap-4">
                  {customFields.map((field, index) => (
                    <div key={index} className="flex gap-3 items-center">
                      <Input
                        value={field.label}
                        placeholder="Label"
                        onChange={(e) =>
                          updateCustomField(index, "label", e.target.value)
                        }
                        className="mt-2
                        bg-[#F7F6F4]
                        border-none
                        rounded-lg
                        focus-visible:ring-0"
                      />
                      <Input
                        value={field.key}
                        placeholder="Key"
                        onChange={(e) =>
                          updateCustomField(index, "key", e.target.value)
                        }
                        className="mt-2
                        bg-[#F7F6F4]
                        border-none
                        rounded-lg
                        focus-visible:ring-0"
                      />
                      <Switch
                        checked={field.required}
                        onCheckedChange={(val) =>
                          updateCustomField(index, "required", val)
                        }
                      />
                      <Trash2
                        className="size-12 text-red-500 cursor-pointer"
                        onClick={() => removeCustomField(index)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="successMessage" className="text-sm font-medium text-[#37322F]">Success Message</Label>
                <Textarea
                  id="successMessage"
                  value={successMessage}
                  className="mt-2
                  bg-[#F7F6F4]
                  border-none
                  rounded-lg
                  focus-visible:ring-0"
                  onChange={(e) => setSuccessMessage(e.target.value)}
                />
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-[#37322F]">
                    Success CTA
                  </Label>
                  <Select value={successCTA} onValueChange={setSuccessCTA}>
                    <SelectTrigger className="mt-2 bg-[#F7F6F4] border-none rounded-lg">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-[#37322F]">
                    CTA Destination
                  </Label>
                  <Input
                    value={successCTADestination}
                    placeholder="https://..."
                    onChange={(e) => setSuccessCTADestination(e.target.value)}
                    className="mt-2
                    bg-[#F7F6F4]
                    border-none
                    rounded-lg
                    focus-visible:ring-0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="formName" className="text-sm font-medium text-[#37322F]">Form Name*</Label>
                <Input
                  id="formName"
                  placeholder="e.g. website_lead_form"
                  value={formName}
                  className="mt-2
                  bg-[#F7F6F4]
                  border-none
                  rounded-lg
                  focus-visible:ring-0"
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              {/* Submit */}
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="ghost">Cancel</Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="
                rounded-[99px]
                bg-[#37322F]
                text-[#FBFAF9]
                px-6
                shadow-[0px_2px_6px_rgba(55,50,47,0.15)]
              "
                >
                  Create Form {isLoading && <Loader />}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT: Preview */}
      <div className="py-8">
        <Card className="border-none shadow-none bg-[#FBFAF9] rounded-2xl">
          <CardContent className="">
            <div className="grid gap-4">
              {headerImage && (
                <img
                  src={headerImage}
                  className="w-full h-44 object-cover rounded-t-2xl"
                />
              )}
              {formFields.name && <Input placeholder="Name" disabled className="rounded-xl" />}
              {formFields.phoneNumber && <Input placeholder="Phone Number" disabled className="rounded-xl" />}
              {formFields.email && <Input placeholder="Email" disabled className="rounded-xl" />}
              {formFields.message && <Textarea placeholder="Message" disabled className="rounded-xl" />}
              {customFields.map((f, i) => (
                <Input key={i} placeholder={f.label || "Custom Field"} disabled className="rounded-xl" />
              ))}

              <Button
                disabled
                className="
                mt-4
                rounded-[99px]
                bg-[#37322F]
                text-[#FBFAF9]
              "
              >
                Submit
              </Button>
            </div>
          </CardContent>

        </Card>
      </div>
    </div>


  );
}
