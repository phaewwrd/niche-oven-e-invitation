"use server";

import { db, payment, userSubscription, plan, user } from "@niche-e-invitation/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";

export async function approvePayment(paymentId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    return await db.transaction(async (tx) => {
        // 1. Fetch payment
        const p = await tx.query.payment.findFirst({
            where: eq(payment.id, paymentId),
        });

        if (!p || p.status !== "pending") {
            throw new Error("Invalid payment");
        }

        // 2. Update payment status
        await tx.update(payment).set({ status: "approved" }).where(eq(payment.id, paymentId));

        // 3. Get Paid Plan ID
        const paidPlan = await tx.query.plan.findFirst({
            where: eq(plan.name, 'paid')
        });

        if (!paidPlan) throw new Error("Paid plan not found in database");

        // 4. Create or update subscription
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30); // 30 days from today

        const existingSub = await tx.query.userSubscription.findFirst({
            where: eq(userSubscription.userId, p.userId)
        });

        if (existingSub) {
            await tx.update(userSubscription).set({
                planId: paidPlan.id,
                expiresAt: expirationDate,
            }).where(eq(userSubscription.id, existingSub.id));
        } else {
            await tx.insert(userSubscription).values({
                id: `sub_${Date.now()}`,
                userId: p.userId,
                planId: paidPlan.id,
                expiresAt: expirationDate,
            });
        }

        revalidatePath("/admin/payments");
        return { success: true };
    });
}

export async function rejectPayment(paymentId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user.role !== "admin") {
        throw new Error("Unauthorized");
    }

    await db.update(payment).set({ status: "rejected" }).where(eq(payment.id, paymentId));
    revalidatePath("/admin/payments");
    return { success: true };
}
