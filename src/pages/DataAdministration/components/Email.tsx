const Email = () => {
    return (
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
                        <div className="w-40 h-40 rounded-full border-12 border-blue-200 flex items-center justify-center">
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
    )
}

export default Email