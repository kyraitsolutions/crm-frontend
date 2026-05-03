import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";

const leads = [
    {
        name: "Christopher Maclead",
        company: "Rangoni Of Florence",
        email: "christopher@email.com",
        phone: "555-555-5555",
        source: "Cold Call",
        owner: "Abhijeet Singh",
    },
    {
        name: "Carissa Kidman",
        company: "Oh My Goodknits Inc",
        email: "carissa@email.com",
        phone: "555-555-5555",
        source: "Advertisement",
        owner: "Abhijeet Singh",
    },
];

export default function StickyTable() {
    return (
        <div className="p-4 w-full! overflow-auto!">

            {/* Scroll Wrapper */}
            <div className="overflow-x-auto rounded-xl w-full">
                ugyhfhbmn,
                {/* <Table className="">

                    <TableHeadead className="bg-gray-100 text-sm font-medium text-gray-700">
                        <tr className="whitespace-nowrap ">

                            <TableHead className="sticky left-0 z-30 bg-gray-100 border px-4 py-4 ">
                                <input type="checkbox" className="w-34 border! border-gray-600! flex justify-center" />
                            </TableHead>

                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Name</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Company</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Email</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Phone</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Source</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Owner</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Name</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Company</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Email</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Phone</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Source</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Owner</TableHead>
                        </tr>
                    </TableHeadead>

                    <tbody className="text-sm">
                        {[...Array(10)].map((_, i) => (
                            <tr key={i} className="hover:bg-gray-50">

                                <TableCell className="sticky left-0 z-20 bg-red-700 flex justify-center border px-4 py-3 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                    <input type="checkbox" className="bg-red-900" />
                                </TableCell>

                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Christopher Maclead
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Rangoni Of Florence
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    christopher@email.com
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    555-555-5555
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Cold Call
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Abhijeet Singh
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Christopher Maclead
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Rangoni Of Florence
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    christopher@email.com
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    555-555-5555
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Cold Call
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Abhijeet Singh
                                </TableCell>
                            </tr>
                        ))}
                    </tbody>

                </Table> */}

                <Table className="">
                    <TableHeader>
                        <TableRow className="border-b border-border/40">

                            <TableHead className="sticky left-0 z-30 bg-gray-100 border px-4 py-4 ">
                                <input type="checkbox" className="w-34 border! border-gray-600! flex justify-center" />
                            </TableHead>

                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Name</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Company</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Email</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Phone</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Source</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Owner</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Name</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Company</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Email</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Phone</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Source</TableHead>
                            <TableHead className="border font-medium px-4 py-3 text-left">Lead Owner</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {[...Array(10)].map((_, i) => (
                            <TableRow
                                key={i}
                                className="
                                    cursor-pointer
                                    border-b border-border/30
                                    hover:bg-[#FBFAF9]
                                    transition-colors
                                  "
                            >
                                <TableCell className="sticky left-0 z-20 bg-red-700 flex justify-center border px-4 py-3 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                    <input type="checkbox" className="bg-red-900" />
                                </TableCell>

                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Christopher Maclead
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Rangoni Of Florence
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    christopher@email.com
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    555-555-5555
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Cold Call
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Abhijeet Singh
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Christopher Maclead
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Rangoni Of Florence
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    christopher@email.com
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    555-555-5555
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Cold Call
                                </TableCell>
                                <TableCell className="border px-4 py-3 whitespace-nowrap">
                                    Abhijeet Singh
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}