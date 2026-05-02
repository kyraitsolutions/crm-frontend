const Data = () => {
    return (
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
    )
}

export default Data