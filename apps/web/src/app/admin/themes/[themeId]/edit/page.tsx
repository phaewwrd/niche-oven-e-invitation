import { db } from "@niche-e-invitation/db";
import { headers } from "next/headers";
import { auth } from "@niche-e-invitation/auth/auth";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { theme } from "@niche-e-invitation/db/schema/business";
import EditThemeForm from "./edit-theme-form";

export default async function EditThemePage({ params }: { params: Promise<{ themeId: string }> }) {
    const { themeId } = await params;

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
        redirect("/login");
    }

    const themeData = await db.query.theme.findFirst({
        where: eq(theme.id, themeId),
    });

    if (!themeData) {
        redirect("/admin/themes");
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl pb-20">
            <div className="mb-8 sm:mb-12">
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Edit Theme</h1>
                <p className="text-muted-foreground text-sm sm:text-lg">Update theme preview image and settings</p>
            </div>

            <EditThemeForm theme={themeData} />
        </div>
    );
}
