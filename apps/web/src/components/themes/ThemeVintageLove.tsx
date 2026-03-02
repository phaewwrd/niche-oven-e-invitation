"use client";

import React from "react";
import Image from "next/image";
import {
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    Info,
    Heart,
    Camera,
    Gift,
    Instagram,
    ChevronDown
} from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";

interface ThemeProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
}

const MONTHS_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function ThemeVintageLove({ event, theme, schedules }: ThemeProps) {
    const eventDate = new Date(event.eventDate);
    const day = eventDate.getDate();
    const month = eventDate.getMonth();
    const year = eventDate.getFullYear();

    return (
        <div className="min-h-screen bg-[#e8e4e1] text-[#2c2c2c] font-serif selection:bg-[#8d6e63]/30">
            {/* Hero Section */}
            <header className="relative min-h-screen grid grid-cols-1 md:grid-cols-2">
                <div className="bg-[#dcd6d1] flex flex-col items-center justify-center p-8 sm:p-12 text-center z-10">
                    <div className="space-y-6">
                        <span className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-50 block mb-4">You are invited to the wedding of</span>
                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif text-[#1a1a1a] flex flex-col gap-2">
                            <span className="italic">{event.groomName}</span>
                            <span className="text-xl opacity-30 tracking-widest font-sans">&</span>
                            <span className="italic">{event.brideName}</span>
                        </h1>

                        {/* Large LOVE Graphic */}
                        <div className="relative mt-12 sm:mt-20 mb-12 sm:mb-20 pointer-events-none overflow-hidden">
                            <div className="text-[10rem] sm:text-[14rem] lg:text-[18rem] font-bold leading-none select-none opacity-[0.03] tracking-tighter">
                                LOVE
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-6xl sm:text-8xl lg:text-9xl font-serif italic text-transparent bg-clip-text bg-gradient-to-br from-[#1a1a1a] to-[#4a4a4a]">
                                    L
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="w-12 h-[1px] bg-[#1a1a1a]/20 mx-auto mb-6" />
                            <p className="text-xl sm:text-2xl font-serif tracking-widest uppercase">
                                {day.toString().padStart(2, '0')}.{(month + 1).toString().padStart(2, '0')}.{year.toString().slice(-2)}
                            </p>
                            <p className="text-[10px] font-bold tracking-[0.5em] uppercase opacity-40">Save the Date</p>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[50vh] md:min-h-screen overflow-hidden">
                    <Image
                        src={event.image1Url || theme.image1Url || ""}
                        alt="Background"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[#3e2723]/10" />

                    {/* Vertical Side Text */}
                    <div className="absolute top-0 right-10 h-full flex flex-col justify-center">
                        <span className="text-white transform -rotate-90 origin-right text-[10px] font-black tracking-[1em] uppercase opacity-20 whitespace-nowrap">
                            When the sunset kisses the meadow
                        </span>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 md:hidden animate-bounce text-[#1a1a1a]/40">
                    <ChevronDown className="w-6 h-6" />
                </div>
            </header>

            {/* Intro Section */}
            <section className="py-20 sm:py-32 px-6">
                <div className="max-w-3xl mx-auto text-center space-y-12">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-8 sm:w-12 h-[1px] bg-[#1a1a1a]/10" />
                        <div className="w-10 h-10 border border-[#1a1a1a]/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-serif italic">{event.groomName[0]}{event.brideName[0]}</span>
                        </div>
                        <div className="w-8 sm:w-12 h-[1px] bg-[#1a1a1a]/10" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-serif italic">Dearest guests</h2>
                    <p className="text-base sm:text-lg text-[#1a1a1a]/60 leading-relaxed font-serif max-w-xl mx-auto">
                        {event.quote || "Life is only meaningful when shared with someone special. We cordially invite you to celebrate the beginning of our forever together."}
                    </p>

                    <div className="text-xl sm:text-2xl font-serif tracking-widest border-t border-b border-[#1a1a1a]/5 py-6 sm:py-8 inline-block px-8 sm:px-12">
                        {day} {MONTHS_EN[month]} {year}
                    </div>
                </div>
            </section>

            {/* Visual Break */}
            <section className="min-h-[60vh] py-12 relative overflow-hidden flex items-center justify-center">
                <Image
                    src={event.image2Url || theme.image2Url || ""}
                    alt="Atmospheric"
                    fill
                    className="object-cover fixed"
                />
                <div className="absolute inset-0 bg-[#1a1a1a]/20" />
                <div className="relative z-10 w-full max-w-lg px-6">
                    <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 text-center shadow-2xl">
                        <h3 className="text-xl sm:text-2xl font-serif italic mb-6">Location</h3>
                        <div className="space-y-4">
                            <p className="text-xs sm:text-sm uppercase tracking-widest opacity-70 leading-relaxed">
                                {event.locationText}
                                {(event.locationProvince || event.locationCountry) && (
                                    <span className="block mt-2 opacity-50">
                                        {[event.locationProvince, event.locationCountry].filter(Boolean).join(", ")}
                                    </span>
                                )}
                            </p>
                            {event.googleMapsUrl && (
                                <a
                                    href={event.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 text-[10px] font-black uppercase tracking-[0.3em] border-b border-[#1a1a1a] pb-1"
                                >
                                    Open Maps
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Timing & Program */}
            <section className="py-20 sm:py-32 px-6">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
                    <div className="space-y-8 sm:space-y-12">
                        <h2 className="text-3xl sm:text-4xl font-serif italic">Timing</h2>
                        <div className="space-y-8 sm:space-y-12">
                            {schedules.map((item, idx) => (
                                <div key={idx} className="flex gap-8 group">
                                    <div className="text-[10px] sm:text-sm font-black opacity-30 tracking-[0.2em] transform -rotate-90 h-fit mt-1">{item.time}</div>
                                    <div className="space-y-2">
                                        <h4 className="text-lg sm:text-xl font-serif italic group-hover:text-[#8d6e63] transition-colors">{item.title}</h4>
                                        <div className="w-8 h-[1px] bg-[#1a1a1a]/10" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-12">
                        <h2 className="text-4xl font-serif italic">Dress Code</h2>
                        <p className="text-sm text-[#1a1a1a]/50 leading-relaxed italic">Your presence is our greatest gift, but if you wish to follow our theme, we suggest these elegant palettes.</p>

                        <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Women</span>
                                <div className="flex gap-2">
                                    {(event.dressCodeColors || []).slice(0, 3).map((color, i) => (
                                        <div key={i} style={{ backgroundColor: color }} className="w-8 h-8 rounded-full shadow-inner" />
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Man</span>
                                <div className="flex gap-2">
                                    <div style={{ backgroundColor: '#1a1a1a' }} className="w-8 h-8 rounded-full shadow-inner" />
                                    <div style={{ backgroundColor: '#ffffff' }} className="w-8 h-8 rounded-full border border-black/5 shadow-inner" />
                                </div>
                            </div>
                        </div>

                        {/* Gift Wish */}
                        <div className="pt-20 space-y-4">
                            <h3 className="text-2xl font-serif italic">Wishes</h3>
                            <p className="text-xs text-[#1a1a1a]/50 leading-relaxed uppercase tracking-widest">In lieu of traditional bouquets, we would be delighted with wine or a contribution to our future home.</p>
                            <button className="text-[10px] font-black uppercase tracking-widest bg-[#1a1a1a] text-white px-8 py-4 w-full sm:w-auto">Contribution</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* RSVP Section */}
            {event.collectRsvp && (
                <section className="py-20 sm:py-32 px-6 bg-[#dcd6d1]">
                    <div className="max-w-xl mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-serif italic">Will you join us?</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Please respond by our date</p>
                        </div>
                        <RsvpForm eventId={event.id} primaryColor={theme.primaryColor} />
                    </div>
                </section>
            )}

            {/* Footer Contacts */}
            <footer className="bg-[#1a1a1a] text-white py-24 px-6 text-center">
                <div className="max-w-2xl mx-auto space-y-12">
                    <span className="text-[10px] font-black uppercase tracking-[1em] opacity-30 block">Contacts</span>
                    <p className="text-xs opacity-50 uppercase tracking-widest leading-relaxed">For any questions regarding our wedding, feel free to reach out to our coordinator.</p>

                    <div className="flex flex-col items-center gap-4">
                        <div className="flex gap-6">
                            <a href="#" className="p-3 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                        </div>
                        <span className="text-[10px] font-black tracking-widest opacity-20 mt-12 lowercase">by niche e-invitation</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
