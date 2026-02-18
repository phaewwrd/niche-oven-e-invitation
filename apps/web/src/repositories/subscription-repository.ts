import { db } from "@niche-e-invitation/db";
import { userSubscription, plan } from "@niche-e-invitation/db/schema/business";
import { eq, gt, and } from "drizzle-orm";

export const subscriptionRepository = {
    async findActiveByUserId(userId: string) {
        return await db.query.userSubscription.findFirst({
            where: and(
                eq(userSubscription.userId, userId),
                gt(userSubscription.expiresAt, new Date())
            ),
            with: {
                plan: true,
            },
        });
    },

    async findAllPlans() {
        return await db.query.plan.findMany();
    }
};
