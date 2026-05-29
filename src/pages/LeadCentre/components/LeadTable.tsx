import React, { useEffect, useRef, useState, type JSX } from 'react'
import type { Option } from "@/components/filter-dropdown";
import { LeadService } from '@/services/lead.service';
import { usePagination } from '@/hooks/usePagination';
import useDebounce from '@/hooks/useDebounce';
import { LeadsStoreManager, useLeadsStore } from '@/stores/leads.store';
import { useAccountAccessStore } from '@/stores/account-access.store';
import buildParams from '@/utils/build-params.utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Clock3, Import, Mail, Phone, Shapes, Webhook } from 'lucide-react';
import { formatDate } from '@/utils/date-utils';
import { useAuthStore } from '@/stores';
import { stageOptions } from '@/constants';
import { TbManualGearbox } from 'react-icons/tb';
import { Instagram } from '@/icons/icons';
import { MdWhatsapp } from 'react-icons/md';
import { FaGoogle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { LEADS_PATHS } from '@/constants/routes/leads.path';
const LeadTable = () => {
    const navigate = useNavigate();
    const isSkeletonShow = useRef(true);
    const leadService = new LeadService();

    const [isLoadingLeads, setIsLoadingLeads] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Pagination state
    const [pageSize] = useState(10);
    const [totalItems, setTotalItems] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);


    const { accountId } = useAuthStore((state) => state)
    const leadStoreManager = new LeadsStoreManager();
    const { leads: allLeads } = useLeadsStore((state) => state);
    const { permissions } = useAccountAccessStore((state) => state);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    // Filters and search query state

    const [filters, setFilters] = useState<Record<string, Option>>({
        lead: { label: "All Leads", value: null },
        campaign: { label: "All Campaigns", value: null },
        form: { label: "All Forms", value: null },
        date: { label: "All Dates", value: null },
        status: { label: "All Status", value: null },
        source: { label: "All Sources", value: null },
        assignedTo: { label: "All Users", value: null },
        label: { label: "All Labels", value: null },
        stage: { label: "All Stages", value: null },
        read: { label: "All", value: null },
    });


    // Pagination hook
    const {
        currentPage: currentPageNumber,
        goToPage,
        totalPages,
    } = usePagination({
        totalItems: totalItems || 0,
        itemsPerPage: pageSize,
        initialPage: currentPage,
    });
    const getLeads = async () => {

        console.log("Fetching leads with filters:", filters, "and search query:", debouncedSearchQuery);
        if (isSkeletonShow.current) {
            setIsLoadingLeads(true);
            isSkeletonShow.current = false;
        }
        try {
            const pageIndex = currentPageNumber;
            const rowPerPage = pageSize;

            const allFilters = {
                q: searchQuery.trim() || undefined,
                stage: filters.stage.value,
                status: filters.status.value,
                "source.name": filters.source.value,
                assignedTo: filters.assignedTo.value,
                campaign: filters.campaign.value,
                form: filters.form.value,
                dateRange: filters.date.value,
                label: filters.label.value,
                lead: filters.lead.value,
                read: filters.read.value,
            };

            const params = buildParams(allFilters, pageIndex, rowPerPage);
            // console.log(params);
            const response = await leadService.getLeads(String(accountId), params);

            if (response.status === 200 || response.status === 201) {
                leadStoreManager.setLeads(response.data?.docs || []);
                setTotalItems(response.data?.pagination?.totalDocs);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingLeads(false);
        }
    };
    useEffect(() => {
        getLeads();
        // calculateBasicNumber()
    }, [currentPageNumber, filters, debouncedSearchQuery]);



    const getIconForSource: Record<string, JSX.Element> = {
        website: <Shapes className="size-4 text-muted-foreground" />,
        google_ads: <FaGoogle className="size-4 text-muted-foreground" />,
        whatsapp: <MdWhatsapp className="size-4 text-muted-foreground" />,
        facebook: <Shapes className="size-4 text-muted-foreground" />,
        instagram: <Instagram />,
        webform: <Shapes className="size-4 text-muted-foreground" />,
        manual: <TbManualGearbox className="size-4 text-muted-foreground" />,
        webhook: <Webhook className="size-4 text-muted-foreground" />,
        import: <Import className="size-4 text-muted-foreground" />,
    };
    return (
        <div className="overlead-hidden hide-scrollbar bg-white rounded-xl">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-white bg-primary p-3">
                            #
                        </TableHead>
                        {[
                            "Date added",
                            "Name",
                            "Phone",
                            "Email",
                            "Stage",
                            "Source",
                            "Status",
                            "Last Activity",
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

                <TableBody>
                    {allLeads?.map((lead, index) => (
                        <TableRow
                            key={lead._id}
                            onClick={() => navigate(LEADS_PATHS.getLeadDetail(String(accountId), lead._id))}
                            className="group border-b border-gray-200 transition-colors hover:bg-muted/20 odd:bg-gray-100/40"
                        >
                            <TableCell className="">
                                <p className="flex items-center gap-4">
                                    {(index + 1).toString().padStart(2, "0")}
                                </p>
                            </TableCell>
                            {/* Date added */}
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock3 className="size-4" />

                                    {formatDate(lead.createdAt)}
                                </div>
                            </TableCell>
                            {/* lead Name*/}

                            <TableCell className="">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-7 items-center justify-center text-primary rounded-2xl border bg-primary/10">
                                        {/* nb <Worklead className="size-4 text-primary" /> */}
                                        {lead.name?.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-semibold">
                                            {lead.name}
                                        </h3>

                                        <p className=" truncate text-xs text-muted-foreground">
                                            {lead.message?.slice(0, 50) || "No message"}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            {/* Phone */}
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <Phone className="size-4 text-primary" />
                                    <h3 className="font-semibold">
                                        {lead.phone}
                                    </h3>
                                </div>
                            </TableCell>

                            {/* Email */}
                            <TableCell className="">
                                <div className="flex items-center gap-2">
                                    <Mail className="size-4 text-primary" />
                                    <h3 className="font-medium">
                                        {lead.email}
                                    </h3>
                                </div>
                            </TableCell>

                            {/* STATUS */}
                            <TableCell>
                                <Select
                                    value={lead.stage}
                                //   onValueChange={(value: TChatleadStatus) =>
                                //     handleStatusChange(lead.id, value)
                                //   }
                                >
                                    <SelectTrigger className="border-none shadow-none">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {stageOptions.map((stage) => (
                                            <SelectItem
                                                key={stage.value}
                                                value={stage.value}
                                                className="capitalize"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Badge
                                                        variant={stage.value === 'converted' ? 'default' : stage.value === "intake" ? 'destructive' : 'ternary'}
                                                        className="capitalize border-none rounded-2xl px-2 text-xs"
                                                    >
                                                        {stage.label}
                                                    </Badge>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </TableCell>

                            {/* stage */}
                            <TableCell>
                                <div className="flex items-center gap-2 capitalize font-medium">
                                    {getIconForSource[lead.source?.name || ""] || <Shapes className="size-4 text-muted-foreground" />}

                                    {lead.source?.name || "Unknown"}
                                </div>
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                                <div className="flex items-center gap-2  capitalize font-medium">
                                    {/* <GitBranch className="size-4 text-muted-foreground" /> */}

                                    {lead.status || "Unknown"}
                                </div>
                            </TableCell>

                            {/* Last Activity */}
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock3 className="size-4" />

                                    {formatDate(lead.updatedAt)}
                                </div>
                            </TableCell>

                            {/* ACTIONS */}
                            {/* <TableCell>
                                <div className="flex justify-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="opacity-60 transition-opacity group-hover:opacity-100"
                                            >
                                                <MoreHorizontal className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end" className="rounded-xl">
                                            <DropdownMenuItem
                                                className="cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/dashboard/settings/chatleads/${lead.id}/lead-builder`,
                                                    )
                                                }
                                            >
                                                <Pencil className="mr-2 size-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                className="cursor-pointer text-red-500 focus:text-red-500"
                                                onClick={() => handleDeletelead(lead.id)}
                                            >
                                                <Trash2 className="mr-2 size-4" />
                                                Delet
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default LeadTable