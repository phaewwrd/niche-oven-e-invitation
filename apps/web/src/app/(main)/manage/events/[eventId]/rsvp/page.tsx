import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { db } from "@niche-e-invitation/db";
import { event as eventSchema, rsvp } from "@niche-e-invitation/db/schema/business";
import { eq, and, desc } from "drizzle-orm";
import RsvpListClient from "./rsvp-list-client";

export default async function EventRsvpPage({ params }: { params: { eventId: string } }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const { eventId } = await params;

    const event = await db.query.event.findFirst({
        where: and(eq(eventSchema.id, eventId), eq(eventSchema.userId, session.user.id)),
    });

    if (!event) {
        notFound();
    }

    const rsvps = await db.query.rsvp.findMany({
        where: eq(rsvp.eventId, eventId),
        orderBy: [desc(rsvp.createdAt)],
    });

    return (
        <div className="container mx-auto p-6 max-w-5xl animate-in fade-in duration-1000">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">Guest Intelligence</h1>
                    <p className="text-gray-500 text-sm sm:text-lg italic font-serif">
                        RSVP responses for <span className="text-primary font-serif font-black">{event.groomName} & {event.brideName}</span>
                    </p>
                </div>
                <a href="/manage" className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all">
                    ← Back to Dashboard
                </a>
            </div>

            <RsvpListClient event={event} rsvps={rsvps} />
        </div>
    );
}
