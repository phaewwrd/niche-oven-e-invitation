"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface TimePickerProps {
    value?: string // HH:mm
    onChange: (value: string) => void
    className?: string
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
    const [hours, minutes] = (value || "09:00").split(":")

    const handleTimeChange = (type: "hours" | "minutes", newValue: string | null) => {
        if (newValue === null) return
        if (type === "hours") {
            onChange(`${newValue.padStart(2, "0")}:${minutes}`)
        } else {
            onChange(`${hours}:${newValue.padStart(2, "0")}`)
        }
    }

    return (
        <div className={cn("flex items-center gap-2 bg-white/50 p-1.5 rounded-xl border border-border shadow-sm", className)}>
            <Clock className="h-4 w-4 text-secondary/70 ml-2" />
            <Select
                value={parseInt(hours).toString()}
                onValueChange={(v) => handleTimeChange("hours", v)}
            >
                <SelectTrigger className="w-[60px] h-9 border-0 bg-transparent focus:ring-0 shadow-none">
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
            <span className="text-muted-foreground font-bold opacity-30">:</span>
            <Select
                value={parseInt(minutes).toString()}
                onValueChange={(v) => handleTimeChange("minutes", v)}
            >
                <SelectTrigger className="w-[60px] h-9 border-0 bg-transparent focus:ring-0 shadow-none">
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
    )
}
