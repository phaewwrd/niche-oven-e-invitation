"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { MapPin, Heart, Clock, Camera, Utensils, Music, GlassWater, Gift } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { useEffect, useState } from "react";

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
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Great+Vibes&display=swap');
            `}</style>

            {isExpired && (
                <div className="bg-neutral-800 text-white py-2 text-center text-xs tracking-widest uppercase">
                    This invitation has expired
                </div>
            )}

            {/* HERO */}
            <header className="pt-20 pb-16 px-6 text-center">
                <div className="mb-12">
                    <h1 className="text-4xl sm:text-5xl font-serif font-medium leading-[1.2]">
                        {event.groomName} <br />
                        <span className="font-['Great_Vibes'] text-3xl opacity-40 my-2 block">&</span>
                        {event.brideName}
                    </h1>
                </div>

                {event.image1Url && (
                    <div className="max-w-[280px] mx-auto mb-10">
                        <div className="aspect-[3/4] rounded-full overflow-hidden border-[12px] border-white shadow-sm">
                            <img src={event.image1Url} className="w-full h-full object-cover" alt="Couple" />
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-center gap-4">
                    <div className="h-px w-12 bg-black/10" />
                    <div className="text-xl tracking-[0.2em] font-light">
                        {formatDateShort(event.eventDate)}
                    </div>
                    <div className="h-px w-12 bg-black/10" />
                </div>
                <div className="mt-4">
                    <Heart className="w-4 h-4 mx-auto opacity-20 fill-current" />
                </div>
            </header>

            {/* INTRO */}
            <section className="py-16 px-8 text-center max-w-lg mx-auto border-t border-black/5">
                <h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-8 opacity-80">Dear Guests!</h2>
                <p className="text-lg leading-relaxed italic opacity-60">
                    This day will be special for us! With great joy and love, we invite you to our wedding.
                </p>
                {event.image2Url && (
                    <div className="mt-12 rounded-2xl overflow-hidden shadow-sm aspect-video">
                        <img src={event.image2Url} className="w-full h-full object-cover" alt="Detail" />
                    </div>
                )}
            </section>

            {/* LOCATION */}
            <section className="py-16 px-8 text-center max-w-lg mx-auto">
                <h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-8 opacity-80">Location</h2>
                <div className="space-y-6">
                    <p className="text-lg italic opacity-60">{event.locationText || 'Beautiful Wedding Hall'}</p>
                    {event.googleMapsUrl && (
                        <div className="pt-4">
                            <a
                                href={event.googleMapsUrl}
                                target="_blank"
                                className="inline-block px-10 py-3 rounded-full border border-black/10 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                            >
                                View on Map
                            </a>
                        </div>
                    )}
                </div>
            </section>

            {/* TIMELINE */}
            <section className="py-16 px-8 max-w-lg mx-auto">
                <h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-12 opacity-80 text-center">Program</h2>
                <div className="space-y-12">
                    {sortedSchedules.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-8">
                            <div className="pt-1">
                                <div className="p-3 bg-white rounded-full shadow-sm border border-black/5">
                                    {idx === 0 ? <MapPin className="w-5 h-5 opacity-40" /> :
                                        idx === 1 ? <Heart className="w-5 h-5 opacity-40" /> :
                                            idx === 2 ? <Camera className="w-5 h-5 opacity-40" /> :
                                                idx === 3 ? <Utensils className="w-5 h-5 opacity-40" /> :
                                                    <Clock className="w-5 h-5 opacity-40" />}
                                </div>
                            </div>
                            <div className="flex-1 pb-4 border-b border-black/5">
                                <div className="text-lg font-medium">{item.time}</div>
                                <div className="text-sm opacity-50 italic">{item.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* DRESS CODE */}
            {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                <section className="py-16 px-8 text-center max-w-lg mx-auto">
                    <h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-8 opacity-80">Dress Code</h2>
                    <p className="text-sm italic opacity-50 mb-10">We will be happy if you follow the color palette of our wedding:</p>
                    <div className="flex justify-center gap-4">
                        {event.dressCodeColors.map((color, idx) => (
                            <div key={idx} className="flex flex-col items-center gap-3">
                                <div
                                    className="w-12 h-12 rounded-full shadow-md border-4 border-white transition-transform hover:scale-110"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-[10px] uppercase tracking-tighter opacity-30">{color}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* QUESTIONS/RSVP */}
            <section className="py-16 px-8 text-center max-w-lg mx-auto">
                <h2 className="text-2xl font-serif tracking-[0.2em] uppercase mb-8 opacity-80">Details</h2>
                <p className="text-sm italic opacity-50 mb-8">If you have any questions, please contact our coordinator:</p>
                {event.collectRsvp ? (
                    <div className="mt-8">
                        <RsvpForm eventId={event.id} primaryColor="#4a4a4a" />
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button className="w-full py-4 rounded-full border border-black/10 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm">
                            Contact Us
                        </button>
                        <button className="w-full py-4 rounded-full bg-[#4a4a4a] text-white text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-lg">
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
                <p className="text-sm font-['Great_Vibes'] text-2xl opacity-40 mb-4">With love,</p>
                <h2 className="text-3xl font-serif font-medium">{event.groomName} & {event.brideName}</h2>
                <div className="mt-12 opacity-20">
                    <div className="h-px w-24 mx-auto bg-black mb-4" />
                    <p className="text-[10px] uppercase tracking-[0.3em]">Niche E Design</p>
                </div>
            </footer>
        </div>
    );
}
