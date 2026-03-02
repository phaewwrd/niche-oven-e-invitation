"use server";

import { db } from "@niche-e-invitation/db";
import { siteConfig } from "@niche-e-invitation/db/schema/business";
import { revalidatePath } from "next/cache";

export async function updateSiteHeroImage(url: string) {
    try {
        await db.insert(siteConfig).values({
            key: "hero_image_url",
            value: url
        }).onConflictDoUpdate({
            target: siteConfig.key,
            set: { value: url }
        });

        revalidatePath("/");
        return { success: true };
    } catch (error: any) {
        console.error("Failed to update hero image:", error);
        return { success: false, error: error.message };
    }
}

export async function getSiteConfig(key: string) {
    try {
        const result = await db.query.siteConfig.findFirst({
            where: (config, { eq }) => eq(config.key, key)
        });
        return result?.value || null;
    } catch (error) {
        console.error(`Failed to fetch site config for ${key}:`, error);
        return null;
    }
}
