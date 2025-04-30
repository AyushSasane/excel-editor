"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BasicInfoStepProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  tankSerialNo: string
  setTankSerialNo: (value: string) => void
  themeColor: string
  setThemeColor: (value: string) => void
}

export function BasicInfoStep({
  date,
  setDate,
  tankSerialNo,
  setTankSerialNo,
  themeColor,
  setThemeColor,
}: BasicInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center md:text-left">Basic Information</h2>
        <p className="text-sm text-muted-foreground text-center md:text-left">
          Enter the basic details for your Excel document
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date (Cell B3)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tankSerialNo">Tank Serial Number (Cell B4)</Label>
          <Input
            id="tankSerialNo"
            value={tankSerialNo}
            onChange={(e) => setTankSerialNo(e.target.value)}
            placeholder="Enter tank serial number"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="themeColor">Theme Color (Cell F4)</Label>
          <Input
            id="themeColor"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
            placeholder="Enter theme color"
            className="w-full"
          />
        </div>
      </div>
    </div>
  )
}
