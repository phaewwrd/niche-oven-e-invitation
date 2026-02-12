import { auth } from "@niche-e-invitation/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getActiveSubscription } from "@/lib/services";
import { db } from "@niche-e-invitation/db";
import CreateEventForm from "./create-event-form";

export default async function CreateEventPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const subscription = await getActiveSubscription(session.user.id);
    const themes = await db.query.theme.findMany();

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-4xl font-black mb-2 tracking-tight">Design Your Day</h1>
                <p className="text-gray-500 text-lg">Create a beautiful digital invitation in minutes.</p>
            </div>

            <CreateEventForm
                userId={session.user.id}
                themes={themes}
                subscription={subscription}
            />
        </div>
    );
}
