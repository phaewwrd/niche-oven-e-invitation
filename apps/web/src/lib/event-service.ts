import { eventRepository } from "@/repositories/event-repository";
import { subscriptionRepository } from "@/repositories/subscription-repository";

export async function createEventService(userId: string, data: any) {
    // 1. Fetch active subscription
    const subscription = await subscriptionRepository.findActiveByUserId(userId);
    const currentPlan = subscription?.plan || {
        name: 'free',
        maxEvents: 1,
        maxSchedule: 4,
        maxDressCodeColors: 3,
        allowSlug: false,
        allowQuote: false,
        allowMaps: false
    };

    // 2. Count active events
    const activeEventsCount = await eventRepository.countActiveEvents(userId);

    if (activeEventsCount >= currentPlan.maxEvents) {
        throw new Error(`You have reached the maximum active events for your plan (${currentPlan.maxEvents})`);
    }

    // 3. Validate schedule count
    if (data.schedules.length > (currentPlan as any).maxSchedule) {
        throw new Error(`You can only have up to ${(currentPlan as any).maxSchedule} schedule items on your current plan.`);
    }

    // 3.5 Validate dress code colors
    const maxDressColors = (currentPlan as any).maxDressCodeColors || 3;
    if (data.dressCodeColors?.length > maxDressColors && currentPlan.name === 'free') {
        throw new Error(`Free plan is limited to ${maxDressColors} dress code colors.`);
    }

    // 4. Validate plan features & Generate Slug
    let finalSlug = data.slug;
    if (currentPlan.name === 'free' || !(currentPlan as any).allowSlug) {
        const dateStr = new Date(data.eventDate).toISOString().split('T')[0];
        const randomCode = Math.floor(1000 + Math.random() * 9000);
        finalSlug = `niche-${dateStr}-${randomCode}`;
    }

    let finalQuote = data.quote;
    if (!(currentPlan as any).allowQuote) finalQuote = null;

    let finalMapsUrl = data.googleMapsUrl;
    if (!(currentPlan as any).allowMaps) finalMapsUrl = null;

    // 5. Calculate expires_at
    let expiresAt = new Date(data.eventDate);
    if (currentPlan.name === 'free') {
        expiresAt.setHours(expiresAt.getHours() + 24);
    } else if (subscription) {
        expiresAt = subscription.expiresAt;
    }

    // 6. Repository persistence
    const eventId = `evt_${Date.now()}`;
    const result = await eventRepository.createEvent({
        id: eventId,
        userId,
        planId: subscription?.planId || 'free_plan_id',
        themeId: data.themeId,
        groomName: data.groomName,
        brideName: data.brideName,
        image1Url: data.image1Url,
        image2Url: data.image2Url,
        eventDate: new Date(data.eventDate),
        locationText: data.locationText,
        locationProvince: data.locationProvince,
        locationCountry: data.locationCountry,
        googleMapsUrl: finalMapsUrl,
        quote: finalQuote,
        dressCodeColors: data.dressCodeColors,
        slug: finalSlug,
        expiresAt,
    }, data.schedules.map((s: any, index: number) => ({
        id: `sch_${eventId}_${index}`,
        time: s.time,
        title: s.title,
    })));

    return { id: result.id, slug: result.slug };
}

export async function getEventById(eventId: string) {
    return await eventRepository.findById(eventId);
}

export async function updateEventService(eventId: string, userId: string, data: any) {
    // 1. Fetch active subscription
    const subscription = await subscriptionRepository.findActiveByUserId(userId);
    const currentPlan = subscription?.plan || {
        name: 'free',
        maxEvents: 1,
        maxSchedule: 4,
        maxDressCodeColors: 3,
        allowSlug: false,
        allowQuote: false,
        allowMaps: false
    };

    // 2. Verify ownership
    const existingEvent = await eventRepository.findByUserIdAndId(userId, eventId);

    if (!existingEvent) {
        throw new Error("Event not found or unauthorized");
    }

    // 3. Validate schedule count
    if (data.schedules.length > (currentPlan as any).maxSchedule) {
        throw new Error(`You can only have up to ${(currentPlan as any).maxSchedule} schedule items on your current plan.`);
    }

    // 3.5 Validate dress code colors
    const maxDressColors = (currentPlan as any).maxDressCodeColors || 3;
    if (data.dressCodeColors?.length > maxDressColors && currentPlan.name === 'free') {
        throw new Error(`Free plan is limited to ${maxDressColors} dress code colors.`);
    }

    // 4. Validate plan features
    let finalQuote = data.quote;
    if (!(currentPlan as any).allowQuote) finalQuote = null;

    let finalMapsUrl = data.googleMapsUrl;
    if (!(currentPlan as any).allowMaps) finalMapsUrl = null;

    // 5. Repository update
    await eventRepository.updateEvent(eventId, {
        themeId: data.themeId,
        groomName: data.groomName,
        brideName: data.brideName,
        image1Url: data.image1Url,
        image2Url: data.image2Url,
        eventDate: new Date(data.eventDate),
        locationText: data.locationText,
        locationProvince: data.locationProvince,
        locationCountry: data.locationCountry,
        googleMapsUrl: finalMapsUrl,
        quote: finalQuote,
        dressCodeColors: data.dressCodeColors,
    }, data.schedules.map((s: any, index: number) => ({
        id: `sch_${eventId}_${Date.now()}_${index}`,
        time: s.time,
        title: s.title,
    })));

    return { id: eventId, slug: existingEvent.slug };
}
