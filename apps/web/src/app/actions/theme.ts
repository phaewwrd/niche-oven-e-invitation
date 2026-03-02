"use server";

import { db } from "@niche-e-invitation/db";
import { theme } from "@niche-e-invitation/db/schema/business";
import { revalidatePath } from "next/cache";
import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function createThemeAction(data: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user.role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        const themeId = `thm_${Date.now()}`;

        await db.insert(theme).values({
            id: themeId,
            title: data.title,
            slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            accentColor: data.accentColor,
            backgroundColor: data.backgroundColor,
            fontFamily: data.fontFamily,
            previewImageUrl: data.previewImageUrl || null,
            showDate: data.showDate ?? true,
            showSchedule: data.showSchedule ?? true,
            showQuote: data.showQuote ?? true,
            showImage1: data.showImage1 ?? true,
            showImage2: data.showImage2 ?? true,
        });

        revalidatePath("/admin/themes");
        revalidatePath("/manage/events/new");
        revalidatePath("/manage/events/new/theme");
        return { success: true, id: themeId };
    } catch (error: any) {
        console.error("Theme creation error:", error);
        return { success: false, error: error.message || "Failed to create theme" };
    }
}

export async function updateThemeAction(themeId: string, data: any) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user.role !== "admin") {
        return { success: false, error: "Unauthorized. Admin access required." };
    }

    try {
        await db.update(theme)
            .set({
                title: data.title,
                slug: data.slug,
                primaryColor: data.primaryColor,
                secondaryColor: data.secondaryColor,
                accentColor: data.accentColor,
                backgroundColor: data.backgroundColor,
                fontFamily: data.fontFamily,
                previewImageUrl: data.previewImageUrl || null,
                image1Url: data.image1Url || null,
                image2Url: data.image2Url || null,
            })
            .where(eq(theme.id, themeId));

        revalidatePath("/admin/themes");
        revalidatePath("/manage/events/new");
        revalidatePath("/manage/events/new/theme");
        return { success: true };
    } catch (error: any) {
        console.error("Theme update error:", error);
        return { success: false, error: error.message || "Failed to update theme" };
    }
}

