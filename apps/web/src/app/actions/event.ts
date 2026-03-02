"use server";

import { createEventService, updateEventService } from "@/lib/event-service";
import { revalidatePath } from "next/cache";
import { authActionClient } from "@/lib/safe-action";
import { eventSchema } from "@/schemas/event";
import { z } from "zod";

export const createEventAction = authActionClient
    .schema(eventSchema)
    .action(async ({ parsedInput: input, ctx }) => {
        try {
            const result = await createEventService(ctx.userId, input);
            revalidatePath("/manage");
            return { success: true, id: result.id, slug: result.slug };
        } catch (error: any) {
            console.error("Event creation error:", error);
            return { success: false, error: error.message || "Failed to create event" };
        }
    });

export const updateEventAction = authActionClient
    .schema(z.object({
        eventId: z.string(),
        data: eventSchema
    }))
    .action(async ({ parsedInput: input, ctx }) => {
        try {
            const result = await updateEventService(input.eventId, ctx.userId, input.data);
            revalidatePath("/manage");
            revalidatePath(`/manage/events/${input.eventId}/edit`);
            return { success: true, id: result.id, slug: result.slug };
        } catch (error: any) {
            console.error("Event update error:", error);
            return { success: false, error: error.message || "Failed to update event" };
        }
    });
