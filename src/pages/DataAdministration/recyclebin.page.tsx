import React from 'react'

const Recyclebin = () => {
    return (
        <div className='p-4'>
            <h2 className="text-lg font-semibold mb-2">Recycle Bin</h2>
            <p className="text-sm text-gray-600 mb-4">
                The Recycle Bin displays all the records deleted in your CRM account.
            </p>

            <div className="bg-white rounded-xl p-5 mb-4">
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1 mb-4">
                    <li>After records are deleted, they will be stored for 60 days.</li>
                    <li>Only admins can permanently delete records.</li>
                    <li>Users can restore their own records.</li>
                </ul>

                <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                        <button className="px-4 py-1.5 text-sm bg-blue-100 text-blue-600 rounded">Restore</button>
                        <button className="px-4 py-1.5 text-sm bg-red-100 text-red-600 rounded">Delete</button>
                    </div>

                    <button className="px-4 py-1.5 text-sm border border-red-300 text-red-600 rounded">
                        Empty Recycle Bin
                    </button>
                </div>
                <div className="bg-white border rounded-xl mt-2">
                    <div className="flex justify-between p-4 text-sm text-gray-500 border-b">
                        <span>Displaying 1 to 4 of 4</span>
                        <span>🔍</span>
                    </div>

                    <table className="w-full text-sm ">
                        <thead className="bg-gray-50 text-gray-800">
                            <tr>
                                <th className="p-3"><input type="checkbox" /></th>
                                <th className="text-left p-3 font-medium!">Name</th>
                                <th className="text-left p-3 font-medium!">Type</th>
                                <th className="text-left p-3 font-medium!">Deleted By</th>
                                <th className="text-left p-3 font-medium!">Deleted Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {["Test", "Take 20% offer", "Requirement gathering"].map((name, i) => (
                                <tr key={i} className="border-t hover:bg-gray-50">
                                    <td className="p-3"><input type="checkbox" /></td>
                                    <td className="p-3">{name}</td>
                                    <td className="p-3">Emails</td>
                                    <td className="p-3">Harriet Nicholson</td>
                                    <td className="p-3">09/05/2023 03:14 PM</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Recyclebin