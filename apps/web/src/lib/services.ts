import { db } from "@niche-e-invitation/db";
import { event, theme, schedule } from "@niche-e-invitation/db/schema/business";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

export async function getInvitationBySlug(slug: string) {
    const result = await db.query.event.findFirst({
        where: eq(event.slug, slug),
        with: {
            theme: true,
            schedules: true,
        },
    });

    if (!result) {
        return null;
    }

    // Check if expired
    if (new Date() > new Date(result.expiresAt)) {
        return null; // Should return 404 in page
    }

    return result;
}

export async function getActiveSubscription(userId: string) {
    return await db.query.userSubscription.findFirst({
        where: (sub, { eq, gt }) => eq(sub.userId, userId) && gt(sub.expiresAt, new Date()),
        with: {
            plan: true,
        },
    });
}

export async function getUserEvents(userId: string) {
    return await db.query.event.findMany({
        where: eq(event.userId, userId),
        with: {
            theme: true,
        },
        orderBy: (event, { desc }) => [desc(event.createdAt)],
    });
}

export async function getPlans() {
    return await db.query.plan.findMany();
}
