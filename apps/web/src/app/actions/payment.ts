"use server";

import { db } from "@niche-e-invitation/db";
import { payment } from "@niche-e-invitation/db/schema/business";
import { revalidatePath } from "next/cache";

export async function submitPayment(data: { slipUrl: string, amount: number, userId: string }) {
    if (!data.slipUrl || !data.amount || !data.userId) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        // 2. Save directly to database (client has already uploaded the slip)
        await db.insert(payment).values({
            id: `pay_${Date.now()}`,
            userId: data.userId,
            slipUrl: data.slipUrl,
            amount: data.amount,
            status: "pending",
        });

        revalidatePath("/dashboard/upgrade");
        return { success: true };
    } catch (error: any) {
        console.error("Payment submission error:", error);
        return { success: false, error: error.message || "Failed to submit payment" };
    }
}
