import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { plan, userSubscription, theme, event, schedule, payment } from "./business";

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
    subscriptions: many(userSubscription),
    events: many(event),
    payments: many(payment),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

export const userSubscriptionRelations = relations(userSubscription, ({ one }) => ({
    user: one(user, {
        fields: [userSubscription.userId],
        references: [user.id],
    }),
    plan: one(plan, {
        fields: [userSubscription.planId],
        references: [plan.id],
    }),
}));

export const eventRelations = relations(event, ({ one, many }) => ({
    user: one(user, {
        fields: [event.userId],
        references: [user.id],
    }),
    plan: one(plan, {
        fields: [event.planId],
        references: [plan.id],
    }),
    theme: one(theme, {
        fields: [event.themeId],
        references: [theme.id],
    }),
    schedules: many(schedule),
}));

export const scheduleRelations = relations(schedule, ({ one }) => ({
    event: one(event, {
        fields: [schedule.eventId],
        references: [event.id],
    }),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
    user: one(user, {
        fields: [payment.userId],
        references: [user.id],
    }),
}));
