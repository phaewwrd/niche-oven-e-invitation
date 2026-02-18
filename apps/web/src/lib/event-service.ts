import { db } from "@niche-e-invitation/db";
import { event, schedule, userSubscription, plan } from "@niche-e-invitation/db/schema/business";
import { eq, count, and, gt } from "drizzle-orm";
import { getActiveSubscription } from "./services";

export async function createEventService(userId: string, data: any) {
    // 1. Fetch active subscription
    const subscription = await getActiveSubscription(userId);
    const currentPlan = subscription?.plan || {
        name: 'free',
        maxEvents: 1,
        maxSchedule: 4,
        allowSlug: false,
        allowQuote: false,
        allowMaps: false
    };

    // 2. Count active events
    const existingEvents = await db.select({ value: count() }).from(event).where(
        and(
            eq(event.userId, userId),
            gt(event.expiresAt, new Date())
        )
    );

    if (existingEvents[0].value >= currentPlan.maxEvents) {
        throw new Error(`You have reached the maximum active events for your plan (${currentPlan.maxEvents})`);
    }

    // 3. Validate schedule count
    if (data.schedules.length > currentPlan.maxSchedule) {
        throw new Error(`You can only have up to ${currentPlan.maxSchedule} schedule items on your current plan.`);
    }

    // 4. Validate plan features & Generate Slug
    let finalSlug = data.slug;
    if (currentPlan.name === 'free' || !currentPlan.allowSlug) {
        // Free -> auto: niche-{eventDate}-{randomCode}
        const dateStr = new Date(data.eventDate).toISOString().split('T')[0];
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        finalSlug = `niche-${dateStr}-${randomCode}`;
    }

    let finalQuote = data.quote;
    if (!currentPlan.allowQuote) finalQuote = null;

    let finalMapsUrl = data.googleMapsUrl;
    if (!currentPlan.allowMaps) finalMapsUrl = null;

    // 5. Calculate expires_at
    let expiresAt = new Date(data.eventDate);
    if (currentPlan.name === 'free') {
        expiresAt.setHours(expiresAt.getHours() + 24); // event_date + 1 day
    } else if (subscription) {
        expiresAt = subscription.expiresAt; // Paid -> subscription expiry
    }

    // 6. Transactional insert
    return await db.transaction(async (tx) => {
        const eventId = `evt_${Date.now()}`;

        await tx.insert(event).values({
            id: eventId,
            userId,
            planId: subscription?.planId || 'free_plan_id', // Assuming you have seeded plans
            themeId: data.themeId,
            groomName: data.groomName,
            brideName: data.brideName,
            image1Url: data.image1Url,
            image2Url: data.image2Url,
            eventDate: new Date(data.eventDate),
            locationText: data.locationText,
            googleMapsUrl: finalMapsUrl,
            quote: finalQuote,
            slug: finalSlug,
            expiresAt,
        });

        if (data.schedules && data.schedules.length > 0) {
            await tx.insert(schedule).values(
                data.schedules.map((s: any, index: number) => ({
                    id: `sch_${eventId}_${index}`,
                    eventId,
                    time: s.time,
                    title: s.title,
                    order: index,
                }))
            );
        }

        return { id: eventId, slug: finalSlug };
    });
}

export async function getEventById(eventId: string) {
    const eventData = await db.query.event.findFirst({
        where: eq(event.id, eventId),
    });

    if (!eventData) return null;

    const schedules = await db.query.schedule.findMany({
        where: eq(schedule.eventId, eventId),
        orderBy: [schedule.order],
    });

    return { ...eventData, schedules };
}

export async function updateEventService(eventId: string, userId: string, data: any) {
    // 1. Fetch active subscription
    const subscription = await getActiveSubscription(userId);
    const currentPlan = subscription?.plan || {
        name: 'free',
        maxEvents: 1,
        maxSchedule: 4,
        allowSlug: false,
        allowQuote: false,
        allowMaps: false
    };

    // 2. Verify ownership
    const existingEvent = await db.query.event.findFirst({
        where: and(eq(event.id, eventId), eq(event.userId, userId)),
    });

    if (!existingEvent) {
        throw new Error("Event not found or unauthorized");
    }

    // 3. Validate schedule count
    if (data.schedules.length > currentPlan.maxSchedule) {
        throw new Error(`You can only have up to ${currentPlan.maxSchedule} schedule items on your current plan.`);
    }

    // 4. Validate plan features
    let finalQuote = data.quote;
    if (!currentPlan.allowQuote) finalQuote = null;

    let finalMapsUrl = data.googleMapsUrl;
    if (!currentPlan.allowMaps) finalMapsUrl = null;

    // 5. Transactional update
    return await db.transaction(async (tx) => {
        await tx.update(event).set({
            themeId: data.themeId,
            groomName: data.groomName,
            brideName: data.brideName,
            image1Url: data.image1Url,
            image2Url: data.image2Url,
            eventDate: new Date(data.eventDate),
            locationText: data.locationText,
            googleMapsUrl: finalMapsUrl,
            quote: finalQuote,
        }).where(eq(event.id, eventId));

        // Delete old schedules and insert new ones
        await tx.delete(schedule).where(eq(schedule.eventId, eventId));

        if (data.schedules && data.schedules.length > 0) {
            await tx.insert(schedule).values(
                data.schedules.map((s: any, index: number) => ({
                    id: `sch_${eventId}_${Date.now()}_${index}`,
                    eventId,
                    time: s.time,
                    title: s.title,
                    order: index,
                }))
            );
        }

        return { id: eventId, slug: existingEvent.slug };
    });
}
