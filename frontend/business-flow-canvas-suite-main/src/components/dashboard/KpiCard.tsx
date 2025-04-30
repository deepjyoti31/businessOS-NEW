
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    percentage?: boolean;
  };
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const KpiCard = ({ title, value, change, trend, className }: KpiCardProps) => {
  return (
    <div className={cn("kpi-card", className)}>
      <h3 className="kpi-title">{title}</h3>
      <div className="kpi-value">{value}</div>
      
      {change && (
        <div className={cn(
          "kpi-change",
          trend === "up" ? "text-positive" : trend === "down" ? "text-negative" : ""
        )}>
          {trend === "up" ? (
            <ArrowUpRight size={14} className="mr-1" />
          ) : trend === "down" ? (
            <ArrowDownRight size={14} className="mr-1" />
          ) : null}
          
          <span>
            {change.value > 0 ? "+" : ""}
            {change.value}
            {change.percentage ? "%" : ""}
          </span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
