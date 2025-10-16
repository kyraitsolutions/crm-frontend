import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const cardData = [
  {
    id: 1,
    title: "Total Revenue",
    value: "$1,250.00",
    trend: "up",
    percentage: "+12.5%",
    footerTitle: "Trending up this month",
    footerDescription: "Visitors for the last 6 months",
    icon: IconTrendingUp,
  },
  {
    id: 2,
    title: "New Customers",
    value: "1,234",
    trend: "down",
    percentage: "-20%",
    footerTitle: "Down 20% this period",
    footerDescription: "Acquisition needs attention",
    icon: IconTrendingDown,
  },
  {
    id: 3,
    title: "Active Accounts",
    value: "45,678",
    trend: "up",
    percentage: "+12.5%",
    footerTitle: "Strong user retention",
    footerDescription: "Engagement exceed targets",
    icon: IconTrendingUp,
  },
  {
    id: 4,
    title: "Growth Rate",
    value: "4.5%",
    trend: "up",
    percentage: "+4.5%",
    footerTitle: "Steady performance increase",
    footerDescription: "Meets growth projections",
    icon: IconTrendingUp,
  },
];

export function SectionCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardData.map((card) => (
        <Card key={card.id} className="@container/card">
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums">
              {card.value}
            </CardTitle>
            <CardAction>
              <Badge variant="outline">
                <card.icon />
                {card.percentage}
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {card.footerTitle} <card.icon className="size-4" />
            </div>
            <div className="text-muted-foreground">
              {card.footerDescription}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
