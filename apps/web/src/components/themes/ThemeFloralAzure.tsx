"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { MapPin, Heart, Quote as QuoteIcon, ChevronDown, Palette, Calendar, Clock } from "lucide-react";
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

export default function ThemeFloralAzure({ event, theme, schedules, isExpired }: ThemeProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

    const themeVars = {
        "--t-primary": theme.primaryColor || "#1A4D94",
        "--t-secondary": theme.secondaryColor || "#4A70A6",
        "--t-accent": theme.accentColor || "#9EB7D9",
        "--t-bg": theme.backgroundColor || "#F5F2ED",
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
            className="min-h-screen overflow-x-hidden selection:bg-blue-100"
        >
            {isExpired && (
                <div className="sticky top-0 z-50 py-3 px-6 text-center text-xs font-bold tracking-widest uppercase bg-[#1A4D94] text-white">
                    Event Passed
                </div>
            )}

            {/* Floral Decorations - Absolute Positioned */}
            <div className="fixed top-0 right-0 w-64 h-64 pointer-events-none opacity-20 z-0">
                <svg viewBox="0 0 200 200" className="w-full h-full text-[#1A4D94] fill-current">
                    <path d="M100,20 C120,20 140,40 140,70 C140,100 120,130 100,160 C80,130 60,100 60,70 C60,40 80,20 100,20 Z" />
                    <path d="M100,80 Q130,50 160,80 Q130,110 100,80 Z" transform="rotate(45 100 80)" />
                    <path d="M100,80 Q70,50 40,80 Q70,110 100,80 Z" transform="rotate(-45 100 80)" />
                </svg>
            </div>

            <header className="relative min-h-screen flex flex-col items-center justify-start pt-20 px-6 text-center">
                <div className="relative z-10 space-y-8 max-w-lg mx-auto">
                    <p className="text-[10px] uppercase tracking-[0.6em] font-medium opacity-60">The Wedding of</p>

                    <h1 className="text-5xl sm:text-7xl font-light tracking-tight leading-tight">
                        <span className="block">{event.groomName}</span>
                        <span className="block my-2 text-3xl font-serif italic font-light opacity-40">and</span>
                        <span className="block">{event.brideName}</span>
                    </h1>

                    {(event.image1Url || theme.image1Url) && (
                        <div className={`mt-12 relative mx-auto w-full max-w-sm transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                            <div className="aspect-[3/4] rounded-t-full overflow-hidden border-[12px] border-white shadow-xl">
                                <Image
                                    src={event.image1Url || theme.image1Url || ""}
                                    alt={`${event.groomName} & ${event.brideName}`}
                                    className="w-full h-full object-cover"
                                    width={800}
                                    height={1067}
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full border-4 border-[#1A4D94] flex items-center justify-center bg-white shadow-lg pointer-events-none">
                                <div className="text-[#1A4D94] font-serif italic text-4xl">
                                    {event.groomName?.[0]}&{event.brideName?.[0]}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-16 space-y-4">
                        <div className="h-px w-24 bg-[#1A4D94] mx-auto opacity-20" />
                        <div className="text-2xl font-light tracking-[0.2em]">
                            {new Date(event.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                        <div className="h-px w-24 bg-[#1A4D94] mx-auto opacity-20" />
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <ChevronDown className="w-8 h-8" />
                </div>
            </header>

            {/* Torn Paper Section Divider */}
            <div className="relative w-full h-24 -mt-12 z-20">
                <svg viewBox="0 0 1440 120" className="w-full h-full fill-[var(--t-bg)] filter drop-shadow-[0_-5px_5px_rgba(0,0,0,0.05)]" preserveAspectRatio="none">
                    <path d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,42.7C672,32,768,32,864,42.7C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" />
                </svg>
            </div>

            <section className="py-20 bg-white relative">
                <div className="max-w-xl mx-auto px-6 text-center space-y-12">
                    {event.quote && (
                        <div className="space-y-6">
                            <QuoteIcon className="w-8 h-8 mx-auto opacity-10" />
                            <p className="text-lg italic font-light leading-relaxed text-gray-600">
                                {event.quote}
                            </p>
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#1A4D94]/20" />
                                <div className="w-2 h-2 rounded-full bg-[#1A4D94]/40" />
                                <div className="w-2 h-2 rounded-full bg-[#1A4D94]/20" />
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Program Section */}
            <section className="py-24 px-6 relative bg-white">
                <div className="max-w-2xl mx-auto border-2 border-[#1A4D94]/10 rounded-[100px] p-12 sm:p-20 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-[#1A4D94]/5" />

                    <h2 className="text-3xl font-serif italic mb-12 flex items-center justify-center gap-4">
                        <div className="h-px w-8 bg-[#1A4D94]/30" />
                        The Wedding Program
                        <div className="h-px w-8 bg-[#1A4D94]/30" />
                    </h2>

                    <div className="space-y-10">
                        {sortedSchedules.map((item, idx) => (
                            <div key={item.id} className="group flex items-center justify-center gap-8">
                                <div className="text-right flex-1 text-sm font-medium tracking-widest text-[#1A4D94]/60">
                                    {formatTime(item.time)}
                                </div>
                                <div className="relative flex flex-col items-center">
                                    <div className="w-3 h-3 rounded-full border-2 border-[#1A4D94] bg-white z-10" />
                                    {idx < sortedSchedules.length - 1 && (
                                        <div className="absolute top-3 w-[1px] h-10 bg-[#1A4D94]/20 border-l border-dashed border-[#1A4D94]/30" />
                                    )}
                                </div>
                                <div className="text-left flex-1 font-serif text-lg">
                                    {item.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {event.locationText && (
                <section className="py-24 px-6 text-center bg-white">
                    <div className="max-w-2xl mx-auto space-y-12">
                        <div className="relative inline-block">
                            <MapPin className="w-10 h-10 mx-auto text-[#1A4D94]/40" />
                            <div className="absolute inset-0 animate-ping rounded-full bg-[#1A4D94]/5" />
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-sm uppercase tracking-[0.4em] opacity-50">The Venue</h2>
                            <h3 className="text-4xl font-light">{event.locationText}</h3>
                            <p className="text-lg text-gray-500 font-light">
                                {[event.locationProvince, event.locationCountry].filter(Boolean).join(", ")}
                            </p>
                        </div>

                        {event.googleMapsUrl && (
                            <a
                                href={event.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 px-10 py-4 rounded-full border-2 border-[#1A4D94] text-[#1A4D94] hover:bg-[#1A4D94] hover:text-white transition-all duration-500 group"
                            >
                                <span className="font-medium tracking-widest text-sm uppercase">Open Navigation</span>
                                <MapPin className="w-4 h-4 group-hover:translate-y-[-2px] transition-transform" />
                            </a>
                        )}
                    </div>
                </section>
            )}

            {/* Dress Code & Palette */}
            {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
                    <div className="max-w-2xl mx-auto text-center space-y-16">
                        <div className="space-y-4">
                            <h2 className="text-sm uppercase tracking-[0.4em] opacity-40">Dress Code</h2>
                            <h3 className="text-3xl font-serif italic">Your Presence is our Gift</h3>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            {event.dressCodeColors.map((color, idx) => (
                                <div key={idx} className="space-y-3 group">
                                    <div
                                        className="w-16 h-16 rounded-full shadow-inner border-[6px] border-white ring-1 ring-black/5 group-hover:scale-110 transition-transform duration-500"
                                        style={{ backgroundColor: color }}
                                    />
                                    <p className="text-[10px] uppercase tracking-wider font-bold opacity-30 select-none">{color}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* RSVP */}
            {event.collectRsvp && (
                <section className="py-24 px-6 bg-white">
                    <div className="max-w-lg mx-auto bg-slate-50 p-12 sm:p-20 rounded-[40px] shadow-sm border border-black/5">
                        <div className="text-center space-y-8 mb-12">
                            <Heart className="w-8 h-8 mx-auto text-red-200 fill-red-200" />
                            <h2 className="text-4xl font-serif italic">Are you coming?</h2>
                            <p className="text-xs uppercase tracking-[0.4em] opacity-40">RSVP by {formatDate(new Date(new Date(event.eventDate).getTime() - 7 * 24 * 60 * 60 * 1000))}</p>
                        </div>
                        <RsvpForm eventId={event.id} primaryColor="#1A4D94" />
                    </div>
                </section>
            )}

            <footer className="py-24 px-6 text-center bg-white">
                <div className="max-w-md mx-auto space-y-8">
                    <p className="text-lg font-serif italic text-[#1A4D94]/60">
                        See you at our celebration
                    </p>
                    <div className="h-px w-12 bg-[#1A4D94]/20 mx-auto" />
                    <p className="text-4xl font-light tracking-tighter">
                        {event.groomName} <span className="opacity-20 mx-2">&</span> {event.brideName}
                    </p>
                    <div className="pt-12">
                        <p className="text-[10px] uppercase tracking-[0.4em] opacity-30">
                            Created with Niche E-Invitation
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
