"use client";

import dynamic from "next/dynamic";
import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";

const ThemeClassic = dynamic(() => import("./ThemeClassic"));
const ThemeLuxuryMonochrome = dynamic(() => import("./ThemeLuxuryMonochrome"));
const ThemeSageForest = dynamic(() => import("./ThemeSageForest"));
const ThemePearlMinimal = dynamic(() => import("./ThemePearlMinimal"));

export type ThemeSlug = "classic" | "luxury-monochrome" | "sage-forest" | "pearl-minimal";

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
        case "classic":
        default:
            return <ThemeClassic {...props} />;
    }
}
