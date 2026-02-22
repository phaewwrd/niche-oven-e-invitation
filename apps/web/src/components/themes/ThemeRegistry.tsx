"use client";

import dynamic from "next/dynamic";
import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";

const ThemeClassic = dynamic(() => import("./ThemeClassic"));
const ThemeLuxuryMonochrome = dynamic(() => import("./ThemeLuxuryMonochrome"));
const ThemeSageForest = dynamic(() => import("./ThemeSageForest"));
const ThemePearlMinimal = dynamic(() => import("./ThemePearlMinimal"));
const ThemeTropicalParadise = dynamic(() => import("./ThemeTropicalParadise"));
const ThemeVintageLove = dynamic(() => import("./ThemeVintageLove"));
const ThemeSweetWine = dynamic(() => import("./ThemeSweetWine"));
const ThemeFloralAzure = dynamic(() => import("./ThemeFloralAzure"));
const ThemeMinimalBeige = dynamic(() => import("./ThemeMinimalBeige"));
const ThemeCrystalWinter = dynamic(() => import("./ThemeCrystalWinter"));
const ThemeScrapbookNature = dynamic(() => import("./ThemeScrapbookNature"));

export type ThemeSlug =
    | "classic"
    | "luxury-monochrome"
    | "sage-forest"
    | "pearl-minimal"
    | "tropical-paradise"
    | "vintage-love"
    | "sweet-wine"
    | "floral-azure"
    | "minimal-beige"
    | "crystal-winter"
    | "scrapbook-nature";

interface ThemeRegistryProps {
    slug: string;
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
}

export function ThemeRegistry({ slug, ...props }: ThemeRegistryProps) {
    switch (slug) {
        case "luxury-monochrome":
            return <ThemeLuxuryMonochrome {...props} />;
        case "sage-forest":
            return <ThemeSageForest {...props} />;
        case "pearl-minimal":
            return <ThemePearlMinimal {...props} />;
        case "tropical-paradise":
            return <ThemeTropicalParadise {...props} />;
        case "vintage-love":
            return <ThemeVintageLove {...props} />;
        case "sweet-wine":
            return <ThemeSweetWine {...props} />;
        case "floral-azure":
            return <ThemeFloralAzure {...props} />;
        case "minimal-beige":
            return <ThemeMinimalBeige {...props} />;
        case "crystal-winter":
            return <ThemeCrystalWinter {...props} />;
        case "scrapbook-nature":
            return <ThemeScrapbookNature {...props} />;
        case "classic":
        default:
            return <ThemeClassic {...props} />;
    }
}
