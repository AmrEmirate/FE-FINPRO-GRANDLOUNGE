// components/tenant/CalendarDayCell.tsx
import { DayProps } from "react-day-picker";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Ban } from "lucide-react";

interface CustomDayProps extends DayProps {
  price: number | null;
  isSpecialPrice: boolean;
  isPeakSeason: boolean;
  isUnavailable: boolean;
}

export function CalendarDayCell(props: CustomDayProps) {
  const date = (props as any).day?.date ?? (props as any).date ?? new Date();
  
  return (
    <td {...(props as any)}>
      <div className={cn("relative flex h-14 w-14 flex-col items-center justify-center rounded-md p-0", props.isUnavailable && "bg-slate-50 text-muted-foreground opacity-70")}>
        <span>{format(date, "d")}</span>
        <div className="mt-1 text-[10px]">
          {props.isUnavailable ? (
            <span className="flex items-center font-semibold text-red-600"><Ban className="mr-1 h-3 w-3" /> N/A</span>
          ) : (
            <Badge variant={props.isSpecialPrice || props.isPeakSeason ? "default" : "secondary"}>
              {props.price?.toLocaleString("id-ID")}
            </Badge>
          )}
        </div>
      </div>
    </td>
  );
}