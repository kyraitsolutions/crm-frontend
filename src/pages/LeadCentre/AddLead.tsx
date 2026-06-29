import { sourceOptions, statusOptions } from "@/constants";
import { ChevronLeft, Info, MessageSquareMore, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MdInfo, MdLocationOn } from "react-icons/md";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonWithTitle from "@/components/ui/Buttons/ButtonWithTitle";
import { useConfigurationStore } from "../Settings/configuration/store/configuration.store";
import { useLeadsStore } from "./store/lead.store";


const suggestedTags = [
  "Hot Lead",
  "Cold Lead",
  "VIP",
  "Returning",
  "Follow Up",
  "High Priority",
  "Interested",
  "Not Interested",
  "Demo Booked",
  "WhatsApp",
];
const AddLead = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { accountId } = useParams();
  const [loading, setLoading] = useState(false);
  const { addLead } = useLeadsStore((state) => state);
  const { getConfigurations, configurationItems, activeTab } = useConfigurationStore(
    (state) => state,
  );
  const [tagInput, setTagInput] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "",
    mobile: "",
    title: "",
    company: "",
    message: "",
    description: "",
    website: "",
    stage: "new",
    status: "active",
    source: "manual",
    sourceUrl: "",
    address: "",
    city: "",
    state: "",
    country: "",
    tags: [] as string[],
  });

  const [customFields, setCustomFields] = useState([
    { key: "", value: "" },
  ]);



  const handleCustomFieldChange = (index: number, field: "key" | "value", value: string) => {
    setCustomFields((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const addCustomField = () => {
    setCustomFields((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeCustomField = (index: number) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();

    if (!trimmedTag) return;

    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(trimmedTag)
        ? prev.tags
        : [...prev.tags, trimmedTag],
    }));

    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.filter(
        (tag) => tag !== tagToRemove
      ),
    }));
  };

  const handleTagKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const generatePayload = () => {
    const custom = customFields.reduce((acc, item) => {
      const key = item.key.trim().split(' ').join('_').toLowerCase();
      const value = item.value.trim();

      if (key) {
        acc[key] = value;
      }
      return acc;
    },
      {} as Record<string, string>
    );

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.countryCode + form.phone,
      mobile: form.mobile,
      title: form.title,
      company: form.company,
      message: form.message,
      description: form.description,
      website: form.website,
      stage: form.stage,
      status: form.status,
      source: {
        name: form.source || 'manual',
        url: form.sourceUrl || location.pathname,
      },
      tags: form.tags,
      address: form.address,
      city: form.city,
      state: form.state,
      country: form.country
    }

    console.log(payload)
    return {
      ...payload,
      accountId,
      customFields: custom,
    };
  };

  const handleSubmit = async () => {

    console.log(generatePayload());
    if (!form.name || !form.phone) {
      alert("Name and Phone are required");
      return;
    }

    try {
      const payload = generatePayload();
      const result = await addLead(String(accountId), payload)
      console.log(result)

      alert("Lead Created Successfully");
    } catch (err) {
      console.error(err);
      alert("Error creating lead");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    const hasChanges = Object.values(form).some((val) => val);

    if (hasChanges) {
      const confirmLeave = window.confirm("Discard changes?");
      if (!confirmLeave) return;
    }

    if (hasChanges) {
      const confirmLeave = window.confirm("Discard changes?");
      if (!confirmLeave) return;
    }

    navigate(`/dashboard/account/${accountId}/leads`);
  };

  useEffect(() => {
    getConfigurations();
  }, [activeTab]);

  return (
    <div className="bg-gray-200 p-6">
      <div className="flex items-center gap-4">
        <ButtonWithTitle onClick={() => navigate(`/dashboard/account/${accountId}/leads`)} title="Go back to leads" className="flex items-center">
          <ChevronLeft className="text-slate-600" /> Go Back
        </ButtonWithTitle>
      </div>
      <div className="mx-auto max-w-4xl">

        <div className="mb-6">

          <h1 className="text-xl font-semibold">Add New Lead</h1>
          <p className="text-sm">Populate the fields below to register a new potential client into the system.</p>
        </div>

        <div className="space-y-5">

          {/* Basic Info */}
          <div className="bg-white p-4 rounded">
            <h2 className="font-medium text-gray-600 mb-5 text-lg flex items-center gap-1"><Info size={18} className="-mt-0.5 text-violet-600" /> Basic Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="name" >Full Name <span className="text-red-500">*</span></label>
                <input name="name" placeholder="Full Name"
                  required
                  className="border py-1.5 rounded px-4 bg-gray-50 outline-primary text-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="email">Email<span className="text-red-500">*</span></label>
                <input name="email" placeholder="Email"
                  required
                  className="border py-1.5 rounded px-4 bg-gray-50 outline-primary text-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="title">Title</label>
                <input name="title" placeholder="Title"
                  className="border py-1.5 rounded px-4 bg-gray-50 outline-primary text-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="phone">Phone<span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select
                    name="countryCode"
                    value={form.countryCode}
                    onChange={handleChange}
                    required
                    className="border rounded px-3 bg-gray-50 outline-primary text-sm min-w-[90px]"
                  >
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+1">🇺🇸 +1</option>
                    <option value="+44">🇬🇧 +44</option>
                    <option value="+61">🇦🇺 +61</option>
                    <option value="+971">🇦🇪 +971</option>
                  </select>
                  <input name="phone" placeholder="Phone"
                    required
                    className="border py-1.5 w-full rounded px-4 bg-gray-50 outline-primary text-sm"
                    onChange={handleChange}
                  />
                </div>

              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="company">Company</label>
                <input name="company" placeholder="Company"
                  className="border py-1.5 rounded px-4 bg-gray-50 outline-primary text-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="website">Website</label>
                <input name="website" placeholder="Website"
                  className="border py-1.5 rounded px-4 bg-gray-50 outline-primary text-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="mobile">Whatsapp Number</label>
                <input name="mobile" placeholder="Whatsapp Number"
                  className="border py-1.5 rounded px-4 bg-gray-50 outline-primary text-sm"
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="message">Message</label>
                <input name="message" placeholder="Message"
                  className="border py-1.5 rounded px-4 bg-gray-50 outline-primary text-sm"
                  onChange={handleChange}
                />
              </div>
              <p className="flex text-xs text-red-500 font-medium!">Must select country code to enable whatspp conversation</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-medium text-lg text-gray-600">
                Custom Fields
              </h2>

              <button
                type="button"
                onClick={addCustomField}
                className="px-3 text-sm py-1 bg-primary text-white rounded"
              >
                + Add Field
              </button>
            </div>

            <div className="space-y-3">
              {customFields.map((field, index) => (
                <div
                  key={index}
                  className="flex gap-3"
                >
                  <input
                    placeholder="Key"
                    value={field.key.split(' ').join('_').toLowerCase()}
                    onChange={(e) =>
                      handleCustomFieldChange(
                        index,
                        "key",
                        e.target.value
                      )
                    }
                    className="border w-full rounded px-4 py-2 bg-gray-50 outline-primary text-sm"
                  />

                  <input
                    placeholder="Value"
                    value={field.value}
                    onChange={(e) =>
                      handleCustomFieldChange(
                        index,
                        "value",
                        e.target.value
                      )
                    }
                    className="border w-full rounded px-4 py-1 bg-gray-50 outline-primary text-sm"
                  />
                  <div className="w-20 flex items-center justify-center">
                    <Trash2
                      size={20}
                      className="text-red-500 cursor-pointer"
                      onClick={() => removeCustomField(index)}
                    />
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Lead Details */}
          <div className="bg-white p-4 rounded">
            <h2 className="font-medium mb-5 text-lg flex items-center gap-1 text-gray-600"><MessageSquareMore size={16} className="text-primary" /> Lead Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="stage">Stage</label>
                <select name="stage" onChange={handleChange} className="py-2 outline-primary text-sm bg-gray-50 border px-4 rounded">
                  {configurationItems.map((stage, index) => (
                    <option key={index} value={stage.key}>{stage.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="status">Status</label>
                <select name="status" onChange={handleChange} className="py-2 outline-primary text-sm bg-gray-50 border px-4 rounded">
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status.value}>{status.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="source">Source</label>
                <select name="source" onChange={handleChange} className="py-2 outline-primary text-sm bg-gray-50 border px-4 rounded">
                  {sourceOptions.map((source, index) => (
                    <option key={index} value={source.value}>{source.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="sourceurl">Source URL</label>
                <input name="sourceurl" placeholder="Source URL" className="py-1.5 outline-primary text-sm bg-gray-50 border px-4 rounded" onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white p-4 rounded">
            <h2 className="font-medium mb-5 flex text-lg items-center text-gray-600"><MdLocationOn size={20} className="-mt-0.5 text-second" /> Address</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="address">Address</label>
                <input name="address" placeholder="Address" className="py-1.5 outline-primary text-sm bg-gray-50 border px-4 rounded" onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="city">City</label>
                <input name="city" placeholder="City" className="py-1.5 outline-primary text-sm bg-gray-50 border px-4 rounded" onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="state">State</label>
                <input name="state" placeholder="State" className="py-1.5 outline-primary text-sm bg-gray-50 border px-4 rounded" onChange={handleChange} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm" htmlFor="country">Country</label>
                <input name="country" placeholder="Country" className="py-1.5 outline-primary text-sm bg-gray-50 border px-4 rounded" onChange={handleChange} />
              </div>
              {/* <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="pincode">Pincode</label>
                                <input name="pincode" placeholder="Pincode" className="py-1.5 outline-primary text-sm bg-gray-50 border px-4 rounded" onChange={handleChange} />
                            </div> */}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white p-4 rounded">
            <h2 className="font-medium mb-5 text-lg flex items-center gap-1"><MdInfo size={20} className="-mt-0.5 text-blue-500" /> Additional Details</h2>
            <div className="flex flex-col gap-1">
              <label className="text-sm" htmlFor="description">Description</label>
              <textarea name="description" placeholder="Enter the additional information" rows={6} className="py-1.5 resize-none outline-primary text-sm bg-gray-50 border px-4 rounded w-full" onChange={handleChange} />

            </div>
          </div>

          <div className="bg-white p-4 border rounded">
            <h2 className="font-medium mb-5 text-lg text-gray-600">
              Tags
            </h2>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {form.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                >
                  <span>{tag}</span>

                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-red-500 text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Add custom tag */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Add custom tag"
                value={tagInput}
                onChange={(e) =>
                  setTagInput(e.target.value)
                }
                onKeyDown={handleTagKeyDown}
                className="flex-1 border rounded px-4 py-2 bg-gray-100 outline-primary"
              />

              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="px-4 py-2 bg-primary text-white rounded"
              >
                Add
              </button>
            </div>

            {/* Suggested tags */}
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Suggested Tags
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestedTags.map((tag) => {
                  const isSelected =
                    form.tags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm border transition
                            ${isSelected
                          ? "bg-primary text-white border-primary"
                          : "bg-gray-100 hover:bg-gray-200"
                        }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>


          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button onClick={handleCancel} className="px-4 py-2 border rounded-xl text-sm">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-primary rounded-xl text-white text-sm"
            >
              {loading ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLead;
