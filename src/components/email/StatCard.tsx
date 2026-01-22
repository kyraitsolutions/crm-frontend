import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: LucideIcon;
}

export const StatCard = ({ title, value, subtitle, icon: Icon }: StatCardProps) => {
    return (
        <div className="bg-card rounded-lg border border-border p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{title}</span>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-semibold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
    );
};
