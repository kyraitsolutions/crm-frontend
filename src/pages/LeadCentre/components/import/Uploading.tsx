
const Uploading = ({
    step,
    progress,
    uploadStats
}: { step: any, progress: any, uploadStats: any }) => {
    return (
        <div className="flex items-center justify-center">
            <div className="">

                {/* Header */}
                <div className="px-8 py-6 border-b">
                    <h2 className="text-base font-semibold text-slate-900">
                        Importing Leads
                    </h2>

                    <p className="text-gray-500 text-sm">
                        Please keep this page open while we import your contacts.
                    </p>
                </div>

                {/* Body */}
                <div className="p-8">

                    {/* Percentage */}
                    <div className="flex justify-between mb-2">
                        <span className="font-semibold text-sm text-gray-700">
                            Upload Progress
                        </span>

                        <span className="font-semibold text-blue-600">
                            {progress.toFixed(0)}%
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
                        <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{
                                width: `${progress}%`
                            }}
                        />
                    </div>

                    {/* Current Status */}
                    <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4 flex items-center gap-3">

                        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />

                        <div>
                            <p className="font-semibold text-sm text-gray-800">
                                Uploading chunk {uploadStats.currentChunk} of{" "}
                                {uploadStats.totalChunks}
                            </p>

                            <p className="text-sm text-gray-500">
                                {uploadStats.status}
                            </p>
                        </div>

                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">

                        <div className="border rounded-xl p-4 text-center">
                            <p className="text-gray-500 text-sm">
                                Total
                            </p>

                            <h3 className="text-2xl font-bold">
                                {uploadStats.total}
                            </h3>
                        </div>

                        <div className="border rounded-xl p-4 text-center">
                            <p className="text-gray-500 text-sm">
                                Uploaded
                            </p>

                            <h3 className="text-2xl font-bold text-green-600">
                                {uploadStats.uploaded}
                            </h3>
                        </div>

                        <div className="border rounded-xl p-4 text-center">
                            <p className="text-gray-500 text-sm">
                                Failed
                            </p>

                            <h3 className="text-2xl font-bold text-red-500">
                                {uploadStats.failed}
                            </h3>
                        </div>

                        <div className="border rounded-xl p-4 text-center">
                            <p className="text-gray-500 text-sm">
                                Remaining
                            </p>

                            <h3 className="text-2xl font-bold text-orange-500">
                                {uploadStats.total -
                                    uploadStats.uploaded -
                                    uploadStats.failed}
                            </h3>
                        </div>

                    </div>

                    {/* Current File Status */}
                    <div className="mt-8 border rounded-xl p-5 bg-gray-50">

                        <div className="flex justify-between mb-2">
                            <span className="text-gray-600">
                                Processing Leads
                            </span>

                            <span className="font-semibold">
                                {uploadStats.uploaded + uploadStats.failed} / {uploadStats.total}
                            </span>
                        </div>

                        <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-full bg-green-500 transition-all duration-300"
                                style={{
                                    width: `${progress}%`
                                }}
                            />
                        </div>

                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-end">

                        <button
                            className="rounded-xl border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Uploading