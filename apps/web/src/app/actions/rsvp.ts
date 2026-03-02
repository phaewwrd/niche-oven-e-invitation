"use server";

import { db } from "@niche-e-invitation/db";
import { rsvp, event } from "@niche-e-invitation/db/schema/business";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const rsvpSchema = z.object({
    eventId: z.string().min(1),
    guestName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    totalGuests: z.number().min(1, "At least 1 guest"),
    isAttending: z.boolean(),
    message: z.string().optional().or(z.literal("")),
});

export async function submitRsvpAction(data: z.infer<typeof rsvpSchema>) {
    try {
        const validated = rsvpSchema.parse(data);

        // Check if event exists and allows RSVP
        const existingEvent = await db.query.event.findFirst({
            where: (event, { eq }) => eq(event.id, validated.eventId),
        });

        if (!existingEvent) {
            return { success: false, error: "Event not found" };
        }

        if (!existingEvent.collectRsvp) {
            return { success: false, error: "This event is not collecting RSVPs" };
        }

        await db.insert(rsvp).values({
            id: `rsvp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            eventId: validated.eventId,
            guestName: validated.guestName,
            email: validated.email || null,
            phone: validated.phone || null,
            totalGuests: validated.totalGuests,
            isAttending: validated.isAttending,
            message: validated.message || null,
        });

        revalidatePath(`/invitation/${existingEvent.slug}`);
        return { success: true };
    } catch (error: any) {
        console.error("RSVP Error:", error);
        return { success: false, error: error.message || "Failed to submit RSVP" };
    }
}
