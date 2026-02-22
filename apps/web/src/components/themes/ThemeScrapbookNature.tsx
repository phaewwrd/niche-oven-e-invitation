"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { MapPin, Heart, Quote as QuoteIcon, Camera, Music, Cloud, Flower2, Pin } from "lucide-react";
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
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
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

export default function ThemeScrapbookNature({ event, theme, schedules, isExpired }: ThemeProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

    const themeVars = {
        "--t-primary": theme.primaryColor || "#53644B",
        "--t-secondary": theme.secondaryColor || "#F7F1E5",
        "--t-accent": theme.accentColor || "#D3B99F",
        "--t-bg": theme.backgroundColor || "#F7F1E5",
        "--t-font": theme.fontFamily || "'Comic Sans MS', 'Chillax', cursive",
    } as React.CSSProperties;

    return (
        <div
            style={{
                ...themeVars,
                backgroundColor: "var(--t-bg)",
                fontFamily: "var(--t-font)",
                color: "var(--t-primary)",
            }}
            className="min-h-screen overflow-x-hidden selection:bg-green-100 pb-20"
        >
            {/* Hand-drawn flower accents */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0 overflow-hidden">
                <Flower2 className="absolute top-20 left-10 w-24 h-24 rotate-12" />
                <Flower2 className="absolute top-[40%] right-[-20px] w-32 h-32 -rotate-12" />
                <Flower2 className="absolute bottom-40 left-[15%] w-16 h-16 rotate-45" />
            </div>

            <header className="relative py-24 px-6 flex flex-col items-center justify-center text-center">
                {/* Polaroid Header */}
                <div className={`relative z-10 space-y-12 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <div className="bg-white p-4 pb-12 shadow-xl -rotate-6 transform hover:rotate-0 transition-transform duration-500 scale-90 sm:scale-100 border border-gray-100 relative">
                            <Pin className="absolute -top-3 left-1/2 -translate-x-1/2 text-red-400 w-6 h-6 z-10" />
                            {(event.image1Url || theme.image1Url) ? (
                                <div className="w-56 h-56 relative overflow-hidden">
                                    <Image src={event.image1Url || theme.image1Url || ""} alt="Groom/Bride" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-56 h-56 bg-gray-50 flex items-center justify-center italic text-gray-300">the groom</div>
                            )}
                            <p className="mt-4 font-serif italic text-sm opacity-60">groom</p>
                        </div>
                        <div className="bg-white p-4 pb-12 shadow-xl rotate-6 transform hover:rotate-0 transition-transform duration-500 scale-90 sm:scale-100 border border-gray-100 relative">
                            <Pin className="absolute -top-3 left-1/2 -translate-x-1/2 text-red-400 w-6 h-6 z-10" />
                            {(event.image2Url || theme.image2Url) ? (
                                <div className="w-56 h-56 relative overflow-hidden">
                                    <Image src={event.image2Url || theme.image2Url || ""} alt="Bride/Groom" fill className="object-cover" />
                                </div>
                            ) : (
                                <div className="w-56 h-56 bg-gray-50 flex items-center justify-center italic text-gray-300">the bride</div>
                            )}
                            <p className="mt-4 font-serif italic text-sm opacity-60">bride</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h1 className="text-4xl sm:text-6xl font-black italic tracking-tighter leading-none">
                            {event.groomName} <span className="opacity-30 not-italic mx-2">+</span> {event.brideName}
                        </h1>
                        <p className="text-lg opacity-80 max-w-lg mx-auto leading-relaxed">
                            Something beautiful is happening and we would love for you to be a part of it!
                        </p>
                    </div>

                    <div className="relative inline-block px-12 py-6">
                        <div className="absolute inset-0 bg-white/40 border-2 border-dashed border-current/20 rounded-[2rem]" />
                        <p className="relative text-3xl font-black italic tracking-widest leading-none">
                            {formatDate(event.eventDate).replace(',', ' at').toUpperCase()}
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 space-y-32 relative z-10">

                {/* Quote with Sketchy Lines */}
                {event.quote && (
                    <section className="text-center relative py-12">
                        <QuoteIcon className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 opacity-5" />
                        <p className="text-2xl sm:text-3xl font-light italic leading-snug max-w-2xl mx-auto text-gray-700">
                            &ldquo;{event.quote}&rdquo;
                        </p>
                        <svg className="w-32 h-4 mx-auto mt-8 opacity-20" viewBox="0 0 100 10">
                            <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                        </svg>
                    </section>
                )}

                {/* Timeline - Paper Scraps style */}
                <section className="space-y-16">
                    <div className="text-center space-y-4">
                        <p className="text-xs uppercase tracking-[0.4em] font-bold opacity-40">The Flow of Events</p>
                        <h2 className="text-4xl font-black italic">Timeline</h2>
                    </div>

                    <div className="space-y-12">
                        {sortedSchedules.map((item, idx) => (
                            <div key={item.id} className="relative group">
                                {idx < sortedSchedules.length - 1 && (
                                    <div className="absolute left-[2.25rem] top-12 bottom-[-3rem] w-px border-l-2 border-dashed border-current/20" />
                                )}
                                <div className="flex items-center gap-10">
                                    <div className="w-20 text-center space-y-1 bg-white p-3 rounded-2xl shadow-sm border border-current/5 group-hover:bg-current group-hover:text-[var(--t-bg)] transition-colors">
                                        <p className="text-[10px] uppercase font-black opacity-60">Time</p>
                                        <p className="text-xs font-bold whitespace-nowrap">{formatTime(item.time)}</p>
                                    </div>
                                    <div className="flex-1 p-6 sm:p-10 bg-white/80 rounded-[2rem] border-2 border-current/5 shadow-sm group-hover:shadow-md transition-shadow relative overflow-hidden">
                                        <h3 className="text-xl font-black italic">{item.title}</h3>
                                        <div className="absolute top-2 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Music className="w-12 h-12" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Venue - Map Card */}
                {event.locationText && (
                    <section className="relative p-12 sm:p-20 bg-white rounded-[3rem] shadow-xl border border-current/5 overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--t-accent)]/10 rounded-bl-[100%] pointer-events-none" />

                        <div className="space-y-10 text-center relative z-10">
                            <div className="space-y-4">
                                <p className="text-xs uppercase tracking-[0.4em] font-bold opacity-40">The Place</p>
                                <h2 className="text-4xl sm:text-6xl font-black italic leading-tight">{event.locationText}</h2>
                                <p className="text-xl opacity-60 italic">{event.locationProvince}, {event.locationCountry}</p>
                            </div>

                            {event.googleMapsUrl && (
                                <a
                                    href={event.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-[var(--t-primary)] text-[var(--t-bg)] rounded-full text-sm font-bold uppercase tracking-widest shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
                                >
                                    <MapPin className="w-4 h-4" />
                                    Open Navigation
                                </a>
                            )}
                        </div>
                    </section>
                )}

                {/* Dress Code - Painter's Palette style */}
                {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                    <section className="py-20 text-center space-y-16">
                        <div className="space-y-6">
                            <h2 className="text-3xl font-black italic">The Color Guide</h2>
                            <p className="text-sm opacity-60 max-w-sm mx-auto leading-relaxed">
                                Feel free to coordinate with our palette for a beautiful celebration together!
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-8 relative py-8">
                            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-current opacity-5 -z-10" />
                            {event.dressCodeColors.map((color, idx) => (
                                <div key={idx} className="bg-white p-3 pb-8 shadow-lg rotate-[-5deg] group hover:rotate-0 transition-transform duration-500 border border-current/5">
                                    <div
                                        className="w-16 h-16 sm:w-20 sm:h-20 shadow-inner group-hover:scale-105 transition-transform"
                                        style={{ backgroundColor: color }}
                                    />
                                    <p className="text-[10px] font-bold mt-4 opacity-40 select-none uppercase tracking-tighter">{color}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* RSVP - Card style */}
                {event.collectRsvp && (
                    <section className="bg-white p-12 sm:p-20 rounded-[4rem] shadow-2xl relative border-4 border-dashed border-current/10">
                        <div className="text-center space-y-10 mb-16">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-400 rounded-full animate-bounce">
                                <Heart className="w-8 h-8 fill-current" />
                            </div>
                            <div className="space-y-4">
                                <h2 className="text-4xl font-black italic lowercase">rsvp</h2>
                                <p className="text-xs uppercase tracking-[0.4em] opacity-40">Let us know if you can make it!</p>
                            </div>
                        </div>
                        <RsvpForm eventId={event.id} primaryColor="#53644B" />
                    </section>
                )}

            </main>

            <footer className="text-center pt-32 pb-10 space-y-12 relative z-10">
                <div className="flex items-center justify-center gap-6">
                    <Cloud className="w-10 h-10 opacity-10" />
                    <Flower2 className="w-12 h-12 opacity-10" />
                    <Music className="w-10 h-10 opacity-10" />
                </div>
                <div className="space-y-4">
                    <p className="text-3xl sm:text-5xl font-black italic tracking-tighter">
                        {event.groomName} <span className="opacity-20">&</span> {event.brideName}
                    </p>
                    <p className="text-[10px] uppercase font-black tracking-[0.8em] opacity-20">Niche E-Invitation — Scrapbook Series</p>
                </div>
            </footer>
        </div>
    );
}
