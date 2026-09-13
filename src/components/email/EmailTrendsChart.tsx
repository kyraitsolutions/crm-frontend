import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export type EmailTrendPoint = {
  date: string;
  day?: string;
  sent: number;
  opened: number;
  clicked: number;
};

type EmailEventSeriesRow = {
  _id?: string | { day?: string; eventType?: string };
  count?: number;
  sent?: number;
  opened?: number;
  clicked?: number;
};

const legendItems = [
  { name: "Sent", color: "hsl(217, 91%, 60%)" },
  { name: "Opened", color: "hsl(142, 71%, 45%)" },
  { name: "Clicked", color: "hsl(38, 92%, 50%)" },
];

const emptyDays = (days = 14): EmailTrendPoint[] => {
  return Array.from({ length: days }, (_, index) => {
    const date = new Date();
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (days - 1 - index));
    const day = date.toISOString().slice(0, 10);
    return {
      date: new Date(`${day}T12:00:00.000Z`).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      day,
      sent: 0,
      opened: 0,
      clicked: 0,
    };
  });
};

export const mapEmailEventSeries = (series: EmailEventSeriesRow[] = []): EmailTrendPoint[] => {
  const points = emptyDays(14);
  const byDay = new Map(points.map((point) => [point.day, point]));

  for (const row of series) {
    const day = typeof row._id === "string" ? row._id : row._id?.day;
    const point = day ? byDay.get(day) : undefined;
    if (!point) continue;
    if (typeof (row as { sent?: number }).sent === "number") {
      const stats = row as { sent?: number; opened?: number; clicked?: number };
      point.sent += Number(stats.sent || 0);
      point.opened += Number(stats.opened || 0);
      point.clicked += Number(stats.clicked || 0);
      continue;
    }
    const count = Number(row.count || 0);
    const eventType = typeof row._id === "object" ? row._id?.eventType : undefined;
    if (eventType === "SENT") point.sent += count;
    if (eventType === "OPENED") point.opened += count;
    if (eventType === "CLICKED") point.clicked += count;
  }

  return points;
};

type EmailTrendsChartProps = {
  data?: EmailTrendPoint[];
  series?: EmailEventSeriesRow[];
};

export const EmailTrendsChart = ({ data, series }: EmailTrendsChartProps) => {
  const chartData = data?.length ? data : mapEmailEventSeries(series);
  const hasActivity = chartData.some((point) => point.sent || point.opened || point.clicked);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">Email Performance Trends</CardTitle>
        <p className="text-sm text-muted-foreground">Daily sent, open, and click events from the last 14 days</p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          {!hasActivity ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No send, open, or click events in the last 14 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="sent" name="Sent" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="opened" name="Opened" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clicked" name="Clicked" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="flex flex-wrap gap-6 mt-4 justify-center">
          {legendItems.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
