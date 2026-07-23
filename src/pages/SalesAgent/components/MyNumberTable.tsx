import DataLoader from '@/components/Loader/data-loader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CALL_PATHS } from '@/constants/routes/call.path';
import { useAuthStore } from '@/stores';
import { ArrowRight, BookUser } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';

const MyNumberTable = ({ myNumbers, loading }: any) => {
    const navigate = useNavigate()
    const { accountId } = useAuthStore((state) => state);
    if (loading) {
        return <DataLoader />
    }
    if (myNumbers.length <= 0) {
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
                        Please puchase a new{" "}
                        <Link
                            to={CALL_PATHS.getPurchaseNumberList(String(accountId))}
                            className="text-blue-600 underline flex items-center gap-1"
                        >
                            {" "}
                            number
                        </Link>
                    </p>
                </div>
            </div>
        </div>;
    }
    return (
        <div className='px-5'>
            <div className='flex justify-between items-center py-4'>
                <h1 className='text-sm font-semibold'>Active Number</h1>
                <Button className='rounded-xl'>
                    Buy a number <ArrowRight />
                </Button>
            </div>
            <Table className="border-b rounded-xl overflow-hidden">
                <TableHeader className="bg-muted/30 ">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-white bg-primary p-3">
                            #
                        </TableHead>
                        {["Friendly Name", "Phone Number", "Voice", "SMS", "MMS", "Action"].map((header) => (
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
                    {myNumbers?.map((number: any, index: any) => (
                        <TableRow
                            key={number.numberSid}
                            onClick={() =>
                                navigate(CALL_PATHS.getMyNumberDetails(String(accountId), number?.sid))
                            }
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
                                    <h3 className="font-">{number?.friendlyName}</h3>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{number?.phoneNumber}</h3>
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
                                    <h3 className="font-">{number?.status}</h3>
                                </div>
                            </TableCell>
                            {/* <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{number?.isoCountry}</h3>
                                    <Button onClick={() => purchaseNumber(number.phoneNumber)} className='py-2! text-xs! rounded-xl bg-primary/20 border border-primary text-primary font-semibold hover:text-white transition-all duration-200'>
                                        Buy Now
                                    </Button>
                                </div>
                            </TableCell> */}


                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}

export default MyNumberTable