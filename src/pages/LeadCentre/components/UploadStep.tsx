import { FileText, Users } from 'lucide-react';
import { useRef } from 'react'

const UploadStep = ({ selectedFile, setSelectedFile }: { selectedFile: any, setSelectedFile: any }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Validate CSV
        if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
            alert("Please select a CSV file only.");
            return;
        }

        setSelectedFile(file);
        console.log("Selected File:", file);
    };
    return (
        <div className="flex items-center justify-center px-6 py-16">
            <div className="flex items-center gap-10">
                {/* Left Card */}
                <div className="relative flex h-100 w-95 flex-col rounded-xl border border-[#d7d9f1] bg-white px-7 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#22c55e]">
                            <FileText className="text-[#22c55e]" size={14} />
                        </div>

                        <h2 className="text-lg font-semibold text-[#111827]">
                            From File
                        </h2>
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-[15px] text-[#5c6b82]">
                            Drag and drop your file here.
                        </p>

                        <p className="my-2 text-[#5c6b82]">- or -</p>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            className="hidden"
                            onChange={handleFileChange}
                        />

                        {/* Browse Button */}

                        <button
                            onClick={handleBrowseClick}
                            className="rounded-xl bg-linear-to-b from-primary/90 to-primary px-4 py-1.5 text-white shadow-sm hover:opacity-90">
                            Browse
                        </button>
                        {/* Selected file name */}
                        {selectedFile && (
                            <p className="mt-4 text-sm text-green-600">
                                {selectedFile?.name}
                            </p>
                        )}



                        <p className="mt-10 text-sm text-[#5c6b82]">
                            Download sample file{" "}
                            <span className="cursor-pointer text-[#4f46e5]">
                                CSV
                            </span>{" "}
                            or{" "}
                            <span className="cursor-pointer text-[#4f46e5]">
                                XLSX
                            </span>
                        </p>
                    </div>

                    <div className="mt-auto text-center">
                        <p className="text-xs leading-6 text-[#5c6b82]">
                            You can import up to 5000 records through an .xls,
                            .xlsx, .vcf or .csv file. To import more than 5000
                            records at a time, use a .csv file.
                        </p>
                    </div>
                </div>

                {/* OR Divider */}
                <div className="flex flex-col items-center justify-center">
                    <div className="h-10 w-px bg-gray-300" />
                    <span className="my-3 text-[#5c6b82]">or</span>
                    <div className="h-10 w-px bg-gray-300" />
                </div>

                {/* Right Card */}
                <div className="flex h-100 w-95 flex-col rounded-xl border border-[#d7d9f1] bg-white px-7 py-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#22c55e]">
                            <Users className="text-[#22c55e]" size={16} />
                        </div>

                        <h2 className="text-lg font-semibold ">
                            From other CRMs
                        </h2>
                    </div>

                    <div className="mt-20 flex justify-center">
                        <button className="rounded-xl bg-[#2c3348] px-4 py-1.5 text-white shadow-md hover:opacity-90">
                            Kyra CRM
                        </button>
                    </div>

                    <div className="mt-16 text-center">
                        <button className="text-sm text-[#4f46e5] hover:underline">
                            Which CRM are you coming from?
                        </button>
                    </div>

                    <div className="mt-auto text-center">
                        <p className="text-xs leading-6 text-[#5c6b82]">
                            Choose a CRM from which you would like to import.
                            Importing data from other CRMs is made easy. It is
                            just a click away.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadStep