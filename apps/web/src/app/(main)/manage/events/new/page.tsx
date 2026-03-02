import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getActiveSubscription } from "@/lib/services";
import { db } from "@niche-e-invitation/db";
import CreateEventForm from "./create-event-form";
import { auth } from "@niche-e-invitation/auth/auth";

export default async function CreateEventPage({ searchParams }: { searchParams: Promise<{ theme?: string }> }) {
    const { theme: themeId } = await searchParams;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    if (!themeId) {
        redirect("/manage/events/new/theme");
    }

    const subscription = await getActiveSubscription(session.user.id);
    const themes = await db.query.theme.findMany();
    const selectedTheme = themes.find(t => t.id === themeId);

    if (!selectedTheme) {
        redirect("/manage/events/new/theme");
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">Finalize Details</h1>
                <p className="text-gray-500 text-sm sm:text-lg">You selected <span className="text-secondary font-black italic">{selectedTheme.title}</span>. Now tell us about your day.</p>
            </div>

            <CreateEventForm
                userId={session.user.id}
                themes={themes}
                subscription={subscription}
                initialThemeId={themeId}
            />
        </div>
    );
}
