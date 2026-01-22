import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const data = [
    { month: "Jan", opens: 38, clicks: 10 },
    { month: "Feb", opens: 41, clicks: 11 },
    { month: "Mar", opens: 39, clicks: 9 },
    { month: "Apr", opens: 44, clicks: 12 },
    { month: "May", opens: 42, clicks: 11 },
    { month: "Jun", opens: 43, clicks: 12 },
];

export const MonthlyPerformanceChart = () => {
    return (
        <Card className="border-border">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Monthly Performance</CardTitle>
                <p className="text-sm text-muted-foreground">Open rate vs Click rate trend</p>
            </CardHeader>
            <CardContent>
                <div className="h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis
                                dataKey="month"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                                tickFormatter={(value) => `${value}%`}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--card))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    fontSize: "12px"
                                }}
                                formatter={(value: number) => [`${value}%`, '']}
                            />
                            <Line
                                type="monotone"
                                dataKey="opens"
                                name="Open Rate"
                                stroke="hsl(217, 91%, 60%)"
                                strokeWidth={2}
                                dot={{ fill: "hsl(217, 91%, 60%)", strokeWidth: 0, r: 4 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="clicks"
                                name="Click Rate"
                                stroke="hsl(142, 71%, 45%)"
                                strokeWidth={2}
                                dot={{ fill: "hsl(142, 71%, 45%)", strokeWidth: 0, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="flex gap-6 mt-4 justify-center">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(217, 91%, 60%)" }} />
                        <span className="text-sm text-muted-foreground">Open Rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: "hsl(142, 71%, 45%)" }} />
                        <span className="text-sm text-muted-foreground">Click Rate</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
