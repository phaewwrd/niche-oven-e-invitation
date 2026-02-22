"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { ThemeRegistry } from "@/components/themes/ThemeRegistry";

interface InvitationDisplayProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
}

export default function InvitationDisplay({ event, theme, schedules, isExpired }: InvitationDisplayProps) {
    return (
        <ThemeRegistry
            slug={theme.slug || "classic"}
            event={event}
            theme={theme}
            schedules={schedules}
            isExpired={isExpired}
        />
    );
}
