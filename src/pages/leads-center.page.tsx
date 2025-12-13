import { FilterDropdown, type Option } from "@/components/filter-dropdown";
import Loader from "@/components/Loader";
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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import type { ApiError, BasicNumber } from "@/types";
import buildParams from "@/utils/build-params.utils";
import { formatDate } from "@/utils/date-utils";
import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  Download,
  Filter,
  Info,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

interface Lead {
  id: string;
  dateAdded: string;
  name: string;
  initials: string;
  stage: string;
  source: {
    name: string;
    url: string;
  };
  assignedTo: string;
  channel: string;
  status: string;
  formStatus: string;
  email: string;
  phone: string;
  company: string;
  notes: string;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

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
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [editableLead, setEditableLead] = useState<Lead | null>(null);
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
  })

  const calculateBasicNumber = (leads: any) => {

    console.log("Yaha leads aaya hia", allLeads)
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
    const totalLeads = stats.intakeLeads + stats.qualifiedLeads + stats.convertedLeads;
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

  // Note
  const [note, setNote] = useState("");

  const handleRowClick = (lead: Lead) => {
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

  const handleSave = async () => {
    if (!editableLead) return;

    setIsEditingLoading(true);

    const rollback = leadStoreManager.updateLeadOptimistic(editableLead);

    // TODO: Your API call — updateLead(editableLead)
    try {
      const payLoad = {
        ...editableLead,
        ...(note && { notes: [{ message: note, createdAt: new Date() }] }),
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
      console.log(params)
      const response = await leadService.getLeads(String(accountId), params);

      if (response.status === 200 || response.status === 201) {
        leadStoreManager.setLeads(response.data?.docs || []);
        setTotalItems(response.data?.pagination?.totalDocs);
        calculateBasicNumber(response.data?.docs)

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
        if (serverResponse.data?.lead?.accountId !== accountId) return;

        if (selectedLead && selectedLead.id === serverResponse.data?.lead?.id) {
          setSelectedLead(serverResponse.data?.lead);
        }
        leadStoreManager.updateLead(serverResponse.data?.lead);
      }
    });

    return () => {
      wsRef.current?.close();
    };
  }, [allLeads]);

  const inputClean = `
  outline-none ring-0 focus:ring-0 focus-visible:ring-0 
  focus:outline-none focus-visible:outline-none 
  shadow-none focus:border focus-visible:border-gray-300`;


  console.log(basicNumber)
  return (
    <div className=" bg-background">
      <div className="border-b bg-card shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Leads Centre
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track your leads
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Audiences
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>All Audiences</DropdownMenuItem>
                <DropdownMenuItem>Team A</DropdownMenuItem>
                <DropdownMenuItem>Team B</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add leads
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Add single lead</DropdownMenuItem>
                <DropdownMenuItem>Import leads</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="mb-6 flex items-center justify-between gap-2">
          {/*<div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <LayoutList className="h-4 w-4" />
              Pipeline view
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 bg-accent text-accent-foreground"
            >
              <Table2 className="h-4 w-4" />
              Table view
            </Button>
          </div>
          */}
          {/* <Button variant="outline" size="sm">
            Add new stage
          </Button> */}

          {/* <Button variant="outline" size="sm">
            Bulk edit
          </Button> */}
          <InputGroup>
            <InputGroupInput
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <InputGroupAddon align="inline-end">
              {searchQuery ? (
                <InputGroupButton
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                >
                  <X className="h-3 w-3" />
                </InputGroupButton>
              ) : (
                <Search className="h-4 w-4" />
              )}
            </InputGroupAddon>
          </InputGroup>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide filters" : "Show filters"}
          </Button>
        </div>



        {showFilters && (
          <div className="mb-6 flex items-center gap-2">

            <div className="flex items-center gap-2">
              <FilterDropdown
                label={filters.form.label}
                options={formOptions}
                allLabel="All Forms"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, form: value }))
                }
              />

              <FilterDropdown
                label={filters.date.label}
                options={dateOptions}
                allLabel="All Dates"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, date: value }))
                }
              />

              <FilterDropdown
                label={filters.status.label}
                options={statusOptions}
                allLabel="All Status"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, status: value }))
                }
              />

              <FilterDropdown
                label={filters.source.label}
                options={sourceOptions}
                allLabel="All Sources"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, source: value }))
                }
              />
              <FilterDropdown
                label={filters.stage.label}
                options={stageOptions}
                allLabel="All Stages"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, stage: value }))
                }
              />

              <FilterDropdown
                label={filters.label.label}
                options={labelOptions}
                allLabel="All Labels"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, label: value }))
                }
              />

              {(filters.form.value || filters.date.value || filters.status.value ||
                filters.source.value ||
                filters.assignedTo.value ||
                filters.stage.value ||
                filters.label.value) && (
                  <Button
                    variant="ghost"
                    size="sm"
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
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
            </div>
          </div>

        )}

        <div className="mb-6 flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">Intake:</span>
            <span className="text-muted-foreground">{basicNumber.intakeLeads}</span>
            <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
              <Info className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">Qualified:</span>
            <span className="text-muted-foreground">{basicNumber.qualifiedLeads}</span>
            <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
              <Info className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">Converted:</span>
            <span className="text-muted-foreground">{basicNumber.convertedLeads}</span>
            <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
              <Info className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">Conversion rate:</span>
            <span className="text-muted-foreground">{basicNumber.conversionRate}%</span>
            <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
              <Info className="h-3 w-3" />
            </div>
          </div>
          <div className="ml-auto">
            <button className="text-sm text-primary hover:underline transition-colors">
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox />
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-medium text-foreground hover:text-primary"
                  >
                    Date added
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-medium text-foreground hover:text-primary"
                  >
                    Name
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-medium text-foreground hover:text-primary"
                  >
                    Phone
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-medium text-foreground hover:text-primary"
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-medium text-foreground hover:text-primary"
                  >
                    Stage
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-medium text-foreground hover:text-primary"
                  >
                    Source
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                {/* <TableHead>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Assigned to
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead> */}
                {/* <TableHead>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Channel
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead> */}
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 font-medium text-foreground hover:text-primary"
                  >
                    Status
                    <ArrowUpDown className="ml-2 h-3 w-3" />
                  </Button>
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Reminder
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoadingLeads ? (
                <TableSkeleton rows={9} />
              ) : allLeads && allLeads?.length > 0 ? (
                allLeads?.map((lead: any) => (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer hover:bg-accent/50 transition-colors"
                    onClick={() => handleRowClick(lead)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox />
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(lead.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-foreground capitalize">
                          {lead.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground capitalize">
                        {lead.phone}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-foreground">
                        {lead.email}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 text-foreground hover:text-primary capitalize"
                      >
                        {lead.stage}
                        <ChevronDown className="ml-1 h-3 w-3" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="font-normal capitalize"
                      >
                        {lead.source.name}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1.5">
                        <Badge variant="secondary" className="font-normal capitalize">
                          {lead.status}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="block w-fit bg-green-50 text-green-700 hover:bg-green-100 border-green-200"
                        >
                          {lead.formStatus}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center py-8 text-muted-foreground"
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
        <SheetContent className="px-6 md:max-w-xl w-full overflow-y-auto bg-gray-100">
          <SheetHeader className="pb-4 border-b">
            <SheetTitle className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
                {editableLead?.name?.charAt(0).toUpperCase()}
              </div>

              <div>
                <h1 className="text-xl font-semibold text-foreground capitalize">
                  {editableLead?.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {editableLead?.company || "No company added"}
                </p>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-8">
            {/* CONTACT INFO */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Contact Information
              </h3>

              <div className="grid grid-cols-1 gap-4 rounded-lg border bg-muted/30 p-4">
                {/* Email */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Email
                  </label>

                  {isEditing ? (
                    <Input
                      value={editableLead?.email}
                      className={inputClean}
                      onChange={(e) =>
                        setEditableLead((prev) =>
                          prev ? { ...prev, email: e.target.value } : prev
                        )
                      }
                    />
                  ) : (
                    <Link to={`mailto:${editableLead?.email}`} className="text-sm text-foreground">
                      {editableLead?.email}
                    </Link>
                  )}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Phone
                  </label>

                  {isEditing ? (
                    <Input
                      value={editableLead?.phone}
                      className={inputClean}
                      onChange={(e) =>
                        setEditableLead((prev) =>
                          prev ? { ...prev, phone: e.target.value } : prev
                        )
                      }
                    />
                  ) : (
                    <Link target="_blank" to={`https://wa.me/${editableLead?.phone}?text=hello`} className="text-sm text-foreground">
                      {editableLead?.phone}
                    </Link>
                  )}
                </div>
              </div>
            </section>

            {/* LEAD DETAILS */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Lead Details
              </h3>

              <div className="grid grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
                {/* Stage */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intake">Intake</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="converted">Converted</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="outline" className="capitalize">{editableLead?.stage}</Badge>
                  )}
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
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
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge variant="secondary" className="capitalize">{editableLead?.status}</Badge>
                  )}
                </div>

                {/* Source */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Source
                  </label>
                  <Badge variant="secondary" className="capitalize">
                    {editableLead?.source?.name}
                  </Badge>
                </div>

                {/* Source URL */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-muted-foreground font-medium">
                    Source URL
                  </label>
                  <Badge variant="secondary">
                    {editableLead?.source?.url || "-"}
                  </Badge>
                </div>

                {/* Date Added */}
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-xs text-muted-foreground font-medium">
                    Date Added
                  </label>
                  <p className="text-sm">
                    {formatDate(editableLead?.createdAt || "")}
                  </p>
                </div>
              </div>
            </section>

            {/* OTHER DETAILS */}
            <section>
              <h3 className="text-sm font-semibold text-foreground mb-3">
                Other Details
              </h3>

              <div className="space-y-4 rounded-lg border bg-muted/30 p-4 overflow-y-scroll max-h-72 grid grid-cols-2 gap-2">
                {editableLead?.customFields &&
                  Object.keys(editableLead.customFields).length > 0 ? (
                  Object.entries(editableLead.customFields).map(
                    ([key, value]) => (
                      <div key={key} className="flex flex-col gap-1">
                        <label className="text-xs text-muted-foreground font-medium">
                          {key}
                        </label>

                        {isEditing ? (
                          <Input
                            value={value as string}
                            className={inputClean}
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
                          <p className="text-sm">{value}</p>
                        )}
                      </div>
                    )
                  )
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No additional details available.
                  </p>
                )}
              </div>
            </section>

            {/* NOTES */}
            <section>
              <h3 className="text-sm font-semibold mb-3 text-foreground">
                Notes
              </h3>
              <div className="rounded-lg border bg-muted/30">
                {isEditing ? (
                  <textarea
                    className="text-sm text-foreground p-3 w-full bg-transparent border-0 resize-none outline-none"
                    rows={4}
                    value={editableLead?.notes[0] || ""}
                    onChange={(e) => setNote(e.target.value)}
                  />
                ) : (
                  <textarea
                    rows={4}
                    readOnly
                    className="text-sm text-foreground p-3 w-full bg-transparent border-0 resize-none outline-none"
                  >
                    {note}
                  </textarea>
                )}
              </div>

              {/* {note && (
                <Button onClick={handleSave} className="mt-2">
                  Save
                </Button>
              )} */}
            </section>

            {/* ACTION BUTTONS */}
            <div className="flex items-center gap-3 pt-2 sticky bottom-0 bg-white pb-4">
              {!isEditing ? (
                <>
                  <Button className="flex-1">Assign Lead</Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleEdit}
                  >
                    Edit Details
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    disabled={isEditingLoading}
                    className="flex-1"
                    onClick={handleSave}
                  >
                    Save {isEditingLoading && <Loader />}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
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
