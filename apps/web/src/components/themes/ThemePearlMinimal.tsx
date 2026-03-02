"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { MapPin, Heart, Clock, Camera, Utensils, Music, GlassWater, Gift } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import '../../ThemePearlMinimal.module.css';

interface ThemeProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
}

function formatDateShort(date: Date | string) {
    const d = new Date(date);
    return d.toLocaleDateString("en-GB").replace(/\//g, ".");
}

function Countdown({ targetDate }: { targetDate: Date | string }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(targetDate).getTime();
            const distance = target - now;

            if (distance < 0) {
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex justify-center gap-6">
            {[
                { label: 'days', value: timeLeft.days },
                { label: 'hr', value: timeLeft.hours },
                { label: 'min', value: timeLeft.minutes },
                { label: 'sec', value: timeLeft.seconds }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <span className="text-xl font-medium">{item.value}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-40">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export default function ThemePearlMinimal({ event, theme, schedules, isExpired }: ThemeProps) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div
            className="min-h-screen pb-20"
            style={{
                backgroundColor: "#f7f5f2",
                color: "#4a4a4a",
                fontFamily: `'Cormorant Garamond', serif`
            }}
        >


            {isExpired && (
                <div className="bg-neutral-800 text-white py-2 text-center text-xs tracking-widest uppercase">
                    This invitation has expired
                </div>
            )}

            {/* HERO */}
            <header className="pt-16 sm:pt-24 pb-14 sm:pb-20 px-6 text-center">
                {/* Names */}
                <div className="mb-12 sm:mb-14 fade-up">
                    <h1 className="text-3xl sm:text-5xl font-serif font-medium leading-[1.2] tracking-wide">
                        {event.groomName}
                        <span
                            className="block my-3"
                            style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(1.6rem, 5vw, 2.8rem)", opacity: 0.35 }}
                        >
                            &amp;
                        </span>
                        {event.brideName}
                    </h1>
                </div>

                {/* Portrait — oval with layered rings + floating petals effect */}
                <div className="relative inline-block mb-12 fade-up fade-up-delay-1">
                    {/* Outer soft ring */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            margin: "-14px",
                            border: "1px solid rgba(74,74,74,0.08)",
                            borderRadius: "999px",
                        }}
                    />
                    {/* Mid ring */}
                    <div
                        className="absolute inset-0 rounded-full"
                        style={{
                            margin: "-7px",
                            border: "1px solid rgba(74,74,74,0.12)",
                            borderRadius: "999px",
                        }}
                    />
                    {/* Frame with corner accents */}
                    <div
                        className="portrait-frame relative"
                        style={{ padding: "6px" }}
                    >
                        <div
                            className="overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.10)]"
                            style={{
                                width: "clamp(200px, 52vw, 280px)",
                                aspectRatio: "3/4",
                                borderRadius: "999px",
                                border: "10px solid #fff",
                                position: "relative",
                            }}
                        >
                            <Image
                                src={event.image1Url || theme.image1Url || ""}
                                fill
                                className="object-cover"
                                style={{ transform: "scale(1.03)", transition: "transform 8s ease" }}
                                alt="Couple"
                                priority
                            />
                            {/* Subtle inner vignette */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: "radial-gradient(ellipse at center, transparent 55%, rgba(247,245,242,0.35) 100%)",
                                    borderRadius: "inherit",
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Date line */}
                <div className="fade-up fade-up-delay-2">
                    <div className="flex items-center justify-center gap-4">
                        <div className="h-px w-10 sm:w-16 bg-black/10" />
                        <span className="text-lg sm:text-xl tracking-[0.25em] font-light">
                            {formatDateShort(event.eventDate)}
                        </span>
                        <div className="h-px w-10 sm:w-16 bg-black/10" />
                    </div>
                    <div className="mt-5">
                        <Heart className="w-3.5 h-3.5 mx-auto opacity-15 fill-current" />
                    </div>
                </div>
            </header>

            {/* INTRO */}
            <section className="py-14 sm:py-20 px-6 sm:px-8 text-center max-w-lg mx-auto border-t border-black/5">
                <h2 className="text-xl sm:text-2xl font-serif tracking-[0.2em] uppercase mb-6 sm:mb-8 opacity-80">Dear Guests!</h2>
                <p className="text-base sm:text-lg leading-relaxed italic opacity-60">
                    This day will be special for us! With great joy and love, we invite you to our wedding.
                </p>

                {/* Detail image — landscape with tilt + offset layered shadow */}
                <div className="mt-12 sm:mt-16 relative">
                    {/* Ghost layer for depth */}
                    <div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                            transform: "rotate(1.5deg) translate(6px, 6px)",
                            backgroundColor: "rgba(74,74,74,0.06)",
                            borderRadius: "1rem",
                        }}
                    />
                    <div className="detail-image-wrapper relative">
                        <div
                            className="relative overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.10)]"
                            style={{
                                aspectRatio: "16/10",
                                borderRadius: "1rem",
                                border: "8px solid #fff",
                            }}
                        >
                            <Image
                                src={event.image2Url || theme.image2Url || ""}
                                fill
                                className="object-cover"
                                alt="Wedding detail"
                            />
                            {/* Slight warm overlay for cohesion */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{
                                    background: "linear-gradient(to bottom, transparent 60%, rgba(247,245,242,0.25) 100%)",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* LOCATION */}
            <section className="py-12 sm:py-16 px-6 sm:px-8 text-center max-w-lg mx-auto text-balance">
                <h2 className="text-xl sm:text-2xl font-serif tracking-[0.2em] uppercase mb-6 sm:mb-8 opacity-80">Location</h2>
                <div className="space-y-6">
                    <p className="text-base sm:text-lg italic opacity-60">
                        {event.locationText || 'Beautiful Wedding Hall'}
                        {(event.locationProvince || event.locationCountry) && (
                            <span className="block text-xs not-italic uppercase tracking-widest mt-2 opacity-40 font-sans">
                                {[event.locationProvince, event.locationCountry].filter(Boolean).join(", ")}
                            </span>
                        )}
                    </p>
                    {event.googleMapsUrl && (
                        <div className="pt-2 sm:pt-4">
                            <a
                                href={event.googleMapsUrl}
                                target="_blank"
                                className="inline-block px-8 sm:px-10 py-3 rounded-full border border-black/10 text-[10px] sm:text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                            >
                                View on Map
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* TIMELINE */}
            <section className="py-12 sm:py-16 px-6 sm:px-8 max-w-lg mx-auto">
                <h2 className="text-xl sm:text-2xl font-serif tracking-[0.2em] uppercase mb-10 sm:mb-12 opacity-80 text-center">Program</h2>
                <div className="space-y-10 sm:space-y-12">
                    {sortedSchedules.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-6 sm:gap-8">
                            <div className="pt-1">
                                <div className="p-2 sm:p-3 bg-white rounded-full shadow-sm border border-black/5">
                                    {idx === 0 ? <MapPin className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" /> :
                                        idx === 1 ? <Heart className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" /> :
                                            idx === 2 ? <Camera className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" /> :
                                                idx === 3 ? <Utensils className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" /> :
                                                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 opacity-40" />}
                                </div>
                            </div>
                            <div className="flex-1 pb-4 border-b border-black/5">
                                <div className="text-base sm:text-lg font-medium">{item.time}</div>
                                <div className="text-xs sm:text-sm opacity-50 italic">{item.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* DRESS CODE */}
            {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                <section className="py-12 sm:py-16 px-6 sm:px-8 text-center max-w-lg mx-auto">
                    <h2 className="text-xl sm:text-2xl font-serif tracking-[0.2em] uppercase mb-6 sm:mb-8 opacity-80">Dress Code</h2>
                    <p className="text-xs sm:text-sm italic opacity-50 mb-8 sm:mb-10">We will be happy if you follow the color palette of our wedding:</p>
                    <div className="flex justify-center gap-3 sm:gap-4">
                        {event.dressCodeColors.map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3">
                                <div
                                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-md border-4 border-white transition-transform hover:scale-110"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-[10px] uppercase tracking-tighter opacity-30">{color}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* RSVP */}
            <section className="py-12 sm:py-16 px-6 sm:px-8 text-center max-w-lg mx-auto">
                <h2 className="text-xl sm:text-2xl font-serif tracking-[0.2em] uppercase mb-6 sm:mb-8 opacity-80">Details</h2>
                <p className="text-xs sm:text-sm italic opacity-50 mb-6 sm:mb-8 text-balance">If you have any questions, please contact our coordinator:</p>
                {event.collectRsvp ? (
                    <div className="mt-8">
                        <RsvpForm eventId={event.id} primaryColor="#4a4a4a" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button className="w-full py-4 rounded-full border border-black/10 text-[10px] sm:text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm">
                            Contact Us
                        </button>
                        <button className="w-full py-4 rounded-full bg-[#4a4a4a] text-white text-[10px] sm:text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">
                            Fill out the RSVP form
                        </button>
                    </div>
                )}
            </section>

            {/* COUNTDOWN */}
            <section className="py-16 px-8 text-center bg-white/30 backdrop-blur-sm border-y border-black/5">
                <div className="max-w-lg mx-auto">
                    <p className="text-sm italic opacity-40 mb-8">Until the wedding left:</p>
                    <Countdown targetDate={event.eventDate} />
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 px-8 text-center">
                <p
                    className="opacity-40 mb-4"
                    style={{ fontFamily: "'Great Vibes', cursive", fontSize: "clamp(1.4rem, 5vw, 2rem)" }}
                >
                    With love,
                </p>
                <h2 className="text-3xl font-serif font-medium">{event.groomName} & {event.brideName}</h2>
                <div className="mt-12 opacity-20">
                    <div className="h-px w-24 mx-auto bg-black mb-4" />
                    <p className="text-[10px] uppercase tracking-[0.3em]">Niche E Design</p>
                </div>
            </footer>
        </div>
    );
}