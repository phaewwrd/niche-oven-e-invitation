import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { getActiveSubscription } from "@/lib/services";
import { db } from "@niche-e-invitation/db";
import { auth } from "@niche-e-invitation/auth/auth";
import { getEventById } from "@/lib/event-service";
import EditEventForm from "./edit-event-form";

interface EditEventPageProps {
    params: Promise<{ eventId: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
    const { eventId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const [eventData, subscription, themes] = await Promise.all([
        getEventById(eventId),
        getActiveSubscription(session.user.id),
        db.query.theme.findMany(),
    ]);

    if (!eventData) {
        notFound();
    }

    // Verify ownership
    if (eventData.userId !== session.user.id) {
        redirect("/manage");
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">Refine Your Event</h1>
                <p className="text-gray-500 text-sm sm:text-lg">Update your invitation details and theme.</p>
            </div>

            <EditEventForm
                userId={session.user.id}
                eventId={eventId}
                initialData={eventData}
                themes={themes}
                subscription={subscription}
            />
        </div>
    );
}
