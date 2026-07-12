import { ChevronDown } from 'lucide-react';
import { useState } from 'react'
import Navhandle from './Navhandle';

const UniquekeyStep = ({ step, setStep, handleStep }: { step: number, setStep: any, handleStep: any }) => {
    const [actionType, setActionType] = useState("new");
    const [uniqueKey, setUniqueKey] = useState("");

    return (
        <div className='flex flex-col gap-20 w-fit'>
            <div className="border border-gray-200 w-fit mt-20 ml-20 bg-white p-5 rounded-xl flex flex-col gap-4">
                <h2 className="text-md text-[#111827]">
                    What do you want to do with the records in the file?
                </h2>

                <div className="bg-white flex flex-col gap-4">
                    {/* Radio Options */}
                    <div className="flex flex-wrap items-center gap-4">
                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="recordType"
                                checked={actionType === "new"}
                                onChange={() => setActionType("new")}
                                className="h-4 w-4"
                            />
                            <span className="text-sm text-[#1f2937]">
                                Add as new Leads
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="recordType"
                                checked={actionType === "update"}
                                onChange={() => setActionType("update")}
                                className="h-4 w-4"
                            />
                            <span className="text-sm text-[#1f2937]">
                                Update existing Leads only
                            </span>
                        </label>

                        <label className="flex cursor-pointer items-center gap-2">
                            <input
                                type="radio"
                                name="recordType"
                                checked={actionType === "both"}
                                onChange={() => setActionType("both")}
                                className="h-4 w-4"
                            />
                            <span className="text-sm text-[#1f2937]">
                                Both
                            </span>
                        </label>
                    </div>

                    {/* Unique Key Selection */}
                    <div className="inline-flex items-center  justify-between rounded-md  border-[#d8deeb]  py-2">
                        <p className="mr-4 text-[16px] text-[#374151]">
                            Select unique key
                        </p>

                        <div className="relative">
                            <select
                                value={uniqueKey}
                                onChange={(e) => setUniqueKey(e.target.value)}
                                className="min-w-[180px] appearance-none rounded-md border border-gray-300 bg-white px-2 py-1 pr-10 text-sm text-[#1f2937] outline-none focus:border-[#4f46e5]"
                            >
                                <option value="">--Select--</option>
                                <option value="email">Email</option>
                                <option value="phone">Phone</option>
                                <option value="leadId">Lead ID</option>
                            </select>

                            <ChevronDown
                                size={18}
                                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />
                        </div>
                    </div>

                    {/* Info Text */}
                    {uniqueKey && (
                        <p className="mt-4 text-xs text-[#5c6b82]">
                            Duplicate leads will be checked using{" "}
                            <span className="font-semibold capitalize">
                                {uniqueKey}
                            </span>
                        </p>
                    )}
                </div>

            </div>

            <Navhandle step={step} isSelected={uniqueKey} handleStep={handleStep} />

        </div>

    )
}

export default UniquekeyStep