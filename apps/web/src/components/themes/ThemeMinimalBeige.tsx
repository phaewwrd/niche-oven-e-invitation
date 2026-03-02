"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { MapPin, Heart, Quote as QuoteIcon, ArrowRight, Palette } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { useEffect, useState } from "react";
import Image from "next/image";

interface ThemeProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
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

export default function ThemeMinimalBeige({ event, theme, schedules, isExpired }: ThemeProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

    const themeVars = {
        "--t-primary": theme.primaryColor || "#1A1A1A",
        "--t-secondary": theme.secondaryColor || "#F2EBE3",
        "--t-accent": theme.accentColor || "#000000",
        "--t-bg": theme.backgroundColor || "#F2EBE3",
        "--t-font": theme.fontFamily || "'Playfair Display', serif",
    } as React.CSSProperties;

    return (
        <div
            style={{
                ...themeVars,
                backgroundColor: "var(--t-bg)",
                fontFamily: "var(--t-font)",
                color: "var(--t-primary)",
            }}
            className="min-h-screen selection:bg-black selection:text-white pb-20"
        >
            <header className="relative h-screen flex flex-col items-center justify-center px-6">
                <div className={`relative z-10 text-center transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <h1 className="text-6xl sm:text-8xl md:text-9xl font-light tracking-tighter uppercase mb-6">
                        {event.groomName}
                        <span className="block text-3xl sm:text-5xl font-serif italic normal-case tracking-normal opacity-40">&</span>
                        {event.brideName}
                    </h1>
                </div>

                {(event.image1Url || theme.image1Url) && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={event.image1Url || theme.image1Url || ""}
                            alt="Header Background"
                            fill
                            className="object-cover opacity-20 grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-[var(--t-bg)] via-transparent to-[var(--t-bg)]" />
                    </div>
                )}

                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-center space-y-4">
                    <p className="text-xs uppercase tracking-[0.5em] font-medium opacity-50">Save the Date</p>
                    <p className="text-2xl font-light tracking-[0.2em]">
                        {new Date(event.eventDate).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.')}
                    </p>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 space-y-32">

                {/* Introduction Section */}
                <section className="text-center space-y-12">
                    <div className="h-24 w-px bg-current mx-auto opacity-10" />
                    <h2 className="text-2xl sm:text-3xl font-light tracking-widest uppercase italic max-w-2xl mx-auto leading-relaxed">
                        Join us as we celebrate our love and the beginning of a new chapter
                    </h2>
                </section>

                {/* Portrait Display */}
                {(event.image2Url || theme.image2Url) && (
                    <section className="relative overflow-hidden group">
                        <div className="aspect-[4/5] relative overflow-hidden bg-black/5">
                            <Image
                                src={event.image2Url || theme.image2Url || ""}
                                alt="Portrait"
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                        </div>
                        <div className="absolute bottom-10 left-10 text-white z-10">
                            <p className="text-5xl font-serif italic">{event.groomName} & {event.brideName}</p>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
                    </section>
                )}

                {/* Timeline / Timing */}
                <section className="bg-white/50 backdrop-blur-sm p-12 sm:p-24 border border-black/5 rounded-3xl">
                    <div className="flex flex-col md:flex-row gap-16 md:gap-24">
                        <div className="md:w-1/3 space-y-4 pt-2">
                            <h2 className="text-4xl font-serif italic">The Order</h2>
                            <p className="text-[10px] uppercase tracking-[0.4em] font-medium opacity-40">Timing & Events</p>
                        </div>
                        <div className="md:flex-1 space-y-12">
                            {sortedSchedules.map((item) => (
                                <div key={item.id} className="flex items-start gap-12 group">
                                    <div className="text-3xl font-light tracking-tighter opacity-20 group-hover:opacity-100 transition-opacity">
                                        {item.time.split(':')[0]}<span className="text-sm align-top">:{item.time.split(':')[1]}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl uppercase tracking-widest font-medium">{item.title}</h3>
                                        <div className="w-12 h-px bg-current opacity-20 group-hover:w-24 transition-all duration-500" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Venue Details */}
                {event.locationText && (
                    <section className="text-center space-y-12 py-20">
                        <div className="space-y-6">
                            <p className="text-xs uppercase tracking-[0.5em] font-medium opacity-40">Place & Venue</p>
                            <h2 className="text-5xl sm:text-7xl font-light">{event.locationText}</h2>
                            <p className="text-xl opacity-60 italic">{event.locationProvince}, {event.locationCountry}</p>
                        </div>

                        {event.googleMapsUrl && (
                            <a
                                href={event.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-6 group"
                            >
                                <span className="text-sm uppercase tracking-[0.5em] border-b border-current pb-1 group-hover:opacity-60 transition-opacity">View Location</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </a>
                        )}
                    </section>
                )}

                {/* Dress Code Section */}
                {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                    <section className="grid md:grid-cols-2 gap-12 items-center bg-black text-[#F2EBE3] p-12 sm:p-24">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-serif italic">The Palette</h2>
                            <p className="text-sm font-light leading-relaxed opacity-70">
                                We kindly ask our guests to coordinate with our wedding colors to create a beautiful aesthetic for our special day.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {event.dressCodeColors.map((color, idx) => (
                                <div
                                    key={idx}
                                    className="w-20 h-20 border border-white/20"
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* RSVP Minimal */}
                {event.collectRsvp && (
                    <section className="py-20 border-t border-black/5">
                        <div className="max-w-xl mx-auto space-y-12">
                            <div className="text-center">
                                <h2 className="text-4xl font-serif italic lowercase">rsvp</h2>
                                <p className="text-[10px] uppercase tracking-[0.5em] font-medium opacity-40 mt-4">Please respond by the end of the month</p>
                            </div>
                            <RsvpForm eventId={event.id} primaryColor="#000000" />
                        </div>
                    </section>
                )}

                {/* Quote Section */}
                {event.quote && (
                    <section className="text-center py-20 italic">
                        <QuoteIcon className="w-12 h-12 mx-auto mb-8 opacity-5 text-black fill-black" />
                        <p className="text-2xl sm:text-3xl font-light leading-snug max-w-2xl mx-auto opacity-70">
                            &quot;{event.quote}&quot;
                        </p>
                    </section>
                )}

            </main>

            <footer className="text-center pt-20 border-t border-black/5 mx-6">
                <p className="text-xs uppercase tracking-[0.8em] font-medium opacity-20 mb-8">Niche E-Invitation</p>
                <div className="text-4xl font-light tracking-tighter">
                    {event.groomName} <span className="opacity-20">&</span> {event.brideName}
                </div>
            </footer>
        </div>
    );
}
