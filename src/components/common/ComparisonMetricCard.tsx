import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonMetricCardProps {
    title: string;
    icon?: "";
    currentValue: number | string;
    previousValue: number | string;
    suffix?: string;
    colorClass?: string;
    formatter?: (value: number | string) => string;
}

export function ComparisonMetricCard({
    title,
    icon: Icon,
    currentValue,
    previousValue,
    suffix = "",
    colorClass = "border-l-primary",
    formatter,
}: ComparisonMetricCardProps) {
    const current =
        typeof currentValue === "string" ? parseFloat(currentValue) : currentValue;
    const previous =
        typeof previousValue === "string" ? parseFloat(previousValue) : previousValue;

    const percentageChange =
        previous !== 0 ? ((current - previous) / previous) * 100 : 0;
    const absoluteChange = current - previous;

    const formatValue = (value: number | string) => {
        if (formatter) return formatter(value);
        const num = typeof value === "string" ? parseFloat(value) : value;
        return num.toLocaleString();
    };

    const getTrendIcon = () => {
        if (percentageChange > 0) return TrendingUp;
        if (percentageChange < 0) return TrendingDown;
        return Minus;
    };

    const getTrendColor = () => {
        if (percentageChange > 0) return "text-success";
        if (percentageChange < 0) return "text-destructive";
        return "text-muted-foreground";
    };

    const TrendIcon = getTrendIcon();

    return (
        <Card className={cn("border-l-4", colorClass)}>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    {title}
                    <Icon className="h-3.5 w-3.5" />
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-1">
                    {/* Current Period */}
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">
                                {formatValue(currentValue)}
                            </span>
                            {suffix && (
                                <span className="text-xs text-muted-foreground">{suffix}</span>
                            )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">Current period</p>
                    </div>

                    {/* Comparison */}
                    <div className="flex items-center gap-2 pt-1">
                        <div className="flex items-center gap-1">
                            <TrendIcon className={cn("h-3 w-3", getTrendColor())} />
                            <span className={cn("text-xs font-semibold", getTrendColor())}>
                                {percentageChange > 0 && "+"}
                                {percentageChange.toFixed(1)}%
                            </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                            {absoluteChange > 0 && "+"}
                            {formatValue(absoluteChange)} vs previous
                        </span>
                    </div>

                    {/* Previous Period */}
                    <div className="rounded-md bg-muted/50 px-2 py-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground">
                                Previous period
                            </span>
                            <span className="text-xs font-medium">
                                {formatValue(previousValue)}
                                {suffix}
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
