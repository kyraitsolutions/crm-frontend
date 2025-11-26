import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Globe,
  Activity,
  Target,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Filter,
  Download,
  FileDown,
  ArrowLeftRight,
} from "lucide-react";
// import { DateRange } from "react-day-picker";
import { isWithinInterval, parseISO, subDays, differenceInDays } from "date-fns";
import { DateRangePicker } from "@/components/common/DateRangePicker";
import { ComparisonMetricCard } from "@/components/common/ComparisonMetricCard";
import { exportToCSV, exportToPDF } from "@/lib/exportUtils";
import { toast } from "@/hooks/use-toast";
import { AnalyticsService } from "@/services/analytics.service";
import { useParams } from "react-router-dom";

interface AnalyticsData {
  totalLeads: number;
  todayLeads: number;
  weeklyLeads: number;
  monthlyLeads: number;
  conversionRate: number;
  avgResponseTime: number;
  activeChatbots: number;
  activeWebforms: number;
  activeGoogleAds: number;
  activeSocialMedia: number;

  leadsBySource: Array<{
    source: string;
    count: number;
    trend: number;
    color: string;
  }>;

  leadsByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;

  leadsOverTime: Array<{
    date: string;
    chatbot: number;
    website: number;
    googleAds: number;
    whatsapp: number;
    facebook: number;
    instagram: number;
    webform: number;
    manual: number;
    total: number;
  }>;

  hourlyEngagement: Array<{
    hour: string;
    engagements: number;
  }>;

  weeklyEngagement: Array<{
    week: string;
    leads: number;
    conversions: number;
  }>;

  monthlyEngagement: Array<{
    month: string;
    leads: number;
    conversions: number;
    revenue: number;
  }>;

  recentLeads: Array<{
    name: string;
    source: string;
    status: string;
    date: string;
    time: string;
  }>;

  channelPerformance: Array<{
    channel: string;
    leads: number;
    conversions: number;
    conversionRate: number;
    status: "active" | "inactive" | "paused";
  }>;
}

const DashboardAccount = () => {
  const { ["account-id"]: accountId } = useParams();;
  console.log(accountId)
  const analyticsService = new AnalyticsService();

  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly" | "yearly">("weekly");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [fullAnalytics, setFullAnalytics] = useState<AnalyticsData>([])

  // Full dataset
  // const fullAnalytics: AnalyticsData = {
  //   totalLeads: 1847,
  //   todayLeads: 43,
  //   weeklyLeads: 286,
  //   monthlyLeads: 1124,
  //   conversionRate: 24.5,
  //   avgResponseTime: 3.2,
  //   activeChatbots: 8,
  //   activeWebforms: 5,
  //   activeGoogleAds: 12,
  //   activeSocialMedia: 6,

  //   leadsBySource: [
  //     { source: "Chatbot", count: 542, trend: 12.5, color: "#3B82F6" },
  //     { source: "Website", count: 398, trend: 8.3, color: "#10B981" },
  //     { source: "Google Ads", count: 321, trend: -3.2, color: "#F59E0B" },
  //     { source: "WhatsApp", count: 245, trend: 15.7, color: "#22C55E" },
  //     { source: "Facebook", count: 186, trend: 5.4, color: "#3B5998" },
  //     { source: "Instagram", count: 155, trend: 9.8, color: "#E4405F" },
  //     { source: "Webform", count: 142, trend: 6.1, color: "#8B5CF6" },
  //     { source: "Manual", count: 58, trend: -1.5, color: "#6B7280" },
  //   ],

  //   leadsByStatus: [
  //     { status: "New", count: 523, percentage: 28.3 },
  //     { status: "Contacted", count: 412, percentage: 22.3 },
  //     { status: "Qualified", count: 368, percentage: 19.9 },
  //     { status: "Converted", count: 453, percentage: 24.5 },
  //     { status: "Lost", count: 91, percentage: 4.9 },
  //   ],

  //   leadsOverTime: [
  //     { date: "2024-11-18", chatbot: 45, website: 32, googleAds: 28, whatsapp: 18, facebook: 15, instagram: 12, webform: 10, manual: 5, total: 165 },
  //     { date: "2024-11-19", chatbot: 52, website: 38, googleAds: 31, whatsapp: 22, facebook: 18, instagram: 14, webform: 12, manual: 4, total: 191 },
  //     { date: "2024-11-20", chatbot: 48, website: 35, googleAds: 25, whatsapp: 20, facebook: 16, instagram: 13, webform: 11, manual: 6, total: 174 },
  //     { date: "2024-11-21", chatbot: 58, website: 42, googleAds: 33, whatsapp: 25, facebook: 19, instagram: 16, webform: 14, manual: 5, total: 212 },
  //     { date: "2024-11-22", chatbot: 55, website: 40, googleAds: 30, whatsapp: 23, facebook: 17, instagram: 15, webform: 13, manual: 7, total: 200 },
  //     { date: "2024-11-23", chatbot: 61, website: 45, googleAds: 35, whatsapp: 27, facebook: 21, instagram: 17, webform: 15, manual: 6, total: 227 },
  //     { date: "2024-11-24", chatbot: 68, website: 48, googleAds: 38, whatsapp: 29, facebook: 23, instagram: 19, webform: 16, manual: 8, total: 249 },
  //   ],

  //   hourlyEngagement: [
  //     { hour: "00:00", engagements: 12 },
  //     { hour: "03:00", engagements: 8 },
  //     { hour: "06:00", engagements: 15 },
  //     { hour: "09:00", engagements: 45 },
  //     { hour: "12:00", engagements: 62 },
  //     { hour: "15:00", engagements: 58 },
  //     { hour: "18:00", engagements: 48 },
  //     { hour: "21:00", engagements: 35 },
  //   ],

  //   weeklyEngagement: [
  //     { week: "Week 1", leads: 842, conversions: 198 },
  //     { week: "Week 2", leads: 921, conversions: 215 },
  //     { week: "Week 3", leads: 1056, conversions: 268 },
  //     { week: "Week 4", leads: 1124, conversions: 286 },
  //   ],

  //   monthlyEngagement: [
  //     { month: "Jul", leads: 3245, conversions: 745, revenue: 89500 },
  //     { month: "Aug", leads: 3512, conversions: 821, revenue: 95200 },
  //     { month: "Sep", leads: 3789, conversions: 892, revenue: 102300 },
  //     { month: "Oct", leads: 4021, conversions: 965, revenue: 108900 },
  //     { month: "Nov", leads: 4358, conversions: 1067, revenue: 118600 },
  //   ],

  //   recentLeads: [
  //     { name: "Rajesh Kumar", source: "Chatbot", status: "New", date: "2024-11-24", time: "14:32" },
  //     { name: "Priya Sharma", source: "Google Ads", status: "Contacted", date: "2024-11-24", time: "14:28" },
  //     { name: "Amit Patel", source: "WhatsApp", status: "Qualified", date: "2024-11-24", time: "14:15" },
  //     { name: "Sneha Desai", source: "Website", status: "New", date: "2024-11-24", time: "14:08" },
  //     { name: "Vikram Singh", source: "Facebook", status: "Contacted", date: "2024-11-24", time: "13:55" },
  //   ],

  //   channelPerformance: [
  //     { channel: "Chatbot", leads: 542, conversions: 145, conversionRate: 26.8, status: "active" },
  //     { channel: "Website", leads: 398, conversions: 98, conversionRate: 24.6, status: "active" },
  //     { channel: "Google Ads", leads: 321, conversions: 75, conversionRate: 23.4, status: "active" },
  //     { channel: "WhatsApp", leads: 245, conversions: 62, conversionRate: 25.3, status: "active" },
  //     { channel: "Facebook", leads: 186, conversions: 42, conversionRate: 22.6, status: "active" },
  //     { channel: "Instagram", leads: 155, conversions: 35, conversionRate: 22.6, status: "active" },
  //     { channel: "Webform", leads: 142, conversions: 38, conversionRate: 26.8, status: "active" },
  //     { channel: "Manual", leads: 58, conversions: 15, conversionRate: 25.9, status: "active" },
  //   ],
  // };

  // Filter data based on date range
  const data = useMemo(() => {
    if (!dateRange?.from) {
      return fullAnalytics;
    }

    const filterByDateRange = (dateStr: string) => {
      try {
        const date = parseISO(dateStr);
        return isWithinInterval(date, {
          start: dateRange.from!,
          end: dateRange.to || dateRange.from!,
        });
      } catch {
        return false;
      }
    };

    // Filter leads over time
    const filteredLeadsOverTime = fullAnalytics.leadsOverTime.filter((item) =>
      filterByDateRange(item.date)
    );

    // Filter recent leads
    const filteredRecentLeads = fullAnalytics.recentLeads.filter((lead) =>
      filterByDateRange(lead.date)
    );

    // Recalculate totals based on filtered data
    const totalFromFiltered = filteredLeadsOverTime.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const todayFromFiltered = filteredLeadsOverTime[filteredLeadsOverTime.length - 1]?.total || 0;

    return {
      ...fullAnalytics,
      totalLeads: totalFromFiltered || fullAnalytics.totalLeads,
      todayLeads: todayFromFiltered,
      leadsOverTime: filteredLeadsOverTime.length > 0 ? filteredLeadsOverTime : fullAnalytics.leadsOverTime,
      recentLeads: filteredRecentLeads.length > 0 ? filteredRecentLeads : fullAnalytics.recentLeads,
    };
  }, [dateRange, fullAnalytics]);

  // Calculate previous period data for comparison
  const previousPeriodData = useMemo(() => {
    if (!dateRange?.from || !comparisonMode) {
      return null;
    }

    const currentStart = dateRange.from;
    const currentEnd = dateRange.to || dateRange.from;
    const periodLength = differenceInDays(currentEnd, currentStart) + 1;

    const previousStart = subDays(currentStart, periodLength);
    const previousEnd = subDays(currentStart, 1);

    const filterByPreviousPeriod = (dateStr: string) => {
      try {
        const date = parseISO(dateStr);
        return isWithinInterval(date, {
          start: previousStart,
          end: previousEnd,
        });
      } catch {
        return false;
      }
    };

    const filteredLeadsOverTime = fullAnalytics.leadsOverTime.filter((item) =>
      filterByPreviousPeriod(item.date)
    );

    const totalFromFiltered = filteredLeadsOverTime.reduce(
      (sum, item) => sum + item.total,
      0
    );

    return {
      totalLeads: totalFromFiltered || 0,
      todayLeads: filteredLeadsOverTime[filteredLeadsOverTime.length - 1]?.total || 0,
      weeklyLeads: totalFromFiltered || 0,
      monthlyLeads: totalFromFiltered || 0,
      conversionRate: 22.5, // Mock data - would calculate from actual conversions
      avgResponseTime: 3.5,
    };
  }, [dateRange, comparisonMode, fullAnalytics]);

  const handleExportCSV = () => {
    try {
      exportToCSV(data, "crm-analytics");
      toast({
        title: "Export Successful",
        description: "Analytics data exported to CSV",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data to CSV",
        variant: "destructive",
      });
    }
  };

  const handleExportPDF = async () => {
    try {
      await exportToPDF(data, "crm-analytics");
      toast({
        title: "Export Successful",
        description: "Analytics report exported to PDF",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data to PDF",
        variant: "destructive",
      });
    }
  };

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EF4444"];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-info text-info-foreground";
      case "contacted":
        return "bg-warning text-warning-foreground";
      case "qualified":
        return "bg-primary text-primary-foreground";
      case "converted":
        return "bg-success text-success-foreground";
      case "lost":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "chatbot":
        return <MessageSquare className="h-3 w-3" />;
      case "website":
      case "webform":
        return <Globe className="h-3 w-3" />;
      case "google ads":
        return <Target className="h-3 w-3" />;
      default:
        return <Activity className="h-3 w-3" />;
    }
  };

  const getOverview = async () => {
    try {
      console.log(accountId)
      const response = await analyticsService.getOverview(String(accountId));
      const data = await response.data;
      console.log(data)
      setFullAnalytics(data.data)
      console.log(data.data)
    } catch (error) {
      console.log("Error", error)
    }
  }

  useEffect(() => {
    getOverview()
  }, [])

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Analytics </h1>
            <p className="text-sm text-muted-foreground">Track leads, conversions, and channel performance</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Time Range Buttons */}
            <div className="flex gap-2">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${timeRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground hover:bg-muted"
                    }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>

            {/* Date Range Picker */}
            {/* <div className="flex items-center gap-2">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
            </div> */}

            {/* Comparison Toggle */}
            <Button
              variant={comparisonMode ? "default" : "outline"}
              size="sm"
              onClick={() => setComparisonMode(!comparisonMode)}
              className="h-9 text-xs"
              disabled={!dateRange?.from}
            >
              <ArrowLeftRight className="mr-2 h-3.5 w-3.5" />
              Compare
            </Button>

            {/* Export Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="h-9 text-xs"
              >
                <FileDown className="mr-2 h-3.5 w-3.5" />
                CSV
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportPDF}
                className="h-9 text-xs"
              >
                <Download className="mr-2 h-3.5 w-3.5" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        {comparisonMode && previousPeriodData ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <ComparisonMetricCard
              title="Total Leads"
              icon={Users}
              currentValue={data.totalLeads}
              previousValue={previousPeriodData.totalLeads}
              colorClass="border-l-primary"
            />
            <ComparisonMetricCard
              title="Latest Leads"
              icon={TrendingUp}
              currentValue={data.todayLeads}
              previousValue={previousPeriodData.todayLeads}
              colorClass="border-l-success"
            />
            <ComparisonMetricCard
              title="Conversion Rate"
              icon={Target}
              currentValue={data.conversionRate}
              previousValue={previousPeriodData.conversionRate}
              suffix="%"
              colorClass="border-l-warning"
              formatter={(val) => typeof val === 'number' ? val.toFixed(1) : val}
            />
            <ComparisonMetricCard
              title="Response Time"
              icon={Clock}
              currentValue={data.avgResponseTime}
              previousValue={previousPeriodData.avgResponseTime}
              suffix="m"
              colorClass="border-l-info"
              formatter={(val) => typeof val === 'number' ? val.toFixed(1) : val}
            />
            <ComparisonMetricCard
              title="Active Chatbots"
              icon={MessageSquare}
              currentValue={data.activeChatbots}
              previousValue={data.activeChatbots}
              colorClass="border-l-primary"
            />
            <ComparisonMetricCard
              title="Active Webforms"
              icon={Globe}
              currentValue={data.activeWebforms}
              previousValue={data.activeWebforms}
              colorClass="border-l-success"
            />
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  Total Leads
                  <Users className="h-3.5 w-3.5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalLeads?.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  Today
                  <TrendingUp className="h-3.5 w-3.5 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.todayLeads}</div>
                <p className="text-xs text-success">+{data.weeklyLeads} this week</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  Conversion
                  <Target className="h-3.5 w-3.5 text-warning" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.conversionRate}%</div>
                <p className="text-xs text-muted-foreground">Success rate</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-info">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  Response Time
                  <Clock className="h-3.5 w-3.5 text-info" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.avgResponseTime}m</div>
                <p className="text-xs text-muted-foreground">Average</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  Chatbots
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeChatbots}</div>
                <p className="text-xs text-success">Active</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-success/10 to-success/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  Webforms
                  <Globe className="h-3.5 w-3.5 text-success" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeWebforms}</div>
                <p className="text-xs text-success">Active</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-warning/10 to-warning/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  Google Ads
                  <Target className="h-3.5 w-3.5 text-warning" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeGoogleAds}</div>
                <p className="text-xs text-success">Campaigns</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-info/10 to-info/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  Social Media
                  <Zap className="h-3.5 w-3.5 text-info" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeSocialMedia}</div>
                <p className="text-xs text-success">Channels</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Comparison Info Banner */}
        {comparisonMode && previousPeriodData && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="py-3">
              <div className="flex items-center gap-2 text-xs">
                <ArrowLeftRight className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary">Comparison Mode Active:</span>
                <span className="text-muted-foreground">
                  Comparing current period with previous {dateRange?.from && dateRange?.to ? differenceInDays(dateRange.to, dateRange.from) + 1 : 0} days
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts Row - Wrapped for PDF export */}
        <div id="charts-for-export" className="grid gap-3 lg:grid-cols-3">
          {/* Leads Over Time */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Lead Generation Trends</CardTitle>
              <p className="text-xs text-muted-foreground">Daily lead acquisition by source</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.leadsOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    stroke="hsl(var(--muted-foreground)) "
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
                  />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      fontSize: "12px",
                      backgroundColor: "white",
                      border: "1px solid gray",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Bar dataKey="chatbot" stackId="a" fill="#3B82F6" />
                  <Bar dataKey="website" stackId="a" fill="#10B981" />
                  <Bar dataKey="googleAds" stackId="a" fill="#F59E0B" />
                  <Bar dataKey="whatsapp" stackId="a" fill="#22C55E" />
                  <Bar dataKey="facebook" stackId="a" fill="#3B5998" />
                  <Bar dataKey="instagram" stackId="a" fill="#E4405F" />
                  <Bar dataKey="webform" stackId="a" fill="#8B5CF6" />
                  <Bar dataKey="manual" stackId="a" fill="#F59E83" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Lead Status Distribution */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Lead Pipeline Status</CardTitle>
              <p className="text-xs text-muted-foreground">Distribution by stage</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data.leadsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ status, percentage }) => `${status}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {data.leadsByStatus?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontSize: "12px",
                      backgroundColor: "white",
                      border: "1px solid  gray",
                      borderRadius: "6px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Source Performance & Monthly Trends */}
        <div className="grid gap-3 lg:grid-cols-2">
          {/* Lead Sources */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Lead Sources Performance</CardTitle>
              <p className="text-xs text-muted-foreground">Ranked by volume with trends</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.leadsBySource?.map((source) => (
                  <div key={source.source} className="flex items-center gap-2">
                    <div className="flex min-w-[90px] items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: source.color }} />
                      <span className="text-xs font-medium">{source.source}</span>
                    </div>
                    <div className="h-6 flex-1 overflow-hidden rounded-md bg-muted">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${(source.count / data.totalLeads) * 100}%`,
                          backgroundColor: source.color,
                        }}
                      />
                    </div>
                    <div className="flex min-w-[80px] items-center gap-2 text-xs">
                      <span className="font-semibold">{source.count}</span>
                      <span className={`flex items-center gap-0.5 ${source.trend >= 0 ? "text-success" : "text-destructive"}`}>
                        {source.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {Math.abs(source.trend)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Engagement */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Monthly Performance</CardTitle>
              <p className="text-xs text-muted-foreground">Leads vs Conversions trend</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={data.monthlyEngagement}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      fontSize: "12px",
                      backgroundColor: "white",
                      border: "1px solid  grey",
                      borderRadius: "6px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="leads" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="conversions" stroke="#10B981" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Section */}
        <div className="grid gap-3 lg:grid-cols-3">
          {/* Channel Performance Table */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Channel Performance Metrics</CardTitle>
              <p className="text-xs text-muted-foreground">Detailed conversion analytics by source</p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left font-semibold text-muted-foreground">Channel</th>
                      <th className="pb-2 text-right font-semibold text-muted-foreground">Leads</th>
                      <th className="pb-2 text-right font-semibold text-muted-foreground">Conversions</th>
                      <th className="pb-2 text-right font-semibold text-muted-foreground">Rate</th>
                      <th className="pb-2 text-center font-semibold text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.channelPerformance?.map((channel) => (
                      <tr key={channel.channel} className="border-b border-border/50">
                        <td className="flex items-center gap-2 py-2.5 font-medium">
                          {getChannelIcon(channel.channel)}
                          {channel.channel}
                        </td>
                        <td className="py-2.5 text-right">{channel.leads}</td>
                        <td className="py-2.5 text-right font-semibold text-success">{channel.conversions}</td>
                        <td className="py-2.5 text-right font-semibold">{channel.conversionRate}%</td>
                        <td className="py-2.5 text-center">
                          <Badge variant="outline" className="text-[10px]">
                            {channel.status === "active" ? <CheckCircle className="mr-1 h-2.5 w-2.5 text-success" /> : <XCircle className="mr-1 h-2.5 w-2.5 text-destructive" />}
                            {channel.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Leads */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Recent Leads</CardTitle>
              <p className="text-xs text-muted-foreground">Latest incoming leads</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {data.recentLeads.slice(0, 5)?.map((lead, index) => (
                  <div key={index} className="flex items-start justify-between rounded-lg border border-border p-2.5 transition-colors hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold capitalize">{lead.name}</p>
                        <Badge className={`text-[9px] ${getStatusColor(lead.status)}`}>{lead.status}</Badge>
                      </div>
                      <p className="mt-0.5 text-[10px] text-muted-foreground">{lead.source}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-medium">
                        {new Date(lead.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-muted-foreground">{lead.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardAccount;


// export default DashboardAccount;
