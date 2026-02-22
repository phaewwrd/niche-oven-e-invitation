"use client";

import { ThemeRegistry } from "@/components/themes/ThemeRegistry";
import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";

interface ThemePreviewProps {
    theme: Theme;
    image1Url: string;
    image2Url: string;
}

export function ThemePreview({ theme, image1Url, image2Url }: ThemePreviewProps) {
    // Create a mock event to preview the theme
    const mockEvent: Event = {
        id: "preview",
        userId: "preview",
        planId: "preview",
        themeId: theme.id,
        groomName: "John",
        brideName: "Jane",
        image1Url: image1Url || theme.image1Url || null,
        image2Url: image2Url || theme.image2Url || null,
        eventDate: new Date("2026-06-15T18:00:00"),
        locationText: "Garden Paradise Venue",
        locationProvince: "Bangkok",
        locationCountry: "Thailand",
        googleMapsUrl: null,
        quote: "Love is composed of a single soul inhabiting two bodies.",
        dressCodeColors: [theme.primaryColor, theme.secondaryColor, theme.accentColor],
        slug: "preview",
        collectRsvp: true,
        expiresAt: new Date("2026-12-31"),
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    const mockSchedules: Schedule[] = [
        {
            id: "1",
            eventId: "preview",
            time: "18:00",
            title: "Guest Arrival",
            order: 1,
        },
        {
            id: "2",
            eventId: "preview",
            time: "18:30",
            title: "Ceremony Begins",
            order: 2,
        },
        {
            id: "3",
            eventId: "preview",
            time: "19:30",
            title: "Reception & Dinner",
            order: 3,
        },
        {
            id: "4",
            eventId: "preview",
            time: "21:00",
            title: "Dancing & Celebration",
            order: 4,
        },
    ];

    return (
        <div className="border-4 border-border rounded-2xl overflow-hidden shadow-2xl">
            <div className="max-h-[800px] overflow-y-auto">
                <ThemeRegistry
                    slug={theme.slug}
                    event={mockEvent}
                    theme={theme}
                    schedules={mockSchedules}
                    isExpired={false}
                />
            </div>
        </div>
    );
}
