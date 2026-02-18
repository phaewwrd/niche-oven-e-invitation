import { eventRepository } from "@/repositories/event-repository";
import { subscriptionRepository } from "@/repositories/subscription-repository";
import { themeRepository } from "@/repositories/theme-repository";
import { db } from "@niche-e-invitation/db";
import { event } from "@niche-e-invitation/db/schema/business";
import { eq } from "drizzle-orm";

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
    return await subscriptionRepository.findActiveByUserId(userId);
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
    return await subscriptionRepository.findAllPlans();
}

export async function getThemes() {
    return await themeRepository.findAll();
}
