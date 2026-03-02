import { db } from "@niche-e-invitation/db";
import { theme } from "@niche-e-invitation/db/schema/business";
import { eq } from "drizzle-orm";

export const themeRepository = {
    async findAll() {
        return await db.query.theme.findMany();
    },

    async findById(id: string) {
        return await db.query.theme.findFirst({
            where: eq(theme.id, id),
        });
    },

    async create(data: any) {
        return await db.insert(theme).values(data).returning();
    }
};
