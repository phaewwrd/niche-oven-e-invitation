"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { MapPin, Heart, Quote as QuoteIcon, ChevronDown, Palette } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ThemeProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
}

function formatDate(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function formatTime(time: string) {
    if (time.includes(":")) {
        const [h, m] = time.split(":");
        const hour = parseInt(h);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${m} ${ampm}`;
    }
    return time;
}

export default function ThemeClassic({ event, theme, schedules, isExpired }: ThemeProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

    const themeVars = {
        "--t-primary": theme.primaryColor,
        "--t-secondary": theme.secondaryColor,
        "--t-accent": theme.accentColor,
        "--t-bg": theme.backgroundColor,
        "--t-font": theme.fontFamily,
    } as React.CSSProperties;

    return (
        <div
            style={{
                ...themeVars,
                backgroundColor: "var(--t-bg)",
                fontFamily: `var(--t-font), 'Georgia', serif`,
                color: "var(--t-primary)",
            }}
            className="min-h-screen overflow-hidden"
        >
            {isExpired && (
                <div className="sticky top-0 z-50 py-3 px-6 text-center text-sm font-medium backdrop-blur-md" style={{ backgroundColor: 'var(--t-primary)', color: 'var(--t-bg)', opacity: 0.9 }}>
                    This invitation has expired. The event date has passed.
                </div>
            )}

            <header className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, var(--t-primary) 1px, transparent 0)`,
                        backgroundSize: "40px 40px",
                    }}
                />

                <div
                    className="absolute top-10 left-10 w-32 h-32 rounded-full blur-[80px] opacity-20"
                    style={{ backgroundColor: "var(--t-accent)" }}
                />
                <div
                    className="absolute bottom-10 right-10 w-40 h-40 rounded-full blur-[100px] opacity-15"
                    style={{ backgroundColor: "var(--t-secondary)" }}
                />

                <div className={`relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] mb-4 sm:mb-6 font-medium opacity-60" style={{ color: "var(--t-secondary)" }}>
                        The Wedding of
                    </p>

                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight px-4">
                        <span style={{ color: "var(--t-primary)" }}>{event.groomName}</span>
                        <span className="block my-2 sm:my-4">
                            <span className="inline-block text-xl sm:text-3xl font-light italic opacity-50 mx-4" style={{ color: "var(--t-accent)" }}>
                                &
                            </span>
                        </span>
                        <span style={{ color: "var(--t-primary)" }}>{event.brideName}</span>
                    </h1>

                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className="w-12 sm:w-16 h-px opacity-30" style={{ backgroundColor: "var(--t-accent)" }} />
                        <Heart className="w-4 h-4 opacity-40" style={{ color: "var(--t-accent)" }} />
                        <div className="w-12 sm:w-16 h-px opacity-30" style={{ backgroundColor: "var(--t-accent)" }} />
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <ChevronDown className="w-6 h-6" style={{ color: "var(--t-primary)" }} />
                </div>
            </header>

            {(event.image1Url || theme.image1Url) && (
                <section className={`relative mx-auto max-w-5xl px-4 sm:px-6 transition-all duration-1000 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[16/10]">
                        <Image src={event.image1Url || theme.image1Url || ""} fill alt={`${event.groomName} & ${event.brideName}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 60%, var(--t-bg))` }} />
                    </div>
                </section>
            )}

            <section className="py-16 sm:py-20 px-6 text-center">
                <div className={`max-w-2xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: "var(--t-secondary)", opacity: 0.7 }}>
                        Save the Date
                    </p>
                    <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight" style={{ color: "var(--t-primary)" }}>
                        {formatDate(event.eventDate)}
                    </h2>

                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-16 sm:w-24 h-px opacity-20" style={{ backgroundColor: "var(--t-accent)" }} />
                        <div className="w-2 h-2 rounded-full opacity-40" style={{ backgroundColor: "var(--t-accent)" }} />
                        <div className="w-16 sm:w-24 h-px opacity-20" style={{ backgroundColor: "var(--t-accent)" }} />
                    </div>
                </div>
            </section>

            {event.locationText && (
                <section className="pb-16 sm:pb-20 px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 opacity-50" style={{ color: "var(--t-accent)" }} />
                            <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "var(--t-secondary)", opacity: 0.7 }}>
                                Venue
                            </p>
                        </div>
                        <h3 className="text-xl sm:text-3xl font-semibold px-4" style={{ color: "var(--t-primary)" }}>
                            {event.locationText}
                            {(event.locationProvince || event.locationCountry) && (
                                <span className="block text-sm uppercase tracking-[0.2em] font-light mt-2 opacity-60">
                                    {[event.locationProvince, event.locationCountry].filter(Boolean).join(", ")}
                                </span>
                            )}
                        </h3>

                        {event.googleMapsUrl && (
                            <a
                                href={event.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                                style={{
                                    backgroundColor: "var(--t-accent)",
                                    color: "var(--t-bg)",
                                    opacity: 0.9,
                                }}
                            >
                                <MapPin className="w-4 h-4" />
                                View on Google Maps
                            </a>
                        )}
                    </div>
                </section>
            )}

            {(event.image2Url || theme.image2Url) && (
                <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
                    <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[4/3]">
                        <Image src={event.image2Url || theme.image2Url || ""} fill alt={`${event.groomName} & ${event.brideName} — portrait`} className="w-full h-full object-cover" priority />
                    </div>
                </section>
            )}

            {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                <section className="py-20 px-6 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <Palette className="w-5 h-5 opacity-50" style={{ color: "var(--t-accent)" }} />
                            <p className="text-xs uppercase tracking-[0.3em] font-medium" style={{ color: "var(--t-secondary)", opacity: 0.7 }}>
                                Dress Code Theme
                            </p>
                        </div>
                        <h3 className="text-2xl font-serif font-black italic mb-8" style={{ color: "var(--t-primary)" }}>
                            Our Wedding Colors
                        </h3>

                        <div className="flex items-center justify-center gap-4 sm:gap-6">
                            {event.dressCodeColors.map((color, index) => (
                                <div key={index} className="flex flex-col items-center gap-3">
                                    <div
                                        className="w-12 h-12 sm:w-16 sm:h-16 rounded-full shadow-lg border-4 border-white transform hover:scale-110 transition-transform duration-300"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-tighter opacity-40">{color}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {sortedSchedules.length > 0 && (
                <section className="py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-xs uppercase tracking-[0.3em] mb-4 font-medium" style={{ color: "var(--t-secondary)", opacity: 0.7 }}>
                            Order of Events
                        </p>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-16" style={{ color: "var(--t-primary)" }}>
                            Timeline
                        </h2>

                        <div className="flex flex-wrap items-center justify-center gap-y-8 sm:gap-y-12 gap-x-4 max-w-5xl mx-auto px-4">
                            {sortedSchedules.map((item, index) => (
                                <div key={item.id} className="flex items-center gap-3 sm:gap-4">
                                    <div className="flex flex-col items-center text-center">
                                        <p className="text-[8px] sm:text-[10px] uppercase tracking-widest font-black mb-1" style={{ color: "var(--t-accent)", opacity: 0.8 }}>
                                            {formatTime(item.time)}
                                        </p>
                                        <p className="text-base sm:text-lg font-serif font-bold italic" style={{ color: "var(--t-primary)" }}>
                                            {item.title}
                                        </p>
                                    </div>

                                    {index < sortedSchedules.length - 1 && (
                                        <span className="text-xl sm:text-2xl font-light opacity-30 select-none mx-2 mt-4" style={{ color: "var(--t-accent)" }}>
                                            —
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {event.quote && (
                <section className="py-16 sm:py-20 px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <QuoteIcon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-6 sm:mb-8 opacity-20" style={{ color: "var(--t-accent)" }} />
                        <blockquote className="text-xl sm:text-3xl md:text-4xl font-light italic leading-relaxed px-4" style={{ color: "var(--t-primary)", opacity: 0.75 }}>
                            &ldquo;{event.quote}&rdquo;
                        </blockquote>
                        <div className="flex items-center justify-center gap-3 mt-8 sm:mt-10">
                            <div className="w-12 sm:w-16 h-px opacity-20" style={{ backgroundColor: "var(--t-accent)" }} />
                            <Heart className="w-4 h-4 opacity-30" style={{ color: "var(--t-accent)", fill: "var(--t-accent)" }} />
                            <div className="w-12 sm:w-16 h-px opacity-20" style={{ backgroundColor: "var(--t-accent)" }} />
                        </div>
                    </div>
                </section>
            )}

            {event.collectRsvp && (
                <section className="py-20 sm:py-24 px-6 bg-black/5">
                    <div className="max-w-xl mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-serif italic" style={{ color: "var(--t-primary)" }}>Will you attend?</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40" style={{ color: "var(--t-secondary)" }}>Please respond to our invitation</p>
                        </div>
                        <RsvpForm eventId={event.id} primaryColor={theme.primaryColor} />
                    </div>
                </section>
            )}

            <footer className="py-16 px-6 text-center">
                <div className="max-w-md mx-auto">
                    <p className="text-lg font-medium italic mb-2" style={{ color: "var(--t-primary)", opacity: 0.5 }}>
                        We can&apos;t wait to celebrate with you
                    </p>
                    <p className="text-3xl sm:text-4xl font-bold" style={{ color: "var(--t-primary)" }}>
                        {event.groomName} & {event.brideName}
                    </p>

                    <div className="mt-10 opacity-30">
                        <p className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--t-secondary)" }}>
                            Crafted with Niche E
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
