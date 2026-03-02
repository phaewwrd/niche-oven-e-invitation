import { z } from "zod";

export const eventSchema = z.object({
    groomName: z.string().min(1, "Groom's name is required"),
    brideName: z.string().min(1, "Bride's name is required"),
    eventDate: z.string().min(1, "Event date is required"),
    locationText: z.string().min(1, "Location is required"),
    locationProvince: z.string().min(1, "Province is required"),
    locationCountry: z.string().min(1, "Country is required"),
    googleMapsUrl: z.string().optional().or(z.literal("")),
    quote: z.string().optional().or(z.literal("")),
    slug: z.string().optional().or(z.literal("")),
    themeId: z.string().min(1, "Theme is required"),
    image1Url: z.string().optional().or(z.literal("")),
    image2Url: z.string().optional().or(z.literal("")),
    dressCodeColors: z.array(z.string()),
    collectRsvp: z.boolean(),
    schedules: z.array(z.object({
        time: z.string().min(1, "Time is required"),
        title: z.string().min(1, "Activity is required"),
    })).min(1, "At least one schedule item is required"),
});

export type EventSchema = z.infer<typeof eventSchema>;
