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
    Plane,
    Waves,
    Palmtree,
    Mail
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

export default function ThemeTropicalParadise({ event, theme, schedules }: ThemeProps) {
    const eventDate = new Date(event.eventDate);
    const day = eventDate.getDate();
    const month = eventDate.getMonth();
    const year = eventDate.getFullYear();

    // Generate calendar matrix
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Monday start
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const matrix = [];
    let week: (number | null)[] = Array(adjustedFirstDay).fill(null);

    days.forEach((d) => {
        week.push(d);
        if (week.length === 7) {
            matrix.push(week);
            week = [];
        }
    });
    if (week.length > 0) {
        while (week.length < 7) week.push(null);
        matrix.push(week);
    }

    return (
        <div className="min-h-screen bg-[#f7f3e9] text-[#2d4156] font-sans selection:bg-[#7ea9cb]/30">
            {/* Hero Section */}
            <div className="relative h-[70vh] sm:h-[80vh] md:h-[85vh] overflow-hidden">
                <Image
                    src={event.image1Url || theme.image1Url || ""}
                    alt="Tropical Paradise"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/10" />

                {/* Floating Polaroid */}
                <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="relative transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                        <div className="bg-white p-3 sm:p-4 pb-10 sm:pb-12 shadow-2xl rounded-sm">
                            <div className="relative aspect-square w-56 sm:w-80 md:w-96 overflow-hidden bg-gray-100">
                                <Image
                                    src={event.image2Url || theme.image2Url || ""}
                                    alt="Couple"
                                    fill
                                    className="object-cover"
                                />
                                {/* Tropical Stamp Overlay */}
                                <div className="absolute bottom-4 right-4 w-16 h-16 sm:w-20 sm:h-20 border-4 border-[#e88d67]/60 rounded-full flex items-center justify-center transform rotate-12">
                                    <div className="text-[8px] sm:text-[10px] font-black uppercase text-[#e88d67]/60 text-center leading-tight">
                                        SUNSET<br />VIBES
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute top-6 sm:top-10 left-6 sm:left-10 text-white animate-in slide-in-from-left duration-1000">
                    <span className="text-xl sm:text-2xl font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-70">{event.groomName} & {event.brideName}</span>
                </div>

                <div className="absolute bottom-16 sm:bottom-20 w-full text-center px-6">
                    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif italic text-white drop-shadow-lg tracking-tight">
                        wedding day
                    </h1>
                    <p className="mt-4 text-white/90 font-medium tracking-widest text-[10px] sm:text-sm uppercase">invite you to sunny paradise</p>
                </div>
            </div>

            {/* When Section */}
            <div className="max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
                <div className="inline-block relative mb-10 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl font-serif italic mb-2">when</h2>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-1 bg-[#7ea9cb] rounded-full" />
                </div>

                <p className="text-base sm:text-lg font-medium mb-10 sm:mb-12 tracking-wide uppercase opacity-70">{MONTHS_EN[month]}</p>

                {/* Calendar Grid */}
                <div className="inline-block bg-white/50 backdrop-blur-sm p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] shadow-sm border border-white/40">
                    <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4 gap-x-2 sm:gap-x-6">
                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                            <span key={i} className="text-[8px] sm:text-[10px] font-black opacity-30">{d}</span>
                        ))}
                        {matrix.map((row, i) => row.map((d, j) => (
                            <div key={`${i}-${j}`} className="relative flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10">
                                {d === day && (
                                    <div className="absolute inset-0 bg-[#e88d67] rounded-full shadow-lg shadow-[#e88d67]/40 scale-110" />
                                )}
                                <span className={`relative text-[10px] sm:text-xs font-bold ${d === day ? 'text-white' : 'opacity-60'}`}>
                                    {d}
                                </span>
                                {d === day && (
                                    <div className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 bg-[#7ea9cb] text-white text-[7px] sm:text-[8px] px-1.5 sm:px-2 py-0.5 rounded-full font-black uppercase whitespace-nowrap">
                                        Wedding
                                    </div>
                                )}
                            </div>
                        )))}
                    </div>
                </div>
            </div>

            {/* Details & Program */}
            <div className="bg-[#7ea9cb]/10 py-16 sm:py-24">
                <div className="max-w-4xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
                    {/* Program */}
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 mb-8">
                            <Palmtree className="w-6 h-6 sm:w-8 sm:h-8 text-[#7ea9cb]" />
                            <h2 className="text-2xl sm:text-3xl font-serif italic">program</h2>
                        </div>

                        <div className="space-y-8 sm:space-y-12">
                            {schedules.map((item, idx) => (
                                <div key={idx} className="relative pl-8 sm:pl-10 border-l-2 border-[#7ea9cb]/30 last:border-0 pb-2">
                                    <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-[#7ea9cb]" />
                                    <span className="text-[8px] sm:text-[10px] font-black uppercase text-[#7ea9cb] tracking-widest">{item.time}</span>
                                    <h3 className="text-lg sm:text-xl font-medium mt-1 leading-tight">{item.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Info Cards */}
                    <div className="space-y-6 sm:space-y-8">
                        {/* Event Details */}
                        <div className="bg-white p-8 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-[#7ea9cb]/5 space-y-4 transform hover:-translate-y-1 transition-transform">
                            <div className="flex items-center gap-4 text-[#7ea9cb] mb-4">
                                <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                                <h3 className="text-xl sm:text-2xl font-serif italic">location</h3>
                            </div>
                            <p className="text-[10px] sm:text-sm leading-relaxed opacity-80 uppercase tracking-widest">
                                {event.locationText}<br />
                                {event.locationProvince}, {event.locationCountry}
                            </p>
                            {event.googleMapsUrl && (
                                <a
                                    href={event.googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-black text-[#e88d67] uppercase tracking-widest group"
                                >
                                    open maps
                                    <Waves className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </a>
                            )}
                        </div>

                        {/* Dress Code */}
                        <div className="bg-white p-8 sm:p-10 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl shadow-[#7ea9cb]/5 space-y-6">
                            <div className="flex items-center gap-4 text-[#7ea9cb]">
                                <Info className="w-5 h-5 sm:w-6 sm:h-6" />
                                <h3 className="text-xl sm:text-2xl font-serif italic">dress code</h3>
                            </div>
                            <div className="flex flex-wrap gap-3 sm:gap-4">
                                {(event.dressCodeColors || []).map((color, idx) => (
                                    <div key={idx} className="flex flex-col items-center gap-2">
                                        <div
                                            style={{ backgroundColor: color }}
                                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#f7f3e9] shadow-inner"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quote Section */}
            <div className="py-32 px-6 text-center bg-white">
                <div className="max-w-2xl mx-auto relative">
                    <Heart className="w-12 h-12 text-[#e88d67]/20 absolute -top-16 left-1/2 -translate-x-1/2" />
                    <p className="text-2xl sm:text-3xl font-serif italic leading-relaxed text-[#2d4156]/80">
                        "{event.quote || "Love is the greatest adventure, and we're starting ours in paradise."}"
                    </p>
                </div>
            </div>

            {/* RSVP Section */}
            {event.collectRsvp && (
                <div className="py-24 sm:py-32 px-6 text-center bg-[#7ea9cb]/5">
                    <div className="max-w-xl mx-auto space-y-10 sm:space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-serif italic text-[#2d4156]">Will you be there?</h2>
                            <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#7ea9cb]">Reserve your spot in paradise</p>
                        </div>
                        <RsvpForm eventId={event.id} primaryColor={theme.primaryColor} />
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                {/* <Image
                    src={event.image2Url || "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80"}
                    alt="Couple"
                    fill
                    className="object-cover"
                /> */}
                <div className="absolute inset-0 " />
                <div className="relative z-10 text-center text-[#2d4156] px-6">
                    <span className="text-xs font-black uppercase tracking-[0.5em] mb-8 block">See you in paradise!</span>
                    <h2 className="text-6xl sm:text-8xl font-serif italic drop-shadow-2xl">See you!</h2>
                    <div className="mt-12 flex justify-center gap-8">
                        <a href="#" className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-[#2d4156] transition-all">
                            <Mail className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
