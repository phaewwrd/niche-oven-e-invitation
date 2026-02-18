import { db } from "@niche-e-invitation/db";
import { event, schedule } from "@niche-e-invitation/db/schema/business";
import { eq, count, and, gt } from "drizzle-orm";

export const eventRepository = {
    async countActiveEvents(userId: string) {
        const result = await db.select({ value: count() }).from(event).where(
            and(
                eq(event.userId, userId),
                gt(event.expiresAt, new Date())
            )
        );
        return result[0]?.value || 0;
    },

    async findById(eventId: string) {
        const eventData = await db.query.event.findFirst({
            where: eq(event.id, eventId),
            with: {
                schedules: true
            }
        });
        return eventData;
    },

    async findByUserIdAndId(userId: string, eventId: string) {
        return await db.query.event.findFirst({
            where: and(eq(event.id, eventId), eq(event.userId, userId)),
        });
    },

    async createEvent(data: any, schedules: any[]) {
        return await db.transaction(async (tx) => {
            const [newEvent] = await tx.insert(event).values(data).returning();

            if (schedules && schedules.length > 0) {
                await tx.insert(schedule).values(
                    schedules.map((s: any, index: number) => ({
                        ...s,
                        eventId: newEvent.id,
                        order: index,
                    }))
                );
            }
            return newEvent;
        });
    },

    async updateEvent(eventId: string, data: any, schedules: any[]) {
        return await db.transaction(async (tx) => {
            await tx.update(event).set(data).where(eq(event.id, eventId));

            if (schedules) {
                await tx.delete(schedule).where(eq(schedule.eventId, eventId));
                if (schedules.length > 0) {
                    await tx.insert(schedule).values(
                        schedules.map((s: any, index: number) => ({
                            ...s,
                            eventId,
                            order: index,
                        }))
                    );
                }
            }
        });
    }
};
