import { drizzle } from "drizzle-orm/node-postgres";
import { plan, theme } from "./schema";
import pg from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: "../../apps/web/.env" });

const client = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

const db = drizzle(client);

async function main() {
    console.log("Seeding started...");

    // Seed Plans
    const plans = [
        {
            id: "free_plan_id",
            name: "free",
            price: 0,
            durationDays: 0,
            maxEvents: 1,
            maxSchedule: 4,
            allowSlug: false,
            allowQuote: false,
            allowMaps: false,
            allowRsvp: false,
        },
        {
            id: "paid_plan_id",
            name: "paid",
            price: 329,
            durationDays: 30,
            maxEvents: 5,
            maxSchedule: 99,
            allowSlug: true,
            allowQuote: true,
            allowMaps: true,
            allowRsvp: true,
        },
    ];

    for (const p of plans) {
        await db.insert(plan).values(p).onConflictDoNothing();
    }

    // Seed Default Themes
    const defaultThemes = [
        {
            id: "theme_luxury",
            title: "Royal Gold",
            slug: "luxury",
            primaryColor: "#1A1A1A",
            secondaryColor: "#4D4D4D",
            accentColor: "#D4AF37",
            backgroundColor: "#FAFAFA",
            fontFamily: "Cormorant Garamond",
        },
        {
            id: "theme_luxury_monochrome",
            title: "Luxury Monochrome",
            slug: "luxury-monochrome",
            primaryColor: "#000000",
            secondaryColor: "#1a1a1a",
            accentColor: "#ffffff",
            backgroundColor: "#ffffff",
            fontFamily: "Playfair Display",
        },
        {
            id: "theme_sage_forest",
            title: "Sage Forest",
            slug: "sage-forest",
            primaryColor: "#2d4030",
            secondaryColor: "#e8e5dc",
            accentColor: "#f2f0eb",
            backgroundColor: "#e8e5dc",
            fontFamily: "Cormorant Garamond",
        },
        {
            id: "theme_pearl_minimal",
            title: "Pearl Minimal",
            slug: "pearl-minimal",
            primaryColor: "#4a4a4a",
            secondaryColor: "#f7f5f2",
            accentColor: "#ffffff",
            backgroundColor: "#f7f5f2",
            fontFamily: "Cormorant Garamond",
        },
        {
            id: "theme_tropical_paradise",
            title: "Tropical Paradise",
            slug: "tropical-paradise",
            primaryColor: "#7ea9cb",
            secondaryColor: "#f7f3e9",
            accentColor: "#e88d67",
            backgroundColor: "#f7f3e9",
            fontFamily: "Pacifico",
        },
        {
            id: "theme_vintage_love",
            title: "Vintage Love",
            slug: "vintage-love",
            primaryColor: "#1a1a1a",
            secondaryColor: "#e8e4e1",
            accentColor: "#8d6e63",
            backgroundColor: "#e8e4e1",
            fontFamily: "Lora",
        },
        {
            id: "theme_sweet_wine",
            title: "Sweet Wine",
            slug: "sweet-wine",
            primaryColor: "#6d1313",
            secondaryColor: "#f9f7f2",
            accentColor: "#6d1313",
            backgroundColor: "#f9f7f2",
            fontFamily: "Playfair Display",
        },
        {
            id: "theme_floral_azure",
            title: "Floral Azure",
            slug: "floral-azure",
            primaryColor: "#1A4D94",
            secondaryColor: "#F5F2ED",
            accentColor: "#9EB7D9",
            backgroundColor: "#F5F2ED",
            fontFamily: "Playfair Display",
        },
        {
            id: "theme_minimal_beige",
            title: "Minimal Beige",
            slug: "minimal-beige",
            primaryColor: "#1A1A1A",
            secondaryColor: "#F2EBE3",
            accentColor: "#000000",
            backgroundColor: "#F2EBE3",
            fontFamily: "Playfair Display",
        },
        {
            id: "theme_crystal_winter",
            title: "Crystal Winter",
            slug: "crystal-winter",
            primaryColor: "#5D7A8C",
            secondaryColor: "#FFFFFF",
            accentColor: "#B8C6CF",
            backgroundColor: "#F0F4F7",
            fontFamily: "Playfair Display",
        },
        {
            id: "theme_scrapbook_nature",
            title: "Scrapbook Nature",
            slug: "scrapbook-nature",
            primaryColor: "#53644B",
            secondaryColor: "#F7F1E5",
            accentColor: "#D3B99F",
            backgroundColor: "#F7F1E5",
            fontFamily: "Comic Sans MS",
        }
    ];

    for (const t of defaultThemes) {
        await db.insert(theme).values(t).onConflictDoUpdate({
            target: theme.id,
            set: { slug: t.slug }
        });
    }

    console.log("Seeding finished!");
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
