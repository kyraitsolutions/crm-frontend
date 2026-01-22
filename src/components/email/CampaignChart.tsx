import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Jan", opens: 4200, clicks: 2400 },
    { name: "Feb", opens: 3800, clicks: 2210 },
    { name: "Mar", opens: 5100, clicks: 2900 },
    { name: "Apr", opens: 4600, clicks: 2780 },
    { name: "May", opens: 5900, clicks: 3890 },
    { name: "Jun", opens: 6300, clicks: 4300 },
    { name: "Jul", opens: 5800, clicks: 3800 },
];

export const CampaignChart = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-xl bg-card p-6 shadow-md border border-border/50"
        >
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-display font-semibold text-foreground">Campaign Performance</h3>
                    <p className="text-sm text-muted-foreground">Opens and clicks over time</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-accent" />
                        <span className="text-sm text-muted-foreground">Opens</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">Clicks</span>
                    </div>
                </div>
            </div>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorOpens" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(173, 80%, 40%)" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(222, 47%, 11%)" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(222, 47%, 11%)" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 32%, 91%)" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: 'hsl(215, 16%, 47%)', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'hsl(0, 0%, 100%)',
                                border: '1px solid hsl(214, 32%, 91%)',
                                borderRadius: '8px',
                                boxShadow: '0 4px 6px -1px hsl(222 47% 11% / 0.08)',
                            }}
                        />
                        <Area
                            type="monotone"
                            dataKey="opens"
                            stroke="hsl(173, 80%, 40%)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorOpens)"
                        />
                        <Area
                            type="monotone"
                            dataKey="clicks"
                            stroke="hsl(222, 47%, 11%)"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorClicks)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
