import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
    { name: "Opened", value: 42.8, color: "hsl(217, 91%, 60%)" },
    { name: "Clicked", value: 12.4, color: "hsl(142, 71%, 45%)" },
    { name: "Bounced", value: 2.1, color: "hsl(0, 84%, 60%)" },
    { name: "Unsubscribed", value: 0.8, color: "hsl(38, 92%, 50%)" },
    { name: "Not Opened", value: 41.9, color: "hsl(220, 14%, 90%)" },
];

export const EngagementChart = () => {
    return (
        <Card className="border-border h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Engagement Breakdown</CardTitle>
                <p className="text-sm text-muted-foreground">Distribution by action</p>
            </CardHeader>
            <CardContent>
                <div className="relative h-[180px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={70}
                                paddingAngle={2}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                            <span className="text-2xl font-semibold text-foreground">42.8%</span>
                            <p className="text-xs text-muted-foreground">Open Rate</p>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                    {data.slice(0, 4).map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-muted-foreground">{item.name}: {item.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
