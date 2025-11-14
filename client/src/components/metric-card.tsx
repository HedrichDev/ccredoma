import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function MetricCard({ title, value, icon: Icon, description, trend }: MetricCardProps) {
  return (
    <Card data-testid={`card-metric-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight" data-testid={`text-metric-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>
          {value}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p className="text-sm text-muted-foreground mt-2">
            <span className={trend.value > 0 ? "text-status-available" : "text-status-overdue"}>
              {trend.value > 0 ? "↑" : "↓"} {Math.abs(trend.value)}%
            </span>
            {" "}{trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
