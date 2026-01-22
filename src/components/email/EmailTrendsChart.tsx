import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { date: "Mon", sent: 1850, opened: 780, clicked: 220 },
    { date: "Tue", sent: 2100, opened: 920, clicked: 310 },
    { date: "Wed", sent: 1950, opened: 850, clicked: 280 },
    { date: "Thu", sent: 2400, opened: 1100, clicked: 380 },
    { date: "Fri", sent: 1800, opened: 720, clicked: 190 },
    { date: "Sat", sent: 950, opened: 380, clicked: 95 },
    { date: "Sun", sent: 720, opened: 290, clicked: 72 },
];

const legendItems = [
    { name: "Sent", color: "hsl(217, 91%, 60%)" },
    { name: "Opened", color: "hsl(142, 71%, 45%)" },
    { name: "Clicked", color: "hsl(38, 92%, 50%)" },
];

export const EmailTrendsChart = () => {
    return (
        <Card className="border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Email Performance Trends</CardTitle>
                <p className="text-sm text-muted-foreground">Daily email metrics by engagement type</p>
            </CardHeader>
            <CardContent>
                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "12px"
                                }}
                            />
                            <Bar dataKey="sent" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="opened" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="clicked" fill="hsl(38, 92%, 50%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Custom Legend */}
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
