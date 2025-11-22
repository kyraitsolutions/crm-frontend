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
  CardFooter,
} from "@/components/ui/card";
import { PlusCircle, Trash2 } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { LocalStorageUtils } from "@/utils";

export default function LeadFormNew() {
  const { accountId } = useParams();
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [headerImage, setHeaderImage] = useState("");
  const [formName, setFormName] = useState("");
  const [successMessage, setSuccessMessage] = useState(
    "Thank you for submitting your details! Our team will contact you soon."
  );
  const [successCTA, setSuccessCTA] = useState("whatsapp");
  const [successCTADestination, setSuccessCTADestination] = useState("");

  const [formFields, setFormFields] = useState({
    name: true,
    phoneNumber: true,
    email: true,
    message: false,
  });

  const [customFields, setCustomFields] = useState<
    { label: string; key: string; required: boolean }[]
  >([]);

  const addCustomField = () => {
    setCustomFields([
      ...customFields,
      { label: "", key: "", required: false },
    ]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields(customFields.filter((_, i) => i !== index));
  };

  const updateCustomField = (
    index: number,
    key: keyof (typeof customFields)[0],
    value: any
  ) => {
    const updated = [...customFields];
    updated[index][key] = value;
    setCustomFields(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const res = await axios.post(
        `http://localhost:3000/api/account/${accountId}/form/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${LocalStorageUtils.getItem('token')}`,
          },
        }
        ,
      );
      console.log("Form created:", res.data);
      alert("Form created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create form");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-6">
      {/* LEFT SIDE: Form Builder */}
      <div>
        <Card role="main" aria-label="Create Lead Form Instructions" className="p-0 border-none shadow-none">
          <CardHeader>
            <CardTitle>Create New Lead Form</CardTitle>
            <CardDescription>
              Customize your lead form and send details to your API endpoint.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {/* Title */}
              <div>
                <Label htmlFor="formTitle">Title*</Label>
                <Input
                  id="formTitle"
                  placeholder="e.g. ACME Residences Showflat Booking"
                  value={formTitle}
                  className="mt-2"
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="formDescription">Description</Label>
                <Textarea
                  id="formDescription"
                  placeholder="Add a description about your product or event"
                  value={formDescription}
                  className="mt-2"
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              {/* Header Image */}
              <div>
                <Label htmlFor="headerImage">Header Image</Label>
                <Input
                  id="headerImage"
                  placeholder="https://example.com/uploads/header-image.png"
                  value={headerImage}
                  className="mt-2"
                  onChange={(e) => setHeaderImage(e.target.value)}
                />
              </div>

              {/* Form Fields */}
              <div>
                <Label>Form Fields</Label>
                <div className="border rounded-lg p-4 grid gap-3 mt-2">
                  {Object.keys(formFields).map((field) => (
                    <div
                      key={field}
                      className="flex justify-between items-center"
                    >
                      <span className="capitalize">{field}</span>
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
                <div className="flex justify-between items-center mb-2">
                  <Label>Custom Fields</Label>
                  <Button type="button" variant="ghost" onClick={addCustomField}>
                    <PlusCircle className="w-4 h-4 mr-1" /> Add Field
                  </Button>
                </div>
                <div className="grid gap-3">
                  {customFields.map((field, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_1fr_auto] gap-3 items-center border p-3 rounded-lg"
                    >
                      <Input
                        placeholder="Label"
                        value={field.label}
                        onChange={(e) =>
                          updateCustomField(index, "label", e.target.value)
                        }
                      />
                      <Input
                        placeholder="Key"
                        value={field.key}
                        onChange={(e) =>
                          updateCustomField(index, "key", e.target.value)
                        }
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(val) =>
                            updateCustomField(index, "required", val)
                          }
                        />
                        <span>Required</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCustomField(index)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Message */}
              <div>
                <Label htmlFor="successMessage">Success Message</Label>
                <Textarea
                  id="successMessage"
                  value={successMessage}
                  className="mt-2"
                  onChange={(e) => setSuccessMessage(e.target.value)}
                />
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="mb-2">Success CTA</Label>
                  <Select value={successCTA} onValueChange={setSuccessCTA}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select CTA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="link">External Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>CTA Destination</Label>
                  <Input
                    placeholder="https://wa.me/919876543210"
                    className="mt-2"
                    value={successCTADestination}
                    onChange={(e) =>
                      setSuccessCTADestination(e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Form Name */}
              <div>
                <Label htmlFor="formName">Form Name*</Label>
                <Input
                  id="formName"
                  placeholder="e.g. website_lead_form"
                  value={formName}
                  className="mt-2"
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>

              <CardFooter className="flex justify-end gap-3 mt-4 p-0">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Create Form
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* RIGHT SIDE: Live Preview */}
      <div className="sticky top-6">
        <Card className="border border-muted shadow-sm">
          {headerImage && (
            <img
              src={headerImage}
              alt="Form header"
              className="w-full h-40 object-cover rounded-t-xl"
            />
          )}
          <CardHeader>
            <CardTitle>{formTitle || "Form Title Preview"}</CardTitle>
            <CardDescription>
              {formDescription || "Form description will appear here."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {formFields.name && <Input placeholder="Name" disabled />}
              {formFields.phoneNumber && <Input placeholder="Phone Number" disabled />}
              {formFields.email && <Input placeholder="Email" disabled />}
              {formFields.message && <Textarea placeholder="Message" disabled />}
              {customFields.map((f, i) => (
                <Input key={i} placeholder={f.label || "Custom Field"} disabled />
              ))}
              <Button className="w-full mt-2" disabled>
                Submit
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
