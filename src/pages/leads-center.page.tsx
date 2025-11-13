import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Users,
    Download,
    Bell,
    Settings,
    Plus,
    ChevronDown,
    MoreVertical,
    ArrowUpDown,
    LayoutList,
    Table2,
    Filter,
    Info,
    Search,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    X,
} from 'lucide-react';
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from '@/components/ui/input-group';

interface Lead {
    id: string;
    dateAdded: string;
    name: string;
    initials: string;
    stage: string;
    source: string;
    assignedTo: string;
    channel: string;
    status: string;
    formStatus: string;
    email: string;
    phone: string;
    company: string;
    notes: string;
}

// Generate more leads for testing pagination
const generateLeads = (): Lead[] => {
    const names = [
        'Sanjeev Vohra', 'Suman Kumar', 'Subodh Malasi', 'Varsha Mehta', 'Nidhi Taneja', 'Sanjay Makhija',
        'Rajesh Patel', 'Priya Sharma', 'Amit Singh', 'Kavita Reddy', 'Rohit Gupta', 'Anjali Desai',
        'Vikram Joshi', 'Meera Nair', 'Arjun Kapoor', 'Divya Iyer', 'Karan Malhotra', 'Shreya Agarwal',
        'Rahul Mehta', 'Pooja Shah', 'Aditya Kumar', 'Neha Verma', 'Siddharth Rao', 'Tanvi Chawla',
        'Vivek Agarwal', 'Isha Menon', 'Kunal Shah', 'Riya Bhatt', 'Harsh Patel', 'Ananya Singh',
        'Manish Kumar', 'Sneha Reddy', 'Abhishek Sharma', 'Deepika Nair', 'Varun Iyer', 'Shruti Joshi',
        'Nikhil Gupta', 'Aishwarya Rao', 'Rohan Desai', 'Kritika Kapoor', 'Yash Malhotra', 'Sakshi Agarwal',
        'Mohit Verma', 'Ritika Chawla', 'Gaurav Mehta', 'Pallavi Shah', 'Akash Kumar', 'Swati Reddy',
    ];
    const stages = ['Intake', 'Qualified', 'Converted'];
    const sources = ['Paid', 'Organic', 'Referral', 'Social Media'];
    const assignedTo = ['Unassigned', 'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams'];
    const channels = ['Email address', 'Phone', 'Website', 'LinkedIn'];
    const statuses = ['Active', 'Inactive', 'Pending'];
    const formStatuses = ['Complete form', 'Incomplete form', 'Pending'];
    const companies = [
        'Tech Solutions Ltd', 'Digital Marketing Inc', 'Innovation Hub', 'Growth Ventures', 'Startup Labs',
        'Business Solutions', 'Cloud Services', 'Data Analytics Co', 'Software Development', 'IT Consulting',
        'E-commerce Platform', 'FinTech Solutions', 'HealthTech Inc', 'EdTech Ventures', 'Real Estate Pro',
        'Marketing Agency', 'Design Studio', 'Consulting Firm', 'Manufacturing Co', 'Retail Solutions',
    ];
    const dates = ['23 Oct', '22 Oct', '21 Oct', '20 Oct', '19 Oct', '18 Oct', '17 Oct', '16 Oct', '15 Oct', '14 Oct'];

    return names.map((name, index) => {
        const initials = name
            .split(' ')
            .map((n) => n[0])
            .join('');
        return {
            id: `lead-${index + 1}`,
            dateAdded: dates[index % dates.length],
            name,
            initials,
            stage: stages[index % stages.length],
            source: sources[index % sources.length],
            assignedTo: assignedTo[index % assignedTo.length],
            channel: channels[index % channels.length],
            status: statuses[index % statuses.length],
            formStatus: formStatuses[index % formStatuses.length],
            email: `${name.replace(/\s/g, '.').toLowerCase()}@example.com`,
            phone: `+91-98${(100000000 + index * 12345).toString().padStart(8, '0')}`,
            company: companies[index % companies.length],
            notes: `Lead note for ${name}`,
        };
    });
};

const allLeads: Lead[] = generateLeads();

export default function LeadsCentre() {
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    // Filter states
    const [selectedCampaign, setSelectedCampaign] = useState<string>('All Campaigns');
    const [selectedForm, setSelectedForm] = useState<string>('All Forms');
    const [selectedDate, setSelectedDate] = useState<string>('Select dates');
    const [selectedStatus, setSelectedStatus] = useState<string>('All Status');
    const [selectedSource, setSelectedSource] = useState<string>('All Sources');
    const [selectedAssignedTo, setSelectedAssignedTo] = useState<string>('All Users');
    const [selectedLabel, setSelectedLabel] = useState<string>('All Labels');
    const [selectedStageFilter, setSelectedStageFilter] = useState<string>('All');
    const [selectedReadFilter, setSelectedReadFilter] = useState<string>('All');

    // Get unique values for filters
    const uniqueStages = useMemo(() => Array.from(new Set(allLeads.map(l => l.stage))), []);
    const uniqueSources = useMemo(() => Array.from(new Set(allLeads.map(l => l.source))), []);
    const uniqueStatuses = useMemo(() => Array.from(new Set(allLeads.map(l => l.status))), []);
    const uniqueAssignedTo = useMemo(() => Array.from(new Set(allLeads.map(l => l.assignedTo))), []);

    // Note
    const [note, setNote] = useState(selectedLead?.notes);

    // Filter and search logic
    const filteredLeads = useMemo(() => {
        let filtered = [...allLeads];

        // Search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(lead =>
                lead.name.toLowerCase().includes(query) ||
                lead.email.toLowerCase().includes(query) ||
                lead.company.toLowerCase().includes(query) ||
                lead.phone.includes(query) ||
                lead.notes.toLowerCase().includes(query)
            );
        }

        // Stage filter
        if (selectedStageFilter !== 'All') {
            filtered = filtered.filter(lead => lead.stage === selectedStageFilter);
        }

        // Status filter
        if (selectedStatus !== 'All Status') {
            filtered = filtered.filter(lead => lead.status === selectedStatus);
        }

        // Source filter
        if (selectedSource !== 'All Sources') {
            filtered = filtered.filter(lead => lead.source === selectedSource);
        }

        // Assigned to filter
        if (selectedAssignedTo !== 'All Users') {
            filtered = filtered.filter(lead => lead.assignedTo === selectedAssignedTo);
        }

        return filtered;
    }, [searchQuery, selectedStageFilter, selectedStatus, selectedSource, selectedAssignedTo]);

    // Pagination logic
    const totalPages = Math.ceil(filteredLeads.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

    // Update page when filters change
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // Calculate stats
    const intakeLeads = useMemo(() => filteredLeads.filter(l => l.stage === 'Intake').length, [filteredLeads]);
    const convertedLeads = useMemo(() => filteredLeads.filter(l => l.stage === 'Converted').length, [filteredLeads]);
    const conversionRate = useMemo(() => {
        if (filteredLeads.length === 0) return 0;
        return ((convertedLeads / filteredLeads.length) * 100).toFixed(1);
    }, [filteredLeads.length, convertedLeads]);

    const handleRowClick = (lead: Lead) => {
        setSelectedLead(lead);
        setIsSheetOpen(true);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedCampaign('All Campaigns');
        setSelectedForm('All Forms');
        setSelectedDate('Select dates');
        setSelectedStatus('All Status');
        setSelectedSource('All Sources');
        setSelectedAssignedTo('All Users');
        setSelectedLabel('All Labels');
        setSelectedStageFilter('All');
        setSelectedReadFilter('All');
        setCurrentPage(1);
    };

    return (
        <div className=" bg-background">
            <div className="border-b bg-card shadow-sm">
                <div className="flex items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Leads Centre</h1>
                        <p className="text-sm text-muted-foreground mt-1">Manage and track your leads</p>
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
                        <Button variant="ghost" size="sm" className="gap-2 bg-accent text-accent-foreground">
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
                        {showFilters ? 'Hide filters' : 'Show filters'}
                    </Button>
                </div>

                <div className="mb-6 flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        Add new stage
                    </Button>
                    <Button variant="outline" size="sm">
                        Bulk edit
                    </Button>
                    <div className="flex-1 max-w-md">
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
                                            setSearchQuery('');
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
                    {showFilters && (
                        <div className="ml-auto flex items-center gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {selectedCampaign}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSelectedCampaign('All Campaigns')}>
                                        All Campaigns
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedCampaign('Campaign A')}>
                                        Campaign A
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedCampaign('Campaign B')}>
                                        Campaign B
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {selectedForm}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSelectedForm('All Forms')}>
                                        All Forms
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedForm('Contact Form')}>
                                        Contact Form
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedForm('Lead Form')}>
                                        Lead Form
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {selectedDate}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSelectedDate('Select dates')}>
                                        All Dates
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedDate('Last 7 days')}>
                                        Last 7 days
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedDate('Last 30 days')}>
                                        Last 30 days
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {selectedStatus}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSelectedStatus('All Status')}>
                                        All Status
                                    </DropdownMenuItem>
                                    {uniqueStatuses.map(status => (
                                        <DropdownMenuItem key={status} onClick={() => setSelectedStatus(status)}>
                                            {status}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {selectedSource}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSelectedSource('All Sources')}>
                                        All Sources
                                    </DropdownMenuItem>
                                    {uniqueSources.map(source => (
                                        <DropdownMenuItem key={source} onClick={() => setSelectedSource(source)}>
                                            {source}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {selectedAssignedTo}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSelectedAssignedTo('All Users')}>
                                        All Users
                                    </DropdownMenuItem>
                                    {uniqueAssignedTo.map(user => (
                                        <DropdownMenuItem key={user} onClick={() => setSelectedAssignedTo(user)}>
                                            {user}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        {selectedLabel}
                                        <ChevronDown className="ml-2 h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem onClick={() => setSelectedLabel('All Labels')}>
                                        All Labels
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedLabel('Hot Lead')}>
                                        Hot Lead
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setSelectedLabel('Cold Lead')}>
                                        Cold Lead
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            {(searchQuery || selectedStatus !== 'All Status' || selectedSource !== 'All Sources' || selectedAssignedTo !== 'All Users' || selectedStageFilter !== 'All') && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
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
                        <span className="text-muted-foreground">{intakeLeads}</span>
                        <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
                            <Info className="h-3 w-3" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-primary">Converted leads:</span>
                        <span className="text-muted-foreground">{convertedLeads}</span>
                        <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
                            <Info className="h-3 w-3" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-primary">Conversion rate:</span>
                        <span className="text-muted-foreground">{conversionRate}%</span>
                        <div className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground hover:bg-accent transition-colors cursor-help">
                            <Info className="h-3 w-3" />
                        </div>
                    </div>
                    <div className="ml-auto">
                        <button className="text-sm text-primary hover:underline transition-colors">View all</button>
                    </div>
                </div>

                {filteredLeads.length > 0 && (
                    <div className="mb-4 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                            <span className="mr-2">✓</span>
                            {filteredLeads.length} {filteredLeads.length === 1 ? 'lead' : 'leads'} found
                        </Badge>
                        {searchQuery && (
                            <Badge variant="outline" className="text-xs">
                                Searching: "{searchQuery}"
                            </Badge>
                        )}
                    </div>
                )}
                {filteredLeads.length === 0 && (
                    <div className="mb-4 flex items-center gap-2">
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                            No leads found matching your criteria
                        </Badge>
                    </div>
                )}

                <div className="rounded-lg border bg-card shadow-sm">
                    <div className="flex items-center gap-4 border-b bg-muted/30 px-4 py-3">
                        <Button
                            variant="ghost"
                            size="sm"
                            className={selectedStageFilter === 'All' ? 'bg-accent text-accent-foreground' : ''}
                            onClick={() => setSelectedStageFilter('All')}
                        >
                            All
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={selectedReadFilter === 'Unread' ? 'bg-accent text-accent-foreground' : ''}
                            onClick={() => setSelectedReadFilter(selectedReadFilter === 'Unread' ? 'All' : 'Unread')}
                        >
                            Unread
                        </Button>
                        {uniqueStages.map(stage => {
                            const count = filteredLeads.filter(l => l.stage === stage).length;
                            return (
                                <div key={stage} className="flex items-center gap-2">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={selectedStageFilter === stage ? 'bg-accent text-accent-foreground' : ''}
                                        onClick={() => setSelectedStageFilter(selectedStageFilter === stage ? 'All' : stage)}
                                    >
                                        {stage}
                                    </Button>
                                    <Badge variant="secondary" className="font-medium">{count}</Badge>
                                    {stage !== 'Converted' && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                </div>
                            );
                        })}
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
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Date added
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Name
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Stage
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Source
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Assigned to
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Channel
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead>
                                    <Button variant="ghost" size="sm" className="h-auto p-0 font-medium text-foreground hover:text-primary">
                                        Status
                                        <ArrowUpDown className="ml-2 h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead className="text-muted-foreground">Reminder</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedLeads.length > 0 ? (
                                paginatedLeads.map((lead) => (
                                    <TableRow
                                        key={lead.id}
                                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                                        onClick={() => handleRowClick(lead)}
                                    >
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <Checkbox />
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{lead.dateAdded}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                    {lead.initials}
                                                </div>
                                                <span className="font-medium text-foreground">{lead.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" className="h-auto p-0 text-foreground hover:text-primary">
                                                {lead.stage}
                                                <ChevronDown className="ml-1 h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="font-normal">
                                                {lead.source}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm" className="h-auto p-0 text-foreground hover:text-primary">
                                                {lead.assignedTo}
                                                <ChevronDown className="ml-1 h-3 w-3" />
                                            </Button>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{lead.channel}</TableCell>
                                        <TableCell>
                                            <div className="space-y-1.5">
                                                <Badge variant="secondary" className="font-normal">
                                                    {lead.status}
                                                </Badge>
                                                <Badge variant="secondary" className="block w-fit bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                                    {lead.formStatus}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                                        No leads found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredLeads.length)} of {filteredLeads.length} leads
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={currentPage === pageNum ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            className="min-w-[2.5rem]"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[500px] !max-w-[450px] px-4 sm:w-[450px] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
                                {selectedLead?.initials}
                            </div>
                            <div>
                                <div className="text-xl font-semibold text-foreground">{selectedLead?.name}</div>
                                <div className="text-sm font-normal text-muted-foreground">{selectedLead?.company}</div>
                            </div>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-foreground">Contact Information</h3>
                            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground mb-1">Email</div>
                                    <div className="text-sm text-foreground">{selectedLead?.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground mb-1">Phone</div>
                                    <div className="text-sm text-foreground">{selectedLead?.phone}</div>
                                </div>
                                <div>
                                    <div className="text-xs font-medium text-muted-foreground mb-1">Company</div>
                                    <div className="text-sm text-foreground">{selectedLead?.company}</div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-foreground">Lead Details</h3>
                            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Stage</div>
                                    <Badge variant="outline">{selectedLead?.stage}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Source</div>
                                    <Badge variant="secondary">{selectedLead?.source}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Status</div>
                                    <Badge variant="secondary">{selectedLead?.status}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Form Status</div>
                                    <Badge className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                                        {selectedLead?.formStatus}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Assigned to</div>
                                    <span className="text-sm text-foreground">{selectedLead?.assignedTo}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Channel</div>
                                    <span className="text-sm text-foreground">{selectedLead?.channel}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="text-xs font-medium text-muted-foreground">Date Added</div>
                                    <span className="text-sm text-foreground">{selectedLead?.dateAdded}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-3 text-sm font-semibold text-foreground">Notes</h3>
                            <div className="rounded-lg border bg-muted/30">
                                <textarea
                                    className="text-sm text-foreground p-3 w-full bg-transparent border-0 resize-none outline-none"
                                    value={note || 'Add a note here'}
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