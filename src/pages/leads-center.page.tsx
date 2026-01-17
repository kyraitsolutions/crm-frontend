import AILeadSummary from "@/components/common/AILeadSummary";
import { PillFilterDropdown } from "@/components/common/FilterDropdown";
import type { Option } from "@/components/filter-dropdown";
import Loader from "@/components/Loader";
import { AddActivityModal } from "@/components/modal/AddActivityModal";
import { Pagination } from "@/components/pagination";
import { TableSkeleton } from "@/components/skeltons/TableSkeltons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import WebSocketClient from "@/config/websocketClient";
import {
  dateOptions,
  formOptions,
  labelOptions,
  sourceOptions,
  stageOptions,
  statusOptions,
  WEBSOCKET_EVENTS,
  WEBSOCKET_URL,
} from "@/constants";
import useDebounce from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { ToastMessageService } from "@/services";
import { LeadService } from "@/services/lead.service";
import { LeadsStoreManager, useLeadsStore } from "@/stores/leads.store";
import type { ApiError, BasicNumber, ILead } from "@/types";
import buildParams from "@/utils/build-params.utils";
import { formatDate, formatTime } from "@/utils/date-utils";

import {
  Flame, Clock, IndianRupee, CheckCircle,
  ArrowUpDown,
  Bell,
  ChevronDown,
  FileText,
  Filter,
  Info,
  MessageCircle,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Settings,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

export type ActivitySource =
  | "phone_call"
  | "message"
  | "note"
  | "email"
  | "whatsapp";

export interface TimelineItem {
  id: string;
  activitySource: ActivitySource;
  message: string;
  attachment: string | null;
  createdAt: string; // ISO string from server
  createdBy: string; // userId (string for now)
}

const timelineConfig = {
  phone_call: {
    icon: Phone,
    bg: "bg-purple-500",
  },
  message: {
    icon: MessageCircle,
    bg: "bg-fuchsia-500",
  },
  note: {
    icon: FileText,
    bg: "bg-indigo-500",
  },
  whatsapp: {
    icon: Settings,
    bg: "bg-gray-500",
  },
  user: {
    icon: UserPlus,
    bg: "bg-gray-600",
  },
};

export default function LeadsCentre() {
  // Params
  const { accountId } = useParams();

  // Websocket ref
  const wsRef = useRef<WebSocketClient | null>(null);

  const toastMessageService = new ToastMessageService();

  // Stores for leads
  const leadStoreManager = new LeadsStoreManager();
  const { leads: allLeads } = useLeadsStore((state) => state);

  // Leads related states and services stores etc
  const leadService = new LeadService();
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedLead, setSelectedLead] = useState<ILead | null>(null);
  const [editableLead, setEditableLead] = useState<ILead | null>(null);
  const [isEditingLoading, setIsEditingLoading] = useState(false);

  const isSkeletonShow = useRef(true);

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
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  // Pagination state
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [basicNumber, setBasicNumber] = useState<BasicNumber>({
    intakeLeads: 0,
    convertedLeads: 0,
    qualifiedLeads: 0,
    conversionRate: 0,
  });

  // Activity
  const [isAddActivityOpen, setIsAddActivityOpen] = useState(false);

  const calculateBasicNumber = (leads: ILead[]) => {
    const stats = leads.reduce(
      (acc, lead) => {
        if (lead.stage === "qualified") {
          acc.qualifiedLeads += 1;
        } else if (lead.stage === "converted") {
          acc.convertedLeads += 1;
        } else {
          acc.intakeLeads += 1;
        }

        return acc;
      },
      {
        intakeLeads: 0,
        convertedLeads: 0,
        qualifiedLeads: 0,
        conversionRate: 0,
      }
    );

    // calculate conversion rate
    const totalLeads =
      stats.intakeLeads + stats.qualifiedLeads + stats.convertedLeads;
    stats.conversionRate =
      totalLeads === 0
        ? 0
        : Math.round((stats.convertedLeads / totalLeads) * 100);

    setBasicNumber(stats);
  };

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

  const handleRowClick = (lead: ILead) => {
    setIsEditing(false);
    setSelectedLead(lead);
    setEditableLead(lead);
    setIsSheetOpen(true);
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setEditableLead(selectedLead);
    setIsEditing(false);
  };

  const handleSave = async (activity?: Omit<TimelineItem, "id">) => {
    if (!editableLead) return;

    setIsEditingLoading(true);

    const rollback = leadStoreManager.updateLeadOptimistic(editableLead);

    // TODO: Your API call — updateLead(editableLead)
    try {
      const payLoad = {
        ...editableLead,
        ...(activity && { notes: [...(editableLead?.notes || []), activity] }),
      };
      leadStoreManager.updateLead(payLoad);
      const response = await leadService.updateLead(accountId!, payLoad!);

      if (response.status === 200) {
        setIsEditing(false);

        toastMessageService.success(
          response.message || "Your request was processed successfully"
        );
      }
    } catch (error) {
      const err = error as ApiError;
      if (err) {
        rollback();
        toastMessageService.error(err.message);
      }
    } finally {
      setIsEditingLoading(false);
      setIsSheetOpen(false);
    }
  };

  // const clearFilters = () => {
  //   setSearchQuery("");
  //   // setSelectedCampaign("All Campaigns");
  //   // setSelectedForm("All Forms");
  //   // setSelectedDate("Select dates");
  //   // setSelectedStatus("All Status");
  //   // setSelectedSource("All Sources");
  //   // setSelectedAssignedTo("All Users");
  //   // setSelectedLabel("All Labels");
  //   // setSelectedStageFilter("All");
  //   // setSelectedReadFilter("All");
  //   // setCurrentPage(1);
  // };

  const getLeads = async () => {
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
        calculateBasicNumber(response.data?.docs);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  // Auto refresh on filter change
  useEffect(() => {
    getLeads();
    // calculateBasicNumber()
  }, [currentPageNumber, filters, debouncedSearchQuery]);

  // Websocket connection
  useEffect(() => {
    wsRef.current = new WebSocketClient(
      `${WEBSOCKET_URL}?accountId=${accountId}`
    );

    wsRef.current.connect((serverResponse) => {
      if (serverResponse.event === WEBSOCKET_EVENTS["Chatbot Lead Created"]) {
        if (serverResponse.data?.lead?.accountId !== accountId) return;
        leadStoreManager.setLeadsTop(serverResponse.data?.lead);

        if (Notification.permission === "granted") {
          new Notification("New Lead", {
            body: "A new lead has been created",
          });
        }
      } else if (
        serverResponse.event === WEBSOCKET_EVENTS["Chatbot Lead Updated"]
      ) {
        // console.log(serverResponse);
        if (serverResponse.data?.lead?.accountId !== accountId) return;

        if (selectedLead?._id === serverResponse.data?.lead?._id) {
          setEditableLead((prev) => ({
            ...prev,
            ...serverResponse.data?.lead,
            email: serverResponse.data?.lead?.email,
          }));
        }
        leadStoreManager.updateLead(serverResponse.data?.lead);
      }
    });

    return () => {
      wsRef.current?.close();
    };
  }, [allLeads, selectedLead]);

  // console.log(basicNumber);


  console.log(selectedLead);



  return (
    <div className=" bg-background">
      <div className="flex max-sm:flex-col  sm:items-center justify-between px-6 py-6">
        <div>
          <h1 className="md:text-2xl font-medium text-[#37322F]">
            Leads Centre
          </h1>
          <p className="text-sm text-[#847971] mt-1">
            Manage and track your leads
          </p>
        </div>

        <div className="flex whitespace-normal items-center gap-6">
          {/* Audience filter */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                      flex items-center gap-2
                        rounded-[99px]
                        px-4 py-2
                        text-sm font-medium
                        bg-[#FBFAF9]
                        text-[#37322F]
                        shadow-none
                        transition
          "
              >
                <Users className="h-4 w-4 text-[#847971]" />
                Audiences
                <ChevronDown className="h-4 w-4 text-[#847971]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="mt-2
                    rounded-xl
                    border-none
                    bg-[#FBFAF9]
                    p-1
                    shadow-lg"
            >
              <DropdownMenuItem>All Audiences</DropdownMenuItem>
              <DropdownMenuItem>Team A</DropdownMenuItem>
              <DropdownMenuItem>Team B</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Icon actions (subtle) */}
          {/* <button className="text-[#847971] hover:text-[#37322F] transition">
            <Download className="h-4 w-4" />
          </button> */}
          <button className="text-[#847971] hover:text-[#37322F] transition">
            <Bell className="h-4 w-4" />
          </button>
          {/* <button className="text-[#847971] hover:text-[#37322F] transition">
            <Settings className="h-4 w-4" />
          </button> */}

          {/* Primary action */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="
                flex items-center gap-2
                whitespace-nowrap
                rounded-[99px]
                bg-[#37322F]
                px-4 py-2
                text-sm font-medium
                text-[#FBFAF9]
                shadow-[0px_2px_4px_rgba(55,50,47,0.12)]
                hover:bg-[#2e2a28]
                transition
              "
              >
                <Plus className="h-4 w-4" />
                Add leads
                <ChevronDown className="h-4 w-4 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-lg">
              <DropdownMenuItem>Add single lead</DropdownMenuItem>
              <DropdownMenuItem>Import leads</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Overflow */}
          {/* <button className="text-[#847971] hover:text-[#37322F] transition">
            <MoreVertical className="h-4 w-4" />
          </button> */}
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6 flex items-center justify-between gap-6">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search leads…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="
                w-full
                bg-transparent
                border-b
                border-[rgba(50,45,43,0.20)]
                py-2 pr-8
                text-sm
                text-[#37322F]
                placeholder:text-[#847971]
                focus:outline-none
                focus:border-[#37322F]
                transition
              "
            />

            {/* Right icon */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {searchQuery ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="text-[#847971] hover:text-[#37322F] transition"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : (
                <Search className="h-4 w-4 text-[#847971]" />
              )}
            </div>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="
              flex items-center gap-2
              whitespace-nowrap
              text-sm font-medium
              text-[#37322F]
              hover:text-[#1f1c1a]
              transition
            "
          >
            <Filter className="h-4 w-4 text-[#847971]" />
            {showFilters ? "Hide filters" : "Show filters"}
          </button>
        </div>

        {showFilters && (
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-3">
              <PillFilterDropdown
                label={filters.form.label}
                options={formOptions}
                allLabel="All Forms"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, form: value }))
                }
              />

              <PillFilterDropdown
                label={filters.date.label}
                options={dateOptions}
                allLabel="All Dates"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, date: value }))
                }
              />

              <PillFilterDropdown
                label={filters.status.label}
                options={statusOptions}
                allLabel="All Status"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              />

              <PillFilterDropdown
                label={filters.source.label}
                options={sourceOptions}
                allLabel="All Sources"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, source: value }))
                }
              />

              <PillFilterDropdown
                label={filters.stage.label}
                options={stageOptions}
                allLabel="All Stages"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, stage: value }))
                }
              />

              <PillFilterDropdown
                label={filters.label.label}
                options={labelOptions}
                allLabel="All Labels"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, label: value }))
                }
              />

              {/* Clear filters */}
              {(filters.form.value ||
                filters.date.value ||
                filters.status.value ||
                filters.source.value ||
                filters.assignedTo.value ||
                filters.stage.value ||
                filters.label.value) && (
                  <button
                    onClick={() =>
                      setFilters({
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
                      })
                    }
                    className="
            flex items-center gap-1
            text-sm font-medium
            text-[#847971]
            hover:text-[#37322F]
            transition
          "
                  >
                    <X className="h-4 w-4" />
                    Clear
                  </button>
                )}
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-medium text-[#37322F]">Intake</span>
            <span className="text-[#847971]">{basicNumber.intakeLeads}</span>
            <Info className="h-3.5 w-3.5 text-[#A8A29E] hover:text-[#37322F] transition cursor-help" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-[#37322F]">Qualified</span>
            <span className="text-[#847971]">{basicNumber.qualifiedLeads}</span>
            <Info className="h-3.5 w-3.5 text-[#A8A29E] hover:text-[#37322F] transition cursor-help" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-[#37322F]">Converted</span>
            <span className="text-[#847971]">{basicNumber.convertedLeads}</span>
            <Info className="h-3.5 w-3.5 text-[#A8A29E] hover:text-[#37322F] transition cursor-help" />
          </div>

          <div className="flex items-center gap-2">
            <span className="font-medium text-[#37322F]">Conversion rate</span>
            <span className="text-[#847971]">
              {basicNumber.conversionRate}%
            </span>
            <Info className="h-3.5 w-3.5 text-[#A8A29E] hover:text-[#37322F] transition cursor-help" />
          </div>

          <div className="ml-auto">
            <button
              className="
        text-sm font-medium
        text-[#37322F]
        hover:underline
        underline-offset-4
        transition
      "
            >
              View all
            </button>
          </div>
        </div>

        {/* {filteredLeads.length > 0 && (
          <div className="mb-4 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
            >
              <span className="mr-2">✓</span>
              {filteredLeads.length}{" "}
              {filteredLeads.length === 1 ? "lead" : "leads"} found
            </Badge>
            {searchQuery && (
              <Badge variant="outline" className="text-xs">
                Searching: "{searchQuery}"
              </Badge>
            )}
          </div>
        )} */}

        {/* {filteredLeads.length === 0 && (
          <div className="mb-4 flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-muted text-muted-foreground"
            >
              No leads found matching your criteria
            </Badge>
          </div>
        )} */}

        <div className="rounded-lg border bg-card shadow-sm">
          <div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-3">
            <Button
              variant="ghost"
              size="sm"
            // className={
            //   selectedStageFilter.label === "All"
            //     ? "bg-accent text-accent-foreground"
            //     : ""
            // }
            // onClick={() =>
            //   setSelectedStageFilter({ label: "All", value: "" })
            // }
            >
              All
            </Button>
            <Button
              variant="ghost"
              size="sm"
            // className={
            //   selectedReadFilter.label === "Unread"
            //     ? "bg-accent text-accent-foreground"
            //     : ""
            // }
            // onClick={() =>
            //   setSelectedReadFilter(
            //     selectedReadFilter.label === "Unread"
            //       ? { label: "All", value: "all" }
            //       : { label: "Unread", value: "unread" }
            //   )
            // }
            >
              Unread
            </Button>
            {/* {uniqueStages.map((stage) => {
              const count = filteredLeads.filter(
                (l) => l.stage === stage
              ).length;
              return (
                <div key={stage} className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      selectedStageFilter === stage
                        ? "bg-accent text-accent-foreground"
                        : ""
                    }
                    onClick={() =>
                      setSelectedStageFilter(
                        selectedStageFilter === stage ? "All" : stage
                      )
                    }
                  >
                    {stage}
                  </Button>
                  <Badge variant="secondary" className="font-medium">
                    {count}
                  </Badge>
                  {stage !== "Converted" && (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              );
            })} */}
            <div className="ml-auto">
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Table className="">
            <TableHeader>
              <TableRow className="border-b border-border/40">
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>

                {[
                  "Date added",
                  "Name",
                  "Phone",
                  "Email",
                  "Stage",
                  "Source",
                  "Status",
                ].map((label) => (
                  <TableHead
                    key={label}
                    className="text-sm font-medium text-[#847971]"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="
                      h-auto p-0
                      font-medium
                      text-[#847971]
                      hover:text-[#37322F]
                      "
                    >
                      {label}
                      <ArrowUpDown className="ml-1.5 h-3 w-3 opacity-50" />
                    </Button>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoadingLeads ? (
                <TableSkeleton rows={9} />
              ) : allLeads && allLeads.length > 0 ? (
                allLeads.map((lead: any) => (
                  <TableRow
                    key={lead.id}
                    onClick={() => handleRowClick(lead)}
                    className="
                    cursor-pointer
                    border-b border-border/30
                    hover:bg-[#FBFAF9]
                    transition-colors
                  "
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox />
                    </TableCell>

                    <TableCell className="text-sm text-[#9A948E]">
                      {formatDate(lead.createdAt)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className="
                          flex h-8 w-8 items-center justify-center
                          rounded-full
                          bg-[#37322F]/10
                          text-xs font-medium
                          text-[#37322F]
                        "
                        >
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-[#37322F] capitalize">
                          {lead.name.slice(0, 20)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-[#37322F]">
                      {lead.phone}
                    </TableCell>

                    <TableCell className="text-[#37322F]">
                      {lead.email}
                    </TableCell>

                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="
                        h-auto p-0
                        text-[#37322F]
                        hover:text-[#2e2a28]
                        capitalize
                      "
                      >
                        {lead.stage}
                        <ChevronDown className="ml-1 h-3 w-3 opacity-60" />
                      </Button>
                    </TableCell>

                    <TableCell>
                      <Badge
                        className="
                          rounded-full
                          bg-[#F4F3F2]
                          px-3 py-0.5
                          text-xs
                          font-normal
                          text-[#37322F]
                        "
                      >
                        {lead.source.name}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          className="
                            w-fit rounded-full
                            bg-[#F4F3F2]
                            px-3 py-0.5
                            text-xs
                            font-normal
                            text-[#37322F]
                          "
                        >
                          {lead.status}
                        </Badge>

                        <Badge
                          className="
                          w-fit rounded-full
                          bg-green-50
                          px-3 py-0.5
                          text-xs
                          font-normal
                          text-green-700
                        "
                        >
                          {lead.formStatus}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="py-10 text-center text-sm text-muted-foreground"
                  >
                    No leads found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPageNumber}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="
            w-full md:max-w-xl
            px-8 pb-2
            overflow-y-auto
            bg-[#FBFAF9]
          "
        >
          <AILeadSummary leadId={selectedLead?._id} />
          {/* HEADER */}
          <SheetHeader className="pb-6 border-b border-[rgba(50,45,43,0.12)]">
            <SheetTitle className="flex items-center gap-4">
              <div
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-full
                  bg-[#37322F]/10
                  text-xl font-semibold
                  text-[#37322F]
                "
              >
                {editableLead?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-xl font-medium text-[#37322F] capitalize">
                  {editableLead?.name.slice(0, 30)}
                </h1>
                <p className="text-sm text-[#847971]">Lead profile</p>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-5 space-y-10">
            {/* CONTACT INFO */}
            <section>
              <h3 className="text-sm font-medium text-[#37322F] mb-4">
                Contact Information
              </h3>

              <div className="grid gap-6">
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wide text-[#847971] font-medium">
                    Email
                  </label>

                  {isEditing ? (
                    <Input
                      value={editableLead?.email}
                      className="
                  bg-[#F7F6F4]
                  border-none
                  rounded-lg
                  focus-visible:ring-0
                  text-[#37322F]
                "
                      onChange={(e) =>
                        setEditableLead((prev) =>
                          prev ? { ...prev, email: e.target.value } : prev
                        )
                      }
                    />
                  ) : (
                    <Link
                      to={`mailto:${editableLead?.email}`}
                      className="text-sm text-[#37322F]"
                    >
                      {editableLead?.email}
                    </Link>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wide text-[#847971] font-medium">
                    Phone
                  </label>

                  {isEditing ? (
                    <Input
                      value={editableLead?.phone}
                      className="
                  bg-[#F7F6F4]
                  border-none
                  rounded-lg
                  focus-visible:ring-0
                  text-[#37322F]
                "
                      onChange={(e) =>
                        setEditableLead((prev) =>
                          prev ? { ...prev, phone: e.target.value } : prev
                        )
                      }
                    />
                  ) : (
                    <Link
                      target="_blank"
                      to={`https://wa.me/${editableLead?.phone}?text=hello`}
                      className="text-sm text-[#37322F]"
                    >
                      {editableLead?.phone}
                    </Link>
                  )}
                </div>
              </div>
            </section>

            {/* LEAD DETAILS */}
            <section>
              <h3 className="text-sm font-medium text-[#37322F] mb-4">
                Lead Details
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Stage */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wide text-[#847971] font-medium">
                    Stage
                  </label>

                  {isEditing ? (
                    <Select
                      value={editableLead?.stage}
                      onValueChange={(v) =>
                        setEditableLead((prev) =>
                          prev ? { ...prev, stage: v } : prev
                        )
                      }
                    >
                      <SelectTrigger className="bg-[#F7F6F4] border-none rounded-lg">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake">Intake</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className="
                  w-fit rounded-full
                  bg-[#37322F]/10
                  text-[#37322F]
                  capitalize
                "
                    >
                      {editableLead?.stage}
                    </Badge>
                  )}
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wide text-[#847971] font-medium">
                    Status
                  </label>

                  {isEditing ? (
                    <Select
                      value={editableLead?.status}
                      onValueChange={(v) =>
                        setEditableLead((prev) =>
                          prev ? { ...prev, status: v } : prev
                        )
                      }
                    >
                      <SelectTrigger className="bg-[#F7F6F4] border-none rounded-lg">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge
                      className="
                  w-fit rounded-full
                  bg-[#37322F]/10
                  text-[#37322F]
                  capitalize
                "
                    >
                      {editableLead?.status}
                    </Badge>
                  )}
                </div>

                {/* Source */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wide text-[#847971] font-medium">
                    Source
                  </label>
                  <p className="text-sm text-[#37322F]">
                    {editableLead?.source?.name || "-"}
                  </p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wide text-[#847971] font-medium">
                    Source URL
                  </label>
                  <p className="text-sm text-[#37322F]">
                    {editableLead?.source?.name || "-"}
                  </p>
                </div>

                {/* Date */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs uppercase tracking-wide text-[#847971] font-medium">
                    Date Added
                  </label>
                  <p className="text-sm text-[#37322F]">
                    {formatDate(editableLead?.createdAt || "")}
                  </p>
                </div>
              </div>
            </section>

            {/* OTHER DETAILS */}
            <section>
              <h3 className="text-sm font-medium text-[#37322F] mb-4">
                Other Details
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {editableLead?.customFields &&
                  Object.keys(editableLead.customFields).length > 0 ? (
                  Object.entries(editableLead.customFields).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-xs uppercase tracking-wide text-[#847971] font-medium">
                          {key}
                        </label>

                        {isEditing ? (
                          <Input
                            value={value as string}
                            className="
                      bg-[#F7F6F4]
                      border-none
                      rounded-lg
                      focus-visible:ring-0
                      text-[#37322F]
                    "
                            onChange={(e) =>
                              setEditableLead((prev) =>
                                prev
                                  ? {
                                    ...prev,
                                    customFields: {
                                      ...(prev.customFields ?? {}),
                                      [key]: e.target.value,
                                    },
                                  }
                                  : prev
                              )
                            }
                          />
                        ) : (
                          <p className="text-sm text-[#37322F]">{value}</p>
                        )}
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-[#847971]">
                    No additional details available.
                  </p>
                )}
              </div>
            </section>

            {/* NOTES */}
            <section>
              <h3 className="text-sm font-medium text-[#37322F] mb-4">Notes</h3>

              <div className="max-h-96 py-4 overflow-auto hide-scrollbar">
                <div className="relative space-y-6">
                  {/* add activity button */}

                  <div className="flex items-center gap-3.5">
                    <Button
                      variant="outline"
                      className="rounded-full size-10 border-gray-400"
                      onClick={() => setIsAddActivityOpen(true)}
                    >
                      <span className="text-lg">+</span>
                    </Button>

                    <p className="text-primary">Add Activity</p>
                  </div>

                  {/* timeline  */}
                  <Timeline items={editableLead?.notes || []} />

                  {/* vertical line */}
                  {editableLead?.notes && editableLead?.notes.length > 0 && (
                    <div className="absolute top-0 left-[18px] w-0.5 h-[90%] bg-gray-400 -z-10" />
                  )}

                  <AddActivityModal
                    open={isAddActivityOpen}
                    onClose={() => setIsAddActivityOpen(false)}
                    onSave={(activity) => {
                      setEditableLead((prev) =>
                        prev
                          ? {
                            ...prev,
                            notes: [...(prev.notes || []), activity],
                          }
                          : prev
                      );
                      handleSave(activity);
                    }}
                  />
                </div>
              </div>
            </section>

            {/* ACTIONS */}
            <div className="flex items-center gap-3">
              {!isEditing ? (
                <>
                  <Button className="flex-1 rounded-[99px] bg-[#37322F] text-[#FBFAF9]">
                    Assign Lead
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-[99px]"
                    onClick={handleEdit}
                  >
                    Edit Details
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    disabled={isEditingLoading}
                    className="flex-1 rounded-[99px] bg-[#37322F] text-[#FBFAF9]"
                    onClick={() => handleSave()}
                  >
                    Save {isEditingLoading && <Loader />}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-[99px]"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

const Timeline = ({ items }: { items: TimelineItem[] }) => {
  // if (items.length === 0)
  //   return (
  //     <div>
  //       <p className="text-gray-500 text-center">No activity found</p>
  //     </div>
  //   );
  return (
    <div className="space-y-8">
      {items && items.map((item) => {
        const Icon =
          timelineConfig[item.activitySource as keyof typeof timelineConfig]
            .icon;

        return (
          <div key={item.id} className="relative flex gap-4">
            {/* icon */}
            <div
              className={`
                relative z-10
                flex h-9 w-9 items-center justify-center
                rounded-full text-white
                ${timelineConfig[
                  item.activitySource as keyof typeof timelineConfig
                ]?.bg
                }
              `}
            >
              <Icon size={16} />
            </div>

            {/* content */}
            <div className="flex-1">
              <p className="text-xs text-[#847971] mb-1">
                {formatDate(item.createdAt)} {formatTime(item.createdAt)}
              </p>

              {/* <p className="text-sm font-medium text-[#37322F]">{item.}</p> */}

              {item.message && (
                <p className="text-sm text-[#847971] mt-1">{item.message}</p>
              )}
            </div>
          </div>
        );
      }).reverse()}
    </div>
  );
};




