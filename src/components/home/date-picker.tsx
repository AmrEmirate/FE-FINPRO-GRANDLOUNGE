"use client"

import { Button } from "@/src/components/ui/button"
import { Calendar } from "@/src/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/src/lib/utils"

interface DatePickerProps {
  selected: Date | undefined
  onSelect: (date: Date | undefined) => void
  placeholder: string
  disabled?: (date: Date) => boolean
}

export function DatePicker({ selected, onSelect, placeholder, disabled }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !selected && "text-muted-foreground")}
        >
          {selected ? format(selected, "MMM dd, yyyy") : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selected} onSelect={onSelect} disabled={disabled} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
