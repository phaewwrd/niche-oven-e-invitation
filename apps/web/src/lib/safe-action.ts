import { createSafeActionClient } from "next-safe-action";
import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized. Please sign in.");
    }

    return next({
        ctx: {
            userId: session.user.id,
        },
    });
});
