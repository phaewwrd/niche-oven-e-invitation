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
        },
    ];

    for (const p of plans) {
        await db.insert(plan).values(p).onConflictDoNothing();
    }

    // Seed Default Themes
    const defaultThemes = [
        {
            id: "theme_classic",
            title: "Classic Elegance",
            slug: "classic",
            primaryColor: "#2D3436",
            secondaryColor: "#636E72",
            accentColor: "#D63031",
            backgroundColor: "#FDFDFD",
            fontFamily: "Playfair Display",
        },
        {
            id: "theme_romantic",
            title: "Romantic Blush",
            slug: "romantic",
            primaryColor: "#5D4037",
            secondaryColor: "#8D6E63",
            accentColor: "#EC407A",
            backgroundColor: "#FFF5F8",
            fontFamily: "Great Vibes",
        },
        {
            id: "theme_minimal",
            title: "Modern Minimal",
            slug: "minimal",
            primaryColor: "#000000",
            secondaryColor: "#4A4A4A",
            accentColor: "#000000",
            backgroundColor: "#FFFFFF",
            fontFamily: "Montserrat",
        },
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
