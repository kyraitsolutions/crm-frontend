import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export type WhatsAppTrendPoint = {
  date: string;
  day?: string;
  sent: number;
  delivered: number;
  read: number;
};

type WhatsAppTrendsChartProps = {
  data?: WhatsAppTrendPoint[];
};

export const WhatsAppTrendsChart = ({ data = [] }: WhatsAppTrendsChartProps) => {
  const hasActivity = data.some((point) => point.sent || point.delivered || point.read);

  return (
    <Card className="border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">WhatsApp Performance Trends</CardTitle>
        <p className="text-sm text-muted-foreground">
          Daily sent, delivered, and read events from the last 14 days
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          {!hasActivity ? (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              No send activity in the last 14 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} barCategoryGap="20%">
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
                <Bar dataKey="delivered" name="Delivered" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="read" name="Read" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
