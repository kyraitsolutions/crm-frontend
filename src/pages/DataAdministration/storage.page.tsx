import React, { useState } from "react";

export default function Storage() {
    const [tab, setTab] = useState("data");

    return (
        <div className="p-6 bg-white min-h-screen text-gray-900!">
            {/* Tabs */}
            <div className="flex gap-6 border-b mb-6 text-sm font-medium">
                <button onClick={() => setTab("data")} className={`pb-2 ${tab === "data" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-800"}`}>
                    Data Storage
                </button>
                <button onClick={() => setTab("file")} className={`pb-2 ${tab === "file" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-800"}`}>
                    File Storage
                </button>
                <button onClick={() => setTab("email")} className={`pb-2 ${tab === "email" ? "border-b-2 border-blue-600 text-blue-600 font-medium" : "text-gray-800"}`}>
                    Email Storage
                </button>
            </div>

            {/* ================= DATA STORAGE ================= */}
            {tab === "data" && (
                <div>
                    <p className="text-sm mb-6 font-medium">
                        Displaying the total data storage space used by the organization.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 font-medium">
                        <div className="col-span-2 p-5 rounded-xl border bg-gray-50/10">
                            <div className="flex items-center gap-2 text-sm  mb-2">
                                <span className="font-semibold">4932 Records available</span>
                                <span className="text-gray-500">of 5000 Records</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                                <div className="bg-green-600 h-3 rounded-full" style={{ width: "98%" }} />
                            </div>

                            <div className="flex justify-between text-xs ">
                                <span>0 Records</span>
                                <span>5000 Records</span>
                            </div>

                            <p className="text-xs  mt-2">Updated On 17/04/2026</p>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 p-5 rounded-xl text-sm flex justify-between items-center">
                            <span>You can free up to 23 Records (Approx)</span>
                            <button className="text-blue-600 font-medium">Show</button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border">
                        <div className="p-4 border-b text-sm font-semibold">Usage Details</div>
                        <table className="w-full text-sm font-medium">
                            <thead className="bg-gray-50 text-gray-800">
                                <tr>
                                    <th className="text-left font-medium p-3">Module Name</th>
                                    <th className="text-left font-medium p-3">Record Count</th>
                                    <th className="text-left font-medium p-3">Storage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[{ name: "Tasks", count: 12, size: "24 KB" }].map((row, i) => (
                                    <tr key={i} className="border-t hover:bg-gray-50">
                                        <td className="p-3 text-blue-600">{row.name}</td>
                                        <td className="p-3">{row.count}</td>
                                        <td className="p-3">{row.size}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ================= EMAIL STORAGE ================= */}
            {tab === "email" && (
                <>
                    <h2 className="text-lg font-semibold mb-2">Email Storage</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        View and manage storage space taken up by emails.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Left Card */}
                        <div className="bg-white border rounded-xl p-5">
                            <p className="text-sm font-medium mb-4">Storage Details</p>

                            {/* Circle */}
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-40 h-40 rounded-full border-[12px] border-blue-200 flex items-center justify-center">
                                    <span className="text-sm text-center">0 KB of 3 GB<br />Used</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full" />Active Users</span>
                                    <span>0 KB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-red-400 rounded-full" />Inactive Users</span>
                                    <span>0 KB</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="flex items-center gap-2"><span className="w-2 h-2 bg-blue-200 rounded-full" />Available Space</span>
                                    <span>3 GB</span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-400 mt-4">Last Modified On 13/04/2026</p>
                        </div>

                        {/* Right Table */}
                        <div className="md:col-span-2 bg-white border rounded-xl">
                            <div className="p-4 border-b flex justify-between items-center">
                                <span className="text-sm font-medium">User usage details</span>
                                <input className="border rounded px-2 py-1 text-sm" placeholder="Search" />
                            </div>

                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-gray-800">
                                    <tr>
                                        <th className="text-left p-3  font-medium!">All Users</th>
                                        <th className="text-left p-3  font-medium!">Roles</th>
                                        <th className="text-left p-3  font-medium!">All Configurations</th>
                                        <th className="text-right p-3  font-medium!">Used Space</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="p-3 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full">A</div>
                                            Abhijeet Singh
                                        </td>
                                        <td className="p-3">CEO</td>
                                        <td className="p-3 text-gray-600">Not Configured</td>
                                        <td className="p-3 text-right">0 KB</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="p-3 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full">A</div>
                                            Abhijeet Singh
                                        </td>
                                        <td className="p-3">CEO</td>
                                        <td className="p-3 text-gray-600">Not Configured</td>
                                        <td className="p-3 text-right">0 KB</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="p-3 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full">A</div>
                                            Abhijeet Singh
                                        </td>
                                        <td className="p-3">CEO</td>
                                        <td className="p-3 text-gray-600">Not Configured</td>
                                        <td className="p-3 text-right">0 KB</td>
                                    </tr>
                                    <tr className="border-t">
                                        <td className="p-3 flex items-center gap-3">
                                            <div className="w-8 h-8 bg-orange-500 text-white flex items-center justify-center rounded-full">A</div>
                                            Abhijeet Singh
                                        </td>
                                        <td className="p-3">CEO</td>
                                        <td className="p-3 text-gray-600">Not Configured</td>
                                        <td className="p-3 text-right">0 KB</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
