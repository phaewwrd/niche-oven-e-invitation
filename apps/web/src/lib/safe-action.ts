import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient();

export const authActionClient = actionClient.use(async ({ next }) => {
    // In a real app, get the session here
    return next({
        ctx: {
            userId: "placeholder-user-id",
        },
    });
});
