import { sourceOptions, stageOptions, statusOptions } from "@/constants";
import { Info, MessageSquareMore } from "lucide-react";
import { useState } from "react";
import { MdInfo, MdLocationOn } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

const AddLead = () => {
    const navigate = useNavigate();
    const { accountId } = useParams();
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        stage: "Intake",
        status: "Active",
        source: "",
        sourceUrl: "",
        dateAdded: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        notes: "",
        tags: [],
    });

    const handleChange = (e: any) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.name || !form.phone) {
            alert("Name and Phone are required");
            return;
        }

        try {
            setLoading(true);

            await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

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

        navigate(`/dashboard/account/${accountId}/leads`);
    };

    return (
        <div className=" bg-linear-to-b from-green-50 to-orange-50 p-6">
            <div className="mx-auto max-w-4xl">

                <div className="mb-6">

                    <h1 className="text-xl font-semibold">Add New Lead</h1>
                    <p className="text-sm">Populate the fields below to register a new potential client into the system.</p>
                </div>

                <div className="space-y-5">

                    {/* Basic Info */}
                    <div className="border bg-white p-4 rounded">
                        <h2 className="font-medium text-gray-600 mb-5 text-lg flex items-center gap-1"><Info size={18} className="-mt-0.5 text-violet-600" /> Basic Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="name" >Full Name</label>
                                <input name="name" placeholder="Full Name"
                                    className="border py-1.5 rounded px-4 bg-gray-100 outline-primary"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="email">Email</label>
                                <input name="email" placeholder="Email"
                                    className="border py-1.5 rounded px-4 bg-gray-100 outline-primary"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="countrycode">Country Code</label>
                                <input name="countrycode" placeholder="Country Code"
                                    className="border py-1.5 rounded px-4 bg-gray-100 outline-primary"
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="phone">Phone</label>
                                <input name="phone" placeholder="Phone"
                                    className="border py-1.5 rounded px-4 bg-gray-100 outline-primary"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Lead Details */}
                    <div className="bg-white p-4 border rounded">
                        <h2 className="font-medium mb-5 text-lg flex items-center gap-1 text-gray-600"><MessageSquareMore size={16} className="text-primary" /> Lead Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="stage">Stage</label>
                                <select name="stage" onChange={handleChange} className="py-2 outline-primary bg-gray-100 border px-4 rounded">
                                    {stageOptions.map((stage, index) => (
                                        <option key={index} value={stage.value}>{stage.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="status">Status</label>
                                <select name="status" onChange={handleChange} className="py-2 outline-primary bg-gray-100 border px-4 rounded">
                                    {statusOptions.map((status, index) => (
                                        <option key={index} value={status.value}>{status.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="source">Source</label>
                                <select name="source" onChange={handleChange} className="py-2 outline-primary bg-gray-100 border px-4 rounded">
                                    {sourceOptions.map((source, index) => (
                                        <option key={index} value={source.value}>{source.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="sourceurl">Source URL</label>
                                <input name="sourceurl" placeholder="Source URL" className="py-1.5 outline-primary bg-gray-100 border px-4 rounded" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="bg-white p-4 border rounded">
                        <h2 className="font-medium mb-5 flex text-lg items-center text-gray-600"><MdLocationOn size={20} className="-mt-0.5 text-second" /> Address</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="address1">Address Line 1</label>
                                <input name="address1" placeholder="Address line 1" className="py-1.5 outline-primary bg-gray-100 border px-4 rounded" onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="address2">Address Line 2</label>
                                <input name="address2" placeholder="Address line 2" className="py-1.5 outline-primary bg-gray-100 border px-4 rounded" onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="city">City</label>
                                <input name="city" placeholder="City" className="py-1.5 outline-primary bg-gray-100 border px-4 rounded" onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="state">State</label>
                                <input name="state" placeholder="State" className="py-1.5 outline-primary bg-gray-100 border px-4 rounded" onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="country">Country</label>
                                <input name="country" placeholder="Country" className="py-1.5 outline-primary bg-gray-100 border px-4 rounded" onChange={handleChange} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <label className="text-sm" htmlFor="pincode">Pincode</label>
                                <input name="pincode" placeholder="Pincode" className="py-1.5 outline-primary bg-gray-100 border px-4 rounded" onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white p-4 border rounded">
                        <h2 className="font-medium mb-5 text-lg flex items-center gap-1"><MdInfo size={20} className="-mt-0.5 text-blue-500" /> Additional Details</h2>
                        <div className="flex flex-col gap-1">
                            <label className="text-sm" htmlFor="note">Note</label>
                            <textarea name="note" placeholder="Enter the additional information" rows={6} className="py-1.5 resize-none outline-primary bg-gray-100 border px-4 rounded w-full" onChange={handleChange} />

                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <button onClick={handleCancel} className="px-4 py-2 border rounded-lg">Cancel</button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg"
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