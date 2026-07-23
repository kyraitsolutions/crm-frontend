import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { stageOptions } from '@/constants';
import { timeAgo } from '@/utils/date.utils';
import { ArrowDownLeft, ArrowUpRight, BookUser, CirclePlay, Clock3, Phone } from 'lucide-react';
import { formatCallDuration } from '../utils/call.util';

const CallTable = () => {

    const getCorrectStatus = (status: string | undefined) => {
        switch (status) {
            case "completed":
                return {
                    icon: <Phone className="size-4 text-green-600 rotate-270" />,
                    value: "Call was successful"
                };
            case "busy":
                return {
                    icon: <Phone className="size-4 text-orange-600 rotate-270" />,
                    value: "Client unanswered"
                };
            case "missed":
                return {
                    icon: <Phone className="size-4 text-yellow-500 rotate-270" />,
                    value: "No agent answered"
                };;
            default:
                return status || "Unknown status";
        }
    };
    const handleStatusChange = (sid: any, value: any) => {
        console.log("Changed", sid, value);
    }

    return (
        <div className=" bg-white rounded-xl! px-5!">

            {/* <Table className="border-b rounded-xl! overflow-hidden">
                <TableHeader className="bg-muted/30 ">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-white bg-primary p-3">
                            #
                        </TableHead>
                        {[
                            "From",
                            "To",
                            "Direction",
                            "Date added",
                            "Outcome",
                            "Call Duration",
                            "Stage",
                        ].map((header) => (
                            <TableHead
                                key={header}
                                className="text-xs font-semibold uppercase tracking-wide text-white bg-primary p-3"
                            >
                                {header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody className=''>
                    {allLogs?.map((call, index) => (
                        <TableRow
                            key={call.CallSid}
                            //   onClick={() =>
                            //     navigate(callS_PATHS.getcallDetail(String(accountId), call.id))
                            //   }
                            className="group border-b  border-gray-50 transition-colors hover:bg-gray-100 odd:bg-gray-100/50"
                        >
                            <TableCell className="">
                                <p className="flex items-center gap-4">
                                    {(index + 1).toString().padStart(2, "0")}
                                </p>
                            </TableCell>


                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{call?.From}</h3>
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <BookUser className="size-4 text-primary" />
                                    <h3 className="font-">{call?.To}</h3>
                                </div>
                            </TableCell>

                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    {
                                        call?.Direction === "outbound-api" ? (
                                            <div className="flex items-center gap-2 text-blue-600">
                                                <ArrowDownLeft className="h-4 w-4" />
                                                <span>Incoming</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <ArrowUpRight className="h-4 w-4" />
                                                <span>Outgoing</span>
                                            </div>
                                        )
                                    }
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock3 className="size-4" />

                                    {timeAgo(call.Timestamp)}
                                </div>
                            </TableCell>
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    {getCorrectStatus(call?.CallStatus)?.icon}
                                    <h3 className="font-medium">{getCorrectStatus(call?.CallStatus)?.value}</h3>
                                </div>
                            </TableCell>

                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <CirclePlay className="size-4 text-primary" />
                                    <h3 className="font-medium">{formatCallDuration(Number(call?.RecordingDuration || 0))}</h3>
                                </div>
                            </TableCell>

                            <TableCell onClick={(e) => e.stopPropagation()}>
                                <Select
                                    value={stageOptions[0].value}
                                    onValueChange={(value: any) =>
                                        handleStatusChange(call.CallSid, value)
                                    }
                                >
                                    <SelectTrigger className="border-none shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {stageOptions?.map((stage) => (
                                            <SelectItem
                                                key={stage.label}
                                                value={stage.value}
                                                className="capitalize"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className={`capitalize border-none rounded-2xl bg-gray-500 px-2 text-xs py-0.5 text-white`}
                                                    // style={{ background: stage.color }}
                                                    >
                                                        {stage.label}
                                                    </div>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table> */}

            {/* <div className="px-5">
                <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={(page) => {
                    setCurrentPage(page);
                }}
                />
            </div> */}
        </div>
    )
}

export default CallTable