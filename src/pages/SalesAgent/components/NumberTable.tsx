import DataLoader from '@/components/Loader/data-loader';
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useAuthStore } from '@/stores';
import { BookUser } from 'lucide-react'
import { Link } from 'react-router-dom';
import { callService } from '../services/call.service';

const NumberTable = ({ numbers, loading }: any) => {

    const { accountId } = useAuthStore((state) => state)
    const purchaseNumber = async (number: string) => {
        try {
            console.log(number);
            const response = await callService.purchaseNumber(String(accountId), number);
            console.log(response)
        } catch (error) {
            console.log(error);
        }
    }


    if (loading) {
        return <DataLoader />
    }
    if (numbers.length <= 0) {
        return <div className="h-[50dvh] flex justify-center items-center">
            <div className="flex w-full items-center justify-center">
                <div className="flex flex-col justify-center items-center text-center">
                    <img
                        src="/converted_image_transparent.png"
                        rel="preload"
                        fetchPriority="high"
                        alt="No chats yet"
                        className="w-75 object-cover "
                    />
                    <h3 className="text-sm font-semibold text-gray-800">No number found</h3>

                    <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                        Start looking for another{" "}
                        <Link
                            to="#"
                            className="text-blue-600 underline flex items-center gap-1"
                        >
                            {" "}
                            country
                        </Link>
                    </p>
                </div>
            </div>
        </div>;
    }

    return (
        <div>
            <Table className="border-b rounded-xl overflow-hidden">
                <TableHeader className="bg-muted/30 ">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-white bg-primary p-3">
                            #
                        </TableHead>
                        {["Phone Number", "Friendly Name", "Voice", "SMS", "MMS", "Country Code", "Action"].map((header) => (
                            <TableHead
                                key={header}
                                className="text-xs font-semibold uppercase tracking-wide text-white bg-primary p-3"
                            >
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {numbers?.map((number: any, index: any) => (
                        <TableRow
                            key={index}
                            //   onClick={() =>
                            //     navigate(numberS_PATHS.getnumberDetail(String(accountId), number.id))
                            //   }
                            className="group border-b  border-gray-50 transition-colors hover:bg-gray-100 odd:bg-gray-100/50"
                        >
                            <TableCell className="">
                                <p className="flex items-center gap-4">
                                    {(index + 1).toString().padStart(2, "0")}
                                </p>
                            </TableCell>

                            {/* number Name*/}

                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{number?.phoneNumber}</h3>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{number?.friendlyName}</h3>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{number?.capabilities.voice ? "true" : "false"}</h3>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{number?.capabilities.SMS ? "true" : "false"}</h3>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{number?.capabilities.MMS ? "true" : "false"}</h3>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{number?.isoCountry}</h3>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    {/* <BookUser className="size-4 text-primary" /> */}
                                    {/* <h3 className="font-">{number?.isoCountry}</h3> */}
                                    <Button onClick={() => purchaseNumber(number.phoneNumber)} className='py-2! text-xs! rounded-xl bg-primary/20 border border-primary text-primary font-semibold hover:text-white transition-all duration-200'>
                                        Buy Now
                                    </Button>
                                </div>
                            </TableCell>


                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}

export default NumberTable