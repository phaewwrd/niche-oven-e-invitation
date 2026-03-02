"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { Heart } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Playfair_Display } from "next/font/google"

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair",
})

interface ThemeProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
}

function formatDay(date: Date | string) {
    const d = new Date(date);
    return d.getDate().toString().padStart(2, '0');
}

function formatMonth(date: Date | string) {
    const d = new Date(date);
    return (d.getMonth() + 1).toString().padStart(2, '0');
}

function formatYearShort(date: Date | string) {
    const d = new Date(date);
    return d.getFullYear().toString().slice(-2);
}

function formatTime(time: string) {
    if (time.includes(":")) {
        return time;
    }
    return time;
}

export default function ThemeLuxuryMonochrome({ event, theme, schedules, isExpired }: ThemeProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

    const themeVars = {
        "--t-primary": "#ffffff",
        "--t-secondary": "#a1a1a1",
        "--t-accent": "#ffffff",
        "--t-bg": "#000000",
        "--t-font": "'Playfair Display', serif",
    } as React.CSSProperties;

    return (
        <div
            style={{
                ...themeVars,
                backgroundColor: "#000000",
                fontFamily: playfair.className,
                color: "#ffffff",
            }}
            className="min-h-screen zoomOut"
        >

            {isExpired && (
                <div className="sticky top-0 z-50 py-3 px-6 text-center text-sm font-medium bg-white/10 backdrop-blur-md text-white border-b border-white/10">
                    This invitation has expired.
                </div>
            )}

            {/* 1. HERO HEADER */}
            <header className="relative h-screen w-full overflow-hidden">
                <div className="absolute inset-0">
                    <Image
                        src={event.image1Url || theme.image1Url || ""}
                        fill
                        alt="Wedding Hero"
                        className="w-full h-full object-cover filter grayscale brightness-75 transition-transform duration-[10s] ease-linear scale-110"
                        style={{ animation: isVisible ? 'zoomOut 10s forwards' : '' }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black" />
                </div>

                {/* Big Vertical Date Overlay as seen in picture */}
                <div className="absolute top-8 sm:top-12 right-6 sm:right-12 text-right z-10 select-none pointer-events-none">
                    <div className="flex flex-col items-end leading-none">
                        <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black opacity-90 drop-shadow-2xl">{formatDay(event.eventDate)}</span>
                        <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black opacity-90 drop-shadow-2xl">{formatMonth(event.eventDate)}</span>
                        <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black opacity-90 drop-shadow-2xl">{formatYearShort(event.eventDate)}</span>
                    </div>
                </div>

                <div className="absolute bottom-12 sm:bottom-20 left-6 sm:left-12 z-10 max-w-xl">
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black italic uppercase leading-none tracking-tighter">
                        {event.groomName} <br />
                        <span className="text-3xl sm:text-4xl font-light not-italic opacity-50">&</span> <br />
                        {event.brideName}
                    </h1>
                </div>
            </header>

            {/* 2. INTRO SECTION */}
            <section className="py-20 sm:py-32 px-6 sm:px-12 bg-white text-black">
                <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-8 sm:gap-12 items-center sm:items-start text-center sm:text-left">
                    <div className="flex sm:flex-col leading-none font-black text-3xl sm:text-4xl opacity-20 gap-4 sm:gap-0">
                        <span>{formatDay(event.eventDate)}</span>
                        <span>{formatMonth(event.eventDate)}</span>
                        <span>{formatYearShort(event.eventDate)}</span>
                    </div>
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-serif font-black italic uppercase mb-6 sm:mb-8 tracking-widest">INVITATION</h2>
                        <p className="text-lg leading-relaxed opacity-70 font-serif italic">
                            We invite you to share the joy of this special event and become part of our wedding story.
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. LOCATION CARD */}
            <section className="py-20 px-4 sm:px-6 bg-white text-black">
                <div className="max-w-md mx-auto bg-black text-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
                    <h2 className="text-3xl sm:text-4xl font-serif font-black italic uppercase text-center mb-6 sm:mb-8 tracking-tighter">LOCATION</h2>
                    <div className="text-center space-y-4 mb-8">
                        <p className="text-base sm:text-lg font-serif italic opacity-60 px-4">
                            {event.locationText}
                            {(event.locationProvince || event.locationCountry) && (
                                <span className="block text-sm not-italic uppercase tracking-widest mt-1 opacity-50">
                                    {[event.locationProvince, event.locationCountry].filter(Boolean).join(", ")}
                                </span>
                            )}
                        </p>
                        <div className="text-4xl sm:text-5xl font-black tracking-tighter">15:00</div>
                    </div>
                    {event.googleMapsUrl && (
                        <a
                            href={event.googleMapsUrl}
                            target="_blank"
                            className="block w-full text-center py-4 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-transform hover:scale-105"
                        >
                            Open Maps
                        </a>
                    )}
                </div>
            </section>

            {/* 4. TIMELINE / PROGRAMMA */}
            <section className="py-20 sm:py-32 bg-white text-black px-6 sm:px-12">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-serif font-black italic uppercase mb-12 sm:mb-16 tracking-widest text-center">PROGRAM</h2>

                    <div className="relative border-l-2 border-black/10 ml-4 sm:ml-8 pl-8 sm:pl-12 space-y-12 sm:space-y-16">
                        {sortedSchedules.map((item, idx) => (
                            <div key={idx} className="relative group">
                                <div className="absolute -left-[2.6rem] sm:-left-[3.4rem] top-2 w-4 h-4 bg-black rounded-full ring-8 ring-white transition-transform group-hover:scale-125" />
                                <div className="flex flex-col">
                                    <span className="text-lg sm:text-xl font-black tracking-tighter mb-1">{formatTime(item.time)}</span>
                                    <span className="text-xl sm:text-2xl font-serif italic opacity-60 leading-tight">{item.title}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. IMAGE BREAK */}
            {/* <section className="h-[80vh] w-full bg-black">
                <Image src={event.image2Url || theme.image2Url || ""} fill className="w-full h-full object-cover grayscale opacity-80" alt="Detail" />
            </section> */}

            {/* 6. DRESS CODE */}
            {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                <section className="py-20 px-4 sm:px-6 bg-white text-black">
                    <div className="max-w-md mx-auto bg-black text-white p-8 sm:p-12 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl">
                        <h2 className="text-2xl sm:text-3xl font-serif font-black italic uppercase text-center mb-6 sm:mb-8 tracking-widest">DRESS CODE</h2>
                        <p className="text-center text-xs sm:text-sm font-serif italic opacity-60 mb-8 sm:mb-10">
                            We will be grateful if you support the stylistic of our wedding
                        </p>
                        <div className="flex justify-center gap-3 sm:gap-4">
                            {event.dressCodeColors.map((color, idx) => (
                                <div key={idx} className="flex flex-col items-center gap-2">
                                    <div
                                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-white/20 shadow-lg transform transition-transform hover:scale-110"
                                        style={{ backgroundColor: color }}
                                    />
                                    <span className="text-[8px] font-black uppercase tracking-tighter opacity-30">{color}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* 6.5 INSPIRATION GALLERY */}
            <section className="py-20 sm:py-32 px-6 sm:px-12 bg-white text-black text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-serif font-black italic uppercase mb-10 sm:mb-12 tracking-widest">DLYA VDOHNOVENIYA</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                        <div className="relative aspect-[3/4] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl transform sm:-rotate-2 hover:rotate-0 transition-transform duration-500">
                            <Image alt="Inspiration 1" fill src={event.image1Url || theme.image1Url || ""} className="w-full h-full object-cover grayscale" />
                        </div>
                        <div className="relative aspect-[3/4] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl transform sm:rotate-2 hover:rotate-0 transition-transform duration-500 sm:mt-12">
                            <Image alt="Inspiration 2" fill src={event.image2Url || theme.image2Url || ""} className="w-full h-full object-cover grayscale" />
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. QUOTE SECTION */}
            {event.quote && (
                <section className="py-24 px-12 bg-black text-white text-center">
                    <div className="max-w-3xl mx-auto italic font-serif text-3xl opacity-80 leading-relaxed">
                        &ldquo;{event.quote}&rdquo;
                    </div>
                </section>
            )}

            {event.collectRsvp && (
                <section className="py-20 sm:py-32 px-6 sm:px-12 bg-black text-white">
                    <div className="max-w-xl mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-4xl sm:text-5xl font-serif font-black italic uppercase tracking-tighter">Will you be there?</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Please RSVP for our records</p>
                        </div>
                        <RsvpForm eventId={event.id} primaryColor="#ffffff" />
                    </div>
                </section>
            )}

            {/* FOOTER */}
            <footer className="py-20 sm:py-24 px-6 sm:px-12 bg-white text-black text-center border-t border-black/5">
                <div className="flex flex-col items-center gap-4">
                    <Heart className="w-6 h-6 opacity-20" />
                    <p className="text-xl sm:text-2xl font-serif italic opacity-40">Ready to celebrate with</p>
                    <h2 className="text-3xl sm:text-4xl font-serif font-black uppercase tracking-tighter italic">
                        {event.groomName} <span className="text-lg opacity-30 not-italic mx-2">&</span> {event.brideName}
                    </h2>
                </div>
            </footer>


        </div>
    );
}
