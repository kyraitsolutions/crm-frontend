"use client";

import Loader from "@/components/Loader";
import LeadFormSkeleton from "@/components/skeltons/LeadFormSkelton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { DASHBOARD_PATH } from "@/constants";
import { ToastMessageService } from "@/services";
import { LeadFormService } from "@/services/leadform.service";
import type { ApiError } from "@/types";
import { Edit, PlusCircle, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

interface CustomField {
  label: string;
  key: string;
  required: boolean;
}

export default function LeadFormNew() {
  const { pathname } = useLocation();
  const { accountId, formId } = useParams();
  const toastMessageService = new ToastMessageService();
  const leadFormService = new LeadFormService();
  const navigate = useNavigate();

  const isView = pathname.includes("view");
  const isUpdate = pathname.includes("update");

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [formName, setFormName] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    "Thank you for submitting your details! Our team will contact you soon.",
  );
  const [successCTA, setSuccessCTA] = useState("whatsapp");
  const [successCTADestination, setSuccessCTADestination] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFormData, setIsLoadingFormData] = useState(false);

  const [formFields, setFormFields] = useState({
    name: true,
    phoneNumber: true,
    email: true,
    message: false,
  });

  const [customFieldsEnabled, setCustomFieldsEnabled] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);

  const handleCustomFieldsChange = (value: boolean) => {
    setCustomFieldsEnabled(value);

    if (value) {
      setCustomFields((prev) =>
        prev.map((field) => ({ ...field, required: true })),
      );
    } else {
      setCustomFields((prev) =>
        prev.map((field) => ({ ...field, required: false })),
      );
    }
  };

  const addCustomField = () => {
    setCustomFields([...customFields, { label: "", key: "", required: false }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = <K extends keyof CustomField>(
    index: number,
    key: K,
    value: CustomField[K],
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

      if (isUpdate) {
        const response = await leadFormService.updateLeadFormById(
          String(accountId),
          String(formId),
          payload,
        );

        if (response.status === 200) {
          toastMessageService.apiSuccess(response.data.responseMessage);
          navigate(
            `${DASHBOARD_PATH.getAccountPath(String(accountId))}/lead-forms`,
          );
        }
        return;
      }

      const response = await leadFormService.createLeadForm(
        String(accountId),
        payload,
      );

      if (response.status === 200 || response.status === 201) {
        toastMessageService.apiSuccess(response.data.responseMessage);
        navigate(
          `${DASHBOARD_PATH.getAccountPath(String(accountId))}/lead-forms`,
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getLeadFormById = async (leadFormId: string) => {
    setIsLoadingFormData(true);
    try {
      const response = await leadFormService.getLeadFormById(
        String(accountId),
        leadFormId,
      );
      if (response.status === 200 || response.status === 201) {
        setFormTitle(response?.data?.docs?.formTitle);
        setFormDescription(response?.data?.docs?.formDescription);
        setFormFields((prev) => ({
          ...prev,
          name: response?.data?.docs?.formFields?.name,
          phoneNumber: response?.data?.docs?.formFields?.phoneNumber,
          email: response?.data?.docs?.formFields?.email,
          message: response?.data?.docs?.formFields?.message,
        }));
        setFormName(response?.data?.docs?.formName);
        setCustomFields(response?.data?.docs?.formFields?.customFields || []);
        setSuccessCTA(response?.data?.docs?.successCTA);
        setSuccessCTADestination(response?.data?.docs?.successCTADestination);
        setHeaderImage(response?.data?.docs?.headerImage);

        const isCustomFieldToggleTrue =
          response?.data?.docs?.formFields?.customFields?.some(
            (field: CustomField) => field.required === true,
          );

        setCustomFieldsEnabled(isCustomFieldToggleTrue);

        return response.data;
      }
    } catch (err) {
      const error = err as ApiError;
      toastMessageService.apiError(error.message);
    } finally {
      setIsLoadingFormData(false);
    }
  };

  useEffect(() => {
    if (isView || isUpdate) {
      getLeadFormById(String(formId));
    }
  }, []);

  return (
    <React.Fragment>
      {isLoadingFormData ? (
        <LeadFormSkeleton />
      ) : (
        <div>
          {
            isView && (

              <div className="flex justify-end py-2 px-6 sticky top-0">
                <Link
                  to={`${DASHBOARD_PATH.getAccountPath(accountId!)}/lead-forms/${formId}/update`}
                  className="
                sticky top-44
                z-50
                inline-flex items-center gap-2
                rounded-xl border border-[#16A34A]/30
                bg-[#16A34A]/5 px-3 py-1.5
                text-sm font-medium text-[#166534]
                transition-all
                hover:bg-[#16A34A]/10
                hover:border-[#16A34A]/50
                focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30
              "
                >
                  <Edit size={14} />
                  Edit
                </Link>
              </div>)
          }


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
                        readOnly={isView}
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
                        readOnly={isView}
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
                        readOnly={isView}
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
                              disabled={isView}
                              checked={
                                formFields[field as keyof typeof formFields]
                              }
                              onCheckedChange={(val) =>
                                setFormFields((prev) => ({
                                  ...prev,
                                  [field]: val,
                                }))
                              }
                            />
                          </div>
                        ))}

                        <div className="flex justify-between items-center mb-3">
                          <Label className="text-sm font-medium text-[#37322F]">
                            Custom Fields
                          </Label>

                          <Switch
                            disabled={isView}
                            checked={customFieldsEnabled}
                            onCheckedChange={(val) =>
                              handleCustomFieldsChange(val)
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Custom Fields */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label className="text-sm font-medium text-[#37322F]">
                          Custom Fields
                        </Label>
                        {!isView && (
                          <Button
                            disabled={!customFieldsEnabled}
                            type="button"
                            variant="ghost"
                            onClick={addCustomField}
                            className="text-[#37322F]"
                          >
                            <PlusCircle className="w-4 h-4 mr-1" /> Add
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-col gap-4">
                        {customFields.map((field, index) => (
                          <div
                            key={index}
                            className={`flex gap-3 items-center ${isView || !customFieldsEnabled ? "opacity-55 pointer-events-none" : ""}`}
                          >
                            <Input
                              value={field.label}
                              placeholder="Label"
                              onChange={(e) =>
                                updateCustomField(
                                  index,
                                  "label",
                                  e.target.value,
                                )
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
                      <Label
                        htmlFor="successMessage"
                        className="text-sm font-medium text-[#37322F]"
                      >
                        Success Message
                      </Label>
                      <Textarea
                        id="successMessage"
                        value={successMessage}
                        className="mt-2
                  bg-[#F7F6F4]
                  border-none
                  rounded-lg
                  focus-visible:ring-0"
                        readOnly={isView}
                        onChange={(e) => setSuccessMessage(e.target.value)}
                      />
                    </div>

                    {/* CTA */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-[#37322F]">
                          Success CTA
                        </Label>
                        <Select
                          disabled={isView}
                          value={successCTA}
                          onValueChange={setSuccessCTA}
                        >
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
                          readOnly={isView}
                          value={successCTADestination}
                          placeholder="https://..."
                          onChange={(e) =>
                            setSuccessCTADestination(e.target.value)
                          }
                          className="mt-2
                    bg-[#F7F6F4]
                    border-none
                    rounded-lg
                    focus-visible:ring-0"
                        />
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="formName"
                        className="text-sm font-medium text-[#37322F]"
                      >
                        Form Name*
                      </Label>
                      <Input
                        readOnly={isView}
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
                    {!isView && (
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
                          {isUpdate ? "Update" : "Create"}{" "}
                          {isLoading && <Loader />}
                        </Button>
                      </div>
                    )}
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

                    {formFields.name && (
                      <Input
                        placeholder="Name"
                        disabled
                        className="rounded-xl"
                      />
                    )}

                    {formFields.phoneNumber && (
                      <Input
                        placeholder="Phone Number"
                        disabled
                        className="rounded-xl"
                      />
                    )}

                    {formFields.email && (
                      <Input
                        placeholder="Email"
                        disabled
                        className="rounded-xl"
                      />
                    )}

                    {formFields.message && (
                      <Textarea
                        placeholder="Message"
                        disabled
                        className="rounded-xl"
                      />
                    )}

                    {customFields.map(
                      (f, i) =>
                        f.required && (
                          <Input
                            key={i}
                            placeholder={f.label || "Custom Field"}
                            disabled
                            className="rounded-xl"
                          />
                        ),
                    )}

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
        </div>
      )}
    </React.Fragment>
  );
}
