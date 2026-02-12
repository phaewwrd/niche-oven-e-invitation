"use server";

import { createEventService } from "@/lib/event-service";
import { revalidatePath } from "next/cache";

export async function createEventAction(userId: string, data: any) {
    try {
        const result = await createEventService(userId, data);
        revalidatePath("/dashboard");
        return { success: true, id: result.id, slug: result.slug };
    } catch (error: any) {
        console.error("Event creation error:", error);
        return { success: false, error: error.message || "Failed to create event" };
    }
}
