"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DateTimePickerProps {
    value?: string // YYYY-MM-DDTHH:mm
    onChange: (value: string) => void
    placeholder?: string
}

export function DateTimePicker({ value, onChange, placeholder = "Pick a date & time" }: DateTimePickerProps) {
    const date = value ? new Date(value) : undefined

    const handleDateSelect = (selectedDate: Date | undefined) => {
        if (!selectedDate) return
        const currentDate = date || new Date()
        selectedDate.setHours(currentDate.getHours())
        selectedDate.setMinutes(currentDate.getMinutes())
        onChange(format(selectedDate, "yyyy-MM-dd'T'HH:mm"))
    }

    const handleTimeChange = (type: "hours" | "minutes", newValue: string | null) => {
        if (!newValue) return
        const currentDate = date || new Date()
        if (type === "hours") {
            currentDate.setHours(parseInt(newValue))
        } else {
            currentDate.setMinutes(parseInt(newValue))
        }
        onChange(format(currentDate, "yyyy-MM-dd'T'HH:mm"))
    }

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant={"outline"}
                        type="button"
                        className={cn(
                            "w-full justify-start text-left font-normal py-6 sm:py-7 px-4 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 hover:bg-white transition-all text-lg",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="mr-3 h-5 w-5 text-secondary" />
                        {value ? (
                            <span className="font-medium">{format(new Date(value), "PPP p")}</span>
                        ) : (
                            <span>{placeholder}</span>
                        )}
                    </Button>
                }
            />
            <PopoverContent className="w-auto p-0 rounded-3xl overflow-hidden shadow-2xl border-white/20 bg-white/90 backdrop-blur-xl z-[100]" align="start">
                <div className="p-3 bg-white/50">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        initialFocus
                        className="rounded-2xl"
                    />
                </div>
                <div className="p-4 border-t border-black/5 flex items-center justify-center gap-3 bg-white/80">
                    <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-black/5">
                        <Clock className="h-4 w-4 text-secondary/70 mr-1" />
                        <Select
                            value={date ? date.getHours().toString() : "0"}
                            onValueChange={(v) => handleTimeChange("hours", v)}
                        >
                            <SelectTrigger className="w-[70px] h-10 rounded-xl bg-white border-0 shadow-sm focus:ring-2 focus:ring-secondary/20">
                                <SelectValue placeholder="HH" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px] rounded-2xl shadow-xl border-white/20">
                                {Array.from({ length: 24 }).map((_, i) => (
                                    <SelectItem key={i} value={i.toString()} className="rounded-lg">
                                        {i.toString().padStart(2, "0")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-muted-foreground font-bold">:</span>
                        <Select
                            value={date ? date.getMinutes().toString() : "0"}
                            onValueChange={(v) => handleTimeChange("minutes", v)}
                        >
                            <SelectTrigger className="w-[70px] h-10 rounded-xl bg-white border-0 shadow-sm focus:ring-2 focus:ring-secondary/20">
                                <SelectValue placeholder="MM" />
                            </SelectTrigger>
                            <SelectContent className="max-h-[200px] rounded-2xl shadow-xl border-white/20">
                                {Array.from({ length: 60 }).map((_, i) => (
                                    <SelectItem key={i} value={i.toString()} className="rounded-lg">
                                        {i.toString().padStart(2, "0")}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
