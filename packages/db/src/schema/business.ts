import { pgTable, text, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Plans
export const plan = pgTable("plan", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    price: integer("price").notNull(),
    durationDays: integer("duration_days").notNull(),
    maxEvents: integer("max_events").notNull(),
    maxSchedule: integer("max_schedule").default(4).notNull(),
    allowSlug: boolean("allow_slug").notNull(),
    allowQuote: boolean("allow_quote").notNull(),
    allowMaps: boolean("allow_maps").notNull(),
    maxDressCodeColors: integer("max_dress_code_colors").default(3).notNull(),
    allowRsvp: boolean("allow_rsvp").default(false).notNull(),
});
export type Plan = typeof plan.$inferSelect;

// User Subscriptions
export const userSubscription = pgTable("user_subscription", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    planId: text("plan_id").notNull().references(() => plan.id),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type UserSubscription = typeof userSubscription.$inferSelect;

// Themes
export const theme = pgTable("theme", {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").unique().notNull().default("classic"),
    primaryColor: text("primary_color").notNull(),
    secondaryColor: text("secondary_color").notNull(),
    accentColor: text("accent_color").notNull(),
    backgroundColor: text("background_color").notNull(),
    fontFamily: text("font_family").notNull(),
    previewImageUrl: text("preview_image_url"),
    image1Url: text("image1_url"),
    image2Url: text("image2_url"),
    showDate: boolean("show_date").default(true).notNull(),
    showSchedule: boolean("show_schedule").default(true).notNull(),
    showQuote: boolean("show_quote").default(true).notNull(),
    showImage1: boolean("show_image1").default(true).notNull(),
    showImage2: boolean("show_image2").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Theme = typeof theme.$inferSelect;

// Events
export const event = pgTable("event", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    planId: text("plan_id").notNull().references(() => plan.id),
    themeId: text("theme_id").notNull().references(() => theme.id),
    groomName: text("groom_name").notNull(),
    brideName: text("bride_name").notNull(),
    image1Url: text("image1_url"),
    image2Url: text("image2_url"),
    eventDate: timestamp("event_date").notNull(),
    locationText: text("location_text"),
    locationProvince: text("location_province"),
    locationCountry: text("location_country"),
    googleMapsUrl: text("google_maps_url"),
    quote: text("quote"),
    dressCodeColors: text("dress_code_colors").array(),
    slug: text("slug").unique().notNull(),
    collectRsvp: boolean("collect_rsvp").default(false).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
export type Event = typeof event.$inferSelect;

// Schedule
export const schedule = pgTable("schedule", {
    id: text("id").primaryKey(),
    eventId: text("event_id").notNull().references(() => event.id, { onDelete: 'cascade' }),
    time: text("time").notNull(),
    title: text("title").notNull(),
    order: integer("order").notNull(),
});
export type Schedule = typeof schedule.$inferSelect;

// Payments
export const payment = pgTable("payment", {
    id: text("id").primaryKey(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: 'cascade' }),
    slipUrl: text("slip_url").notNull(),
    amount: integer("amount").notNull(),
    status: text("status").notNull(), // pending | approved | rejected
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Payment = typeof payment.$inferSelect;

// Site Settings
export const siteConfig = pgTable("site_config", {
    key: text("key").primaryKey(), // e.g., 'hero_image_url'
    value: text("value").notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
export type SiteConfig = typeof siteConfig.$inferSelect;

// RSVP Collection
export const rsvp = pgTable("rsvp", {
    id: text("id").primaryKey(),
    eventId: text("event_id").notNull().references(() => event.id, { onDelete: 'cascade' }),
    guestName: text("guest_name").notNull(),
    email: text("email"),
    phone: text("phone"),
    totalGuests: integer("total_guests").default(1).notNull(),
    isAttending: boolean("is_attending").default(true).notNull(),
    message: text("message"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});
export type Rsvp = typeof rsvp.$inferSelect;
