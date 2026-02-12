"use server";

import { db } from "@niche-e-invitation/db";
import { payment } from "@niche-e-invitation/db/schema";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { revalidatePath } from "next/cache";

export async function submitPayment(formData: FormData) {
    const file = formData.get("file") as File;
    const amountStr = formData.get("amount") as string;
    const userId = formData.get("userId") as string;

    if (!file || !amountStr || !userId) {
        return { success: false, error: "Missing required fields" };
    }

    try {
        // 1. Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(file, "payment-slips");

        // 2. Save to database
        await db.insert(payment).values({
            id: `pay_${Date.now()}`,
            userId: userId,
            slipUrl: uploadResult.url,
            amount: parseInt(amountStr),
            status: "pending",
        });

        revalidatePath("/dashboard/upgrade");
        return { success: true };
    } catch (error: any) {
        console.error("Payment submission error:", error);
        return { success: false, error: error.message || "Failed to submit payment" };
    }
}
