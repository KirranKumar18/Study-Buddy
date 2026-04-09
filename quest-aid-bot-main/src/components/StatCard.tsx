import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    positive: boolean;
  };
}
export const StatCard = ({
  icon: Icon,
  label,
  value,
  trend
}: StatCardProps) => {
  return <Card className="p-6 hover:shadow-elegant transition-smooth my-0 rounded-none">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && <p className={`text-sm font-semibold ${trend.positive ? 'text-success' : 'text-destructive'}`}>
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>}
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </Card>;
};