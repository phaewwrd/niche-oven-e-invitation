"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { MapPin, Heart, Quote as QuoteIcon, ChevronDown, Sparkles, Snowflake, Music } from "lucide-react";
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

export default function ThemeCrystalWinter({ event, theme, schedules, isExpired }: ThemeProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

    const themeVars = {
        "--t-primary": theme.primaryColor || "#5D7A8C",
        "--t-secondary": theme.secondaryColor || "#FFFFFF",
        "--t-accent": theme.accentColor || "#B8C6CF",
        "--t-bg": theme.backgroundColor || "#F0F4F7",
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
            {/* Ice/Snow particles overlay (simplified) */}
            <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
                <div className="absolute top-10 left-[10%] drop-shadow-sm"><Snowflake className="w-4 h-4 animate-pulse" /></div>
                <div className="absolute top-40 right-[15%] drop-shadow-sm"><Snowflake className="w-6 h-6 animate-bounce duration-1000" /></div>
                <div className="absolute bottom-20 left-[20%] drop-shadow-sm"><Snowflake className="w-5 h-5 animate-pulse" /></div>
            </div>

            <header className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center space-y-12">
                <div className={`relative z-10 transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
                    <div className="inline-flex items-center gap-2 mb-8 px-4 py-1 rounded-full bg-white/40 backdrop-blur-sm border border-white/60 text-[10px] uppercase tracking-[0.5em] font-bold">
                        <Sparkles className="w-3 h-3" />
                        A Wedding Tale
                    </div>

                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-light tracking-tight italic">
                        <span className="block mb-2">{event.groomName}</span>
                        <span className="block text-2xl font-serif not-italic opacity-30 my-4">&</span>
                        <span className="block">{event.brideName}</span>
                    </h1>


                </div>

                {(event.image1Url || theme.image1Url) && (
                    <div className={`relative w-full max-w-sm aspect-[3/4] transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                        <div className="w-full h-full rounded-t-full overflow-hidden border-[16px] border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] relative">
                            <Image
                                src={event.image1Url || theme.image1Url || ""}
                                alt="Main portrait"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40" />
                        </div>
                        {/* Arched border accent */}
                        <div className="absolute -inset-4 border-2 border-[var(--t-primary)]/10 rounded-t-full -z-10" />
                    </div>
                )}

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-30">
                    <ChevronDown className="w-8 h-8" />
                </div>
            </header>

            {/* Crystal Section */}
            <section className="py-32 px-6 relative bg-white overflow-hidden">
                {/* Decorative Floral/Crystal Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 opacity-5 pointer-events-none -mr-32 -mt-32">
                    <svg viewBox="0 0 200 200" className="w-full h-full text-[var(--t-primary)] fill-current transition-transform duration-1000">
                        <path d="M100,20 C140,20 180,60 180,100 C180,140 140,180 100,180 C60,180 20,140 20,100 C20,60 60,20 100,20 Z" />
                    </svg>
                </div>

                <div className="max-w-2xl mx-auto text-center space-y-16">
                    <div className="space-y-6">
                        <div className="w-12 h-12 rounded-full border border-current/20 flex items-center justify-center mx-auto">
                            <QuoteIcon className="w-4 h-4 opacity-40" />
                        </div>
                        {event.quote && (
                            <blockquote className="text-2xl sm:text-3xl font-light italic leading-relaxed px-4 opacity-80">
                                &quot;{event.quote}&quot;
                            </blockquote>
                        )}
                    </div>

                    <div className="mt-12 space-y-4">
                        <p className="text-xl font-light tracking-[0.3em]">{formatDate(event.eventDate).split(',')[1]}</p>
                        <div className="h-px w-24 bg-current mx-auto opacity-20" />
                        <p className="text-sm uppercase tracking-[0.6em] opacity-60">The Enchantment Begins</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12">
                        <div className="space-y-4 p-8 rounded-3xl bg-blue-50/50 border border-current/5 backdrop-blur-sm">
                            <h3 className="text-sm uppercase tracking-[0.4em] opacity-50">When</h3>
                            <p className="text-xl font-medium">{new Date(event.eventDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <div className="h-px w-8 bg-current/20 mx-auto" />
                            <p className="text-sm opacity-60">Doors Open At {formatTime(sortedSchedules[0]?.time || '18:00')}</p>
                        </div>
                        <div className="space-y-4 p-8 rounded-3xl bg-blue-50/50 border border-current/5 backdrop-blur-sm">
                            <h3 className="text-sm uppercase tracking-[0.4em] opacity-50">Where</h3>
                            <p className="text-xl font-medium truncate">{event.locationText}</p>
                            <div className="h-px w-8 bg-current/20 mx-auto" />
                            <p className="text-sm opacity-60">{event.locationProvince}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Image Grid Section */}
            {(event.image2Url || theme.image2Url) && (
                <section className="py-24 px-6 bg-slate-50">
                    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl font-light italic leading-snug">
                                Every moment shared, a treasure found.
                            </h2>
                            <p className="text-lg opacity-60 font-serif italic">We are so grateful to have you by our side as we begin this new journey together.</p>
                        </div>
                        <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl rotate-2">
                            <Image src={event.image2Url || theme.image2Url || ""} alt="Portrait" fill className="object-cover" />
                            <div className="absolute inset-0 border-[12px] border-white/30" />
                        </div>
                    </div>
                </section>
            )}

            {/* Timeline Section */}
            <section className="py-32 px-6 bg-white">
                <div className="max-w-xl mx-auto">
                    <div className="text-center mb-20 space-y-4">
                        <Music className="w-6 h-6 mx-auto opacity-20" />
                        <h2 className="text-3xl font-serif italic">Our Celebration Flow</h2>
                        <div className="flex items-center justify-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-current opacity-20" />
                            <div className="w-1 h-1 rounded-full bg-current opacity-40" />
                            <div className="w-1 h-1 rounded-full bg-current opacity-20" />
                        </div>
                    </div>

                    <div className="space-y-0 relative">
                        {/* Center Line */}
                        <div className="absolute left-1/2 top-4 bottom-4 w-px bg-current/10" />

                        {sortedSchedules.map((item, idx) => (
                            <div key={item.id} className={`flex items-center gap-8 mb-12 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={`flex-1 ${idx % 2 === 0 ? 'text-right' : 'text-left'}`}>
                                    <p className="text-xs uppercase tracking-[0.3em] font-black opacity-30">{formatTime(item.time)}</p>
                                    <h3 className="text-xl font-light mt-1">{item.title}</h3>
                                </div>
                                <div className="relative z-10 w-4 h-4 rounded-full bg-white border-2 border-current shadow-lg ring-8 ring-blue-50" />
                                <div className="flex-1" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dress Code Palette */}
            {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                <section className="py-32 px-6 bg-slate-50 text-center">
                    <div className="max-w-2xl mx-auto space-y-12">
                        <h2 className="text-sm uppercase tracking-[0.5em] opacity-40">Dress Code Colors</h2>
                        <div className="flex justify-center gap-6 sm:gap-10">
                            {event.dressCodeColors.map((color, idx) => (
                                <div key={idx} className="space-y-4 group">
                                    <div
                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-xl group-hover:scale-110 transition-transform duration-500"
                                        style={{ backgroundColor: color }}
                                    />
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">{color}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-sm italic opacity-50 pt-8">Your coordination adds to the harmony of our day.</p>
                    </div>
                </section>
            )}

            {/* RSVP */}
            {event.collectRsvp && (
                <section className="py-32 px-6 bg-white">
                    <div className="max-w-md mx-auto space-y-12">
                        <div className="text-center space-y-6">
                            <h2 className="text-4xl font-serif italic">Will You Join Us?</h2>
                            <p className="text-xs uppercase tracking-[0.4em] opacity-40">Kindly respond by the end of the month</p>
                        </div>
                        <div className="p-8 sm:p-12 rounded-[3rem] bg-slate-50/80 border border-current/5 shadow-inner">
                            <RsvpForm eventId={event.id} primaryColor="#5D7A8C" />
                        </div>
                    </div>
                </section>
            )}

            <footer className="py-32 px-6 text-center bg-white border-t border-current/5">
                <div className="max-w-md mx-auto space-y-10 opacity-60 hover:opacity-100 transition-opacity">
                    <p className="text-3xl font-light tracking-tighter italic">
                        {event.groomName} <span className="opacity-20 not-italic mx-2 px-2 border-x border-current/20">and</span> {event.brideName}
                    </p>
                    <div className="space-y-4">
                        <p className="text-[8px] uppercase tracking-[0.8em] font-medium">Niche E-Invitation — Designed by Hearts</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
