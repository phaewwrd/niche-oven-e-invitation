"use client";

import React from "react";
import Image from "next/image";
import {
    Calendar as CalendarIcon,
    MapPin,
    Clock,
    Heart,
    Camera,
    Info
} from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";

interface ThemeProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
}

const MONTHS_RU = [
    "января", "февраля", "марта", "апреля", "мая", "июня",
    "июля", "августа", "сентября", "октября", "ноября", "декабря"
];

const MONTHS_EN = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export default function ThemeSweetWine({ event, theme, schedules }: ThemeProps) {
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
        <div className="min-h-screen bg-[#f9f7f2] text-[#6d1313] font-serif selection:bg-[#6d1313]/10">
            {/* Header */}
            <header className="px-6 py-16 sm:py-20 text-center space-y-6 sm:space-y-8 animate-in fade-in duration-1000">
                <h1 className="text-4xl sm:text-6xl font-serif flex flex-col items-center gap-2 px-4 text-balance">
                    <span className="italic">{event.groomName}</span>
                    <span className="text-xl sm:text-2xl font-sans font-light opacity-50">&</span>
                    <span className="italic">{event.brideName}</span>
                </h1>
                <div className="text-[10px] sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] font-sans font-light border-t border-b border-[#6d1313]/10 py-3 inline-block px-8 sm:px-10">
                    {day.toString().padStart(2, '0')}.{(month + 1).toString().padStart(2, '0')}.{year.toString().slice(-2)}
                </div>
            </header>

            {/* Images Grid */}
            <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 gap-3 sm:gap-4 mb-20 sm:mb-24">
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm hover:-translate-y-1 transition-transform duration-500">
                    <Image
                        src={event.image1Url || theme.image1Url || ""}
                        alt="Portrait 1"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm hover:-translate-y-1 transition-transform duration-500 delay-75">
                    <Image
                        src={event.image2Url || theme.image2Url || ""}
                        alt="Portrait 2"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Intro Text */}
            <section className="max-w-2xl mx-auto px-6 text-center space-y-10 sm:space-y-12 mb-24 sm:mb-32">
                <div className="text-[10px] sm:text-xs tracking-[0.3em] sm:tracking-[0.4em] uppercase opacity-50 font-sans font-bold">Dear Friends!</div>
                <p className="text-lg sm:text-xl leading-relaxed opacity-80 max-w-lg mx-auto italic px-4">
                    {event.quote || "We are so happy to share this special day with you! Your support and presence make our holiday unforgettable."}
                </p>
                <div className="flex justify-center flex-col items-center gap-2">
                    <div className="w-12 h-[1px] bg-[#6d1313]/20" />
                    <Heart className="w-6 h-6 text-[#6d1313]/30 fill-current" />
                    <div className="w-12 h-[1px] bg-[#6d1313]/20" />
                </div>
            </section>

            {/* Date Section with Heart Calendar */}
            <section className="bg-white py-20 sm:py-32 px-6">
                <div className="max-w-xl mx-auto text-center space-y-10 sm:space-y-12">
                    <h3 className="text-lg sm:text-xl tracking-[0.2em] uppercase font-sans font-bold opacity-60">Wedding Date</h3>

                    <div className="p-6 sm:p-10 bg-[#f9f7f2]/50 rounded-lg inline-block shadow-sm">
                        <div className="grid grid-cols-7 gap-y-3 sm:gap-y-4 gap-x-3 sm:gap-x-8 text-center text-[10px] sm:text-sm font-sans">
                            {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((d, i) => (
                                <span key={i} className="font-bold opacity-30 text-[8px] sm:text-[10px]">{d}</span>
                            ))}
                            {matrix.map((row, i) => row.map((d, j) => (
                                <div key={`${i}-${j}`} className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8">
                                    {d === day && (
                                        <div className="absolute inset-0 flex items-center justify-center text-[#6d1313]">
                                            <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-[#6d1313]/10 stroke-[#6d1313]/20" />
                                        </div>
                                    )}
                                    <span className={`relative ${d === day ? 'font-black' : 'opacity-60'}`}>
                                        {d}
                                    </span>
                                </div>
                            )))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Sections */}
            <section className="py-20 sm:py-32 px-6 space-y-20 sm:space-y-24 max-w-4xl mx-auto">
                <div className="space-y-10 sm:space-y-12 text-balance">
                    <div className="flex items-center justify-center gap-4 text-center">
                        <div className="w-8 sm:w-12 h-[1px] bg-[#6d1313]/10" />
                        <h3 className="text-xl sm:text-2xl font-serif italic">Program</h3>
                        <div className="w-8 sm:w-12 h-[1px] bg-[#6d1313]/10" />
                    </div>

                    <div className="space-y-12 sm:space-y-16">
                        {schedules.map((item, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-4 text-center group">
                                <div className="p-3 sm:p-4 bg-white rounded-full border border-[#6d1313]/5 shadow-sm group-hover:scale-110 transition-transform">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 opacity-30" />
                                </div>
                                <div className="space-y-1 px-4">
                                    <span className="text-[10px] sm:text-xs font-sans font-bold tracking-widest opacity-40">{item.time}</span>
                                    <h4 className="text-lg sm:text-xl font-serif italic leading-tight">{item.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location Card */}
                <div className="space-y-10 sm:space-y-12">
                    <div className="flex items-center justify-center gap-4 text-center">
                        <div className="w-8 sm:w-12 h-[1px] bg-[#6d1313]/10" />
                        <h3 className="text-xl sm:text-2xl font-serif italic">Location</h3>
                        <div className="w-8 sm:w-12 h-[1px] bg-[#6d1313]/10" />
                    </div>

                    <div className="bg-[#6d1313] text-white p-8 sm:p-12 text-center rounded-sm space-y-6 shadow-2xl mx-4 sm:mx-0">
                        <MapPin className="w-8 h-8 sm:w-10 sm:h-10 mx-auto opacity-30" />
                        <div className="space-y-2">
                            <p className="font-serif italic text-lg sm:text-xl px-2">{event.locationText}</p>
                            {(event.locationProvince || event.locationCountry) && (
                                <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-sans opacity-60">
                                    {[event.locationProvince, event.locationCountry].filter(Boolean).join(", ")}
                                </p>
                            )}
                        </div>
                        {event.googleMapsUrl && (
                            <a
                                href={event.googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block border border-white/30 px-8 sm:px-10 py-3 sm:py-4 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-widest hover:bg-white hover:text-[#6d1313] transition-all"
                            >
                                Open Maps
                            </a>
                        )}
                    </div>
                </div>

                {/* Dress Code Section */}
                <div className="space-y-10 sm:space-y-12 text-center text-balance overflow-hidden px-4">
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-8 sm:w-12 h-[1px] bg-[#6d1313]/10" />
                        <h3 className="text-xl sm:text-2xl font-serif italic">Dress Code</h3>
                        <div className="w-8 sm:w-12 h-[1px] bg-[#6d1313]/10" />
                    </div>
                    <p className="text-[10px] sm:text-xs opacity-60 leading-relaxed font-sans max-w-xs mx-auto mb-8 uppercase tracking-widest font-light">Please favor subtle shades of wine and cream.</p>
                    <div className="flex justify-center items-center gap-4 sm:gap-6 flex-wrap">
                        {(event.dressCodeColors || []).map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-2">
                                <div
                                    style={{ backgroundColor: color }}
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white shadow-xl transform hover:scale-110 transition-transform"
                                />
                                <span className="text-[8px] uppercase tracking-tighter opacity-30">{color}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer Form / RSVP Placeholder */}
            <footer className="bg-[#f9f7f2] py-20 sm:py-32 px-6 border-t border-[#6d1313]/5">
                <div className="max-w-lg mx-auto text-center space-y-10 sm:space-y-12">
                    <div className="space-y-4">
                        <h4 className="text-xl sm:text-2xl font-serif italic">RSVP</h4>
                        <p className="text-[10px] sm:text-xs font-sans font-bold tracking-[0.2em] sm:tracking-[0.3em] uppercase opacity-40">Will you be there?</p>
                    </div>

                    {event.collectRsvp ? (
                        <RsvpForm eventId={event.id} primaryColor={theme.primaryColor} />
                    ) : (
                        <div className="space-y-6">
                            <div className="w-full bg-white border border-[#6d1313]/10 rounded-sm p-4 text-left font-sans text-[10px] sm:text-xs opacity-50">Name & Surname</div>
                            <button className="w-full bg-[#6d1313] text-white py-4 sm:py-5 text-[10px] sm:text-xs font-sans font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] hover:brightness-110 transition-all">Submit</button>
                        </div>
                    )}

                    <p className="text-2xl sm:text-3xl font-serif italic pt-8 sm:pt-12 opacity-80">See you soon!</p>
                </div>
            </footer>
        </div>
    );
}
