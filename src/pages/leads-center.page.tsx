import { FilterDropdown, type Option } from "@/components/filter-dropdown";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
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
  statusOptions,
  WEBSOCKET_EVENTS,
  WEBSOCKET_URL,
} from "@/constants";
import useDebounce from "@/hooks/useDebounce";
import { usePagination } from "@/hooks/usePagination";
import { LeadService } from "@/services/lead.service";
import { LeadsStoreManager, useLeadsStore } from "@/stores/leads.store";
import buildParams from "@/utils/build-params.utils";
import { formatDate } from "@/utils/date-utils";
import {
  ArrowUpDown,
  Bell,
  ChevronDown,
  Download,
  Filter,
  Info,
  LayoutList,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Table2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

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
}

export default function LeadsCentre() {
  // Params
  const { accountId } = useParams();

  // Websocket ref
  const wsRef = useRef<WebSocketClient | null>(null);

  // Stores for leads
  const leadStoreManager = new LeadsStoreManager();
  const { leads: allLeads } = useLeadsStore((state) => state);

  // Leads related states and services stores etc
  const leadService = new LeadService();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);

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
  const [note, setNote] = useState(selectedLead?.notes);

  const handleRowClick = (lead: Lead) => {
    // console.log("Lead:", lead)
    // alert("hdk")
    setSelectedLead(lead);
    setIsSheetOpen(true);
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
        source: filters.source.value,
        assignedTo: filters.assignedTo.value,
        campaign: filters.campaign.value,
        form: filters.form.value,
        dateRange: filters.date.value,
        label: filters.label.value,
        lead: filters.lead.value,
        read: filters.read.value,
      };

      const params = buildParams(allFilters, pageIndex, rowPerPage);
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

  // Auto refresh on filter change
  useEffect(() => {
    getLeads();
  }, [selectedLead, currentPageNumber, filters, debouncedSearchQuery]);

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
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
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

        <div className="flex-1 max-w-md mb-6">
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
        </div>

        <div className="mb-6 flex items-center gap-2">
          <Button variant="outline" size="sm">
            Add new stage
          </Button>

          <Button variant="outline" size="sm">
            Bulk edit
          </Button>

          {showFilters && (
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
                label={filters.label.label}
                options={labelOptions}
                allLabel="All Labels"
                onSelect={(value) =>
                  setFilters((prev) => ({ ...prev, label: value }))
                }
              />

              {(filters.status.value ||
                filters.source.value ||
                filters.assignedTo.value ||
                filters.stage.value) && (
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
          )}
        </div>

        <div className="mb-6 flex items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">Intake leads:</span>
            {/* <span className="text-muted-foreground">{intakeLeads}</span> */}
            <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
              <Info className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">Converted leads:</span>
            {/* <span className="text-muted-foreground">{convertedLeads}</span> */}
            <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
              <Info className="h-3 w-3" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-primary">Conversion rate:</span>
            {/* <span className="text-muted-foreground">{conversionRate}%</span> */}
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
                        className="h-auto p-0 text-foreground hover:text-primary"
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
                        <Badge variant="secondary" className="font-normal">
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
        <SheetContent className="w-[500px] !max-w-[450px] px-4 sm:w-[450px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                {selectedLead?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xl font-semibold text-foreground capitalize">
                  {selectedLead?.name}
                </div>
                <div className="text-sm font-normal text-muted-foreground">
                  {selectedLead?.company}
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Contact Information
              </h3>
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Email
                  </div>
                  <div className="text-sm text-foreground">
                    {selectedLead?.email}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground mb-1">
                    Phone
                  </div>
                  <div className="text-sm text-foreground">
                    {selectedLead?.phone}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Lead Details
              </h3>
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">
                    Stage
                  </div>
                  <Badge variant="outline">{selectedLead?.stage}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">
                    Source
                  </div>
                  <Badge variant="secondary">
                    {selectedLead?.source?.name}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">
                    Source URL
                  </div>
                  <Badge variant="secondary">
                    {selectedLead?.source?.url
                      ? selectedLead.source.url.slice(0, 50)
                      : "-"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">
                    Status
                  </div>
                  <Badge variant="secondary">{selectedLead?.status}</Badge>
                </div>
                {/* <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Form Status</div>
                                    <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                        {selectedLead?.formStatus}
                                    </Badge>
                                </div> */}
                {/* <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Assigned to</div>
                                    <span className="text-sm text-foreground">{selectedLead?.assignedTo}</span>
                                </div> */}
                {/* <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Channel</div>
                                    <span className="text-sm text-foreground">{selectedLead?.channel}</span>
                                </div> */}
                <div className="flex items-center justify-between">
                  <div className="text-xs font-medium text-muted-foreground">
                    Date Added
                  </div>
                  <span className="text-sm text-foreground">
                    {formatDate(selectedLead?.createdAt || "")}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Other Details
              </h3>
              <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                {selectedLead?.customFields &&
                  Object.keys(selectedLead.customFields).length > 0 ? (
                  Object.entries(selectedLead.customFields).map(
                    ([key, value]) => (
                      <div key={key} className="">
                        <div className="text-sm font-medium text-muted-foreground">
                          {key}
                        </div>
                        <div className="text-sm text-foreground">{value}</div>
                      </div>
                    )
                  )
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No additional details available.
                  </div>
                )}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">
                Notes
              </h3>
              <div className="rounded-lg border bg-muted/30">
                <textarea
                  className="text-sm text-foreground p-3 w-full bg-transparent border-0 resize-none outline-none"
                  value={note || "Add a note here"}
                  onChange={(e) => setNote(e.target.value)}
                  // readOnly
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button className="flex-1">Assign Lead</Button>
              <Button variant="outline" className="flex-1">
                Edit Details
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
