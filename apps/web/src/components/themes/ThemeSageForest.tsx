"use client";

import type { Event, Theme, Schedule } from "@niche-e-invitation/db/schema/business";
import { MapPin, Heart, Calendar as CalendarIcon, Clock } from "lucide-react";
import { RsvpForm } from "@/components/rsvp-form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google"

export const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    display: "swap",
})

interface ThemeProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
    isExpired?: boolean;
}

function formatDay(date: Date | string) {
    return new Date(date).getDate().toString().padStart(2, '0');
}

function formatMonth(date: Date | string) {
    return new Date(date).getMonth() + 1;
}

function formatYear(date: Date | string) {
    return new Date(date).getFullYear();
}

const DAYS_OF_WEEK = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
const MONTHS_RU = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
];
const MONTHS_EN = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

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
        <div className="flex justify-center gap-4 sm:gap-8">
            {[
                { label: 'days', value: timeLeft.days },
                { label: 'hours', value: timeLeft.hours },
                { label: 'min', value: timeLeft.minutes },
                { label: 'sec', value: timeLeft.seconds }
            ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                    <span className="text-2xl sm:text-3xl font-light tracking-widest">{item.value.toString().padStart(2, '0')}</span>
                    <span className="text-[10px] uppercase tracking-widest opacity-40 mt-1">{item.label}</span>
                </div>
            ))}
        </div>
    );
}

function CalendarDisplay({ date }: { date: Date | string }) {
    const d = new Date(date);
    const month = d.getMonth();
    const year = d.getFullYear();
    const today = d.getDate();

    const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Adjust to Monday start: 0->6, 1->0, 2->1, ... 6->5
    const startOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const matrix = [];
    let dayCount = 1;
    for (let i = 0; i < 6; i++) {
        const row = [];
        for (let j = 0; j < 7; j++) {
            if ((i === 0 && j < startOffset) || dayCount > daysInMonth) {
                row.push(null);
            } else {
                row.push(dayCount++);
            }
        }
        matrix.push(row);
        if (dayCount > daysInMonth) break;
    }

    return (
        <div className="bg-[#f2f0eb]/80 p-6 sm:p-8 rounded-[2rem] border border-black/5 shadow-sm inline-block">
            <h3 className="text-xl font-serif italic mb-6 text-center">{MONTHS_EN[month]}</h3>
            <div className="grid grid-cols-7 gap-y-4 gap-x-2 sm:gap-x-4 text-center">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <span key={idx} className="text-[10px] uppercase font-bold opacity-30">{day}</span>
                ))}
                {matrix.map((row, i) => row.map((day, j) => (
                    <div key={`${i}-${j}`} className="relative flex items-center justify-center w-8 h-8">
                        {day === today && (
                            <div className="absolute inset-0 bg-[#2d4030] rounded-full" />
                        )}
                        <span className={`relative text-xs ${day === today ? 'text-white font-bold' : 'opacity-60'}`}>
                            {day}
                        </span>
                    </div>
                )))}
            </div>
        </div>
    );
}

export default function ThemeSageForest({ event, theme, schedules, isExpired }: ThemeProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const sortedSchedules = [...schedules].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div
            className="min-h-screen"
            style={{
                backgroundColor: "#e8e5dc",
                color: "#2d4030",
                fontFamily: cormorant.style.fontFamily
            }}
        >

            {isExpired && (
                <div className="sticky top-0 z-50 py-3 px-6 text-center text-sm font-medium bg-[#2d4030] text-white">
                    This invitation has expired.
                </div>
            )}

            {/* HERO SECTION */}
            <div className="max-w-xl mx-auto pt-4 px-4 sm:px-6">
                <div className="relative rounded-t-[5rem] sm:rounded-t-[10rem] rounded-b-[2rem] sm:rounded-b-[4rem] overflow-hidden shadow-2xl bg-[#2d4030]">
                    {/* {event.image1Url && ( */}
                    <div className="aspect-3/4 relative">
                        <Image src={event.image1Url || theme.image1Url || ""} fill className="w-full h-full object-cover brightness-90" alt="Couple" />
                        <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#2d4030]/80" />
                    </div>
                    {/* )} */}

                    <div className="absolute bottom-8 sm:bottom-12 left-0 right-0 text-center text-white px-6">
                        <div className="text-xs sm:text-sm uppercase tracking-[0.3em] font-light mb-2 opacity-80">The Wedding of</div>
                        <div className="text-[10px] sm:text-xs tracking-widest opacity-60 mb-4 sm:mb-6">
                            {new Date(event.eventDate).toLocaleDateString('en-GB').replace(/\//g, ' | ')}
                        </div>
                        <h1 className="text-3xl sm:text-5xl font-serif font-light leading-tight">
                            {event.groomName} <br />
                            <span className="text-xl sm:text-2xl font-light italic opacity-50">&</span> <br />
                            {event.brideName}
                        </h1>
                    </div>
                </div>
            </div>

            {/* INVITATION TEXT */}
            <section className="py-16 sm:py-24 px-6 sm:px-8 text-center max-w-xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-serif italic mb-6 sm:mb-8 tracking-wide">Dear family and friends!</h2>
                <p className="text-base sm:text-lg leading-relaxed opacity-80 italic">
                    A special moment for us is coming soon, and we dream of sharing it with those who are truly dear to us.
                    We will be glad to see you at this touching event — our wedding!
                </p>
            </section>

            {/* CALENDAR */}
            <section className="pb-24 px-6 text-center">
                <CalendarDisplay date={event.eventDate} />
                <p className="mt-8 text-sm italic opacity-50">We are sincerely looking forward to seeing you among our guests!</p>
            </section>

            {/* LOCATION */}
            <section className="py-20 px-8 bg-[#f2f0eb] border-y border-black/5 text-center">
                <div className="max-w-md mx-auto">
                    <h2 className="text-3xl font-serif italic mb-8 tracking-widest uppercase">Location</h2>
                    <div className="space-y-4">
                        <p className="text-lg font-serif italic opacity-70">
                            {event.locationText || 'Secret Garden Venue'}
                            {(event.locationProvince || event.locationCountry) && (
                                <span className="block text-xs not-italic uppercase tracking-[0.3em] mt-2 opacity-50">
                                    {[event.locationProvince, event.locationCountry].filter(Boolean).join(", ")}
                                </span>
                            )}
                        </p>
                        {event.googleMapsUrl && (
                            <a
                                href={event.googleMapsUrl}
                                target="_blank"
                                className="inline-block mt-4 px-8 py-3 bg-[#2d4030] text-[#e8e5dc] rounded-full text-xs font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                            >
                                Open Map
                            </a>
                        )}
                    </div>
                </div>
            </section>

            <section className=" px-6 sm:px-8 text-center">
                {/* {event.image1Url && ( */}
                <div className="aspect-3/4 relative">
                    <Image src={event.image2Url || theme.image2Url || ""} fill className="w-full h-full object-cover brightness-90" alt="Couple" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#2d4030]/80" />
                </div>
                <div className="max-w-md mx-auto mt-5">
                    <p className="text-base sm:text-lg leading-relaxed opacity-80 italic mb-10">
                        We have planned a wonderful day filled with love, laughter, and unforgettable moments. Here's a glimpse of our schedule:
                    </p>
                </div>
                <div className="h-5 bg-[#f2f0eb]"></div>
            </section>

            {/* PROGRAM */}
            <section className="py-16 sm:py-24 px-6 sm:px-8 text-center">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-serif italic mb-10 sm:mb-12 tracking-widest uppercase">Wedding Program</h2>
                    <div className="space-y-10 sm:space-y-12 relative">
                        {/* Centered vertical line */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-4 bottom-4 w-px bg-dashed-border opacity-20" style={{ backgroundImage: 'linear-gradient(to bottom, #2d4030 50%, transparent 50%)', backgroundSize: '1px 8px' }} />

                        {sortedSchedules.map((item, idx) => (
                            <div key={idx} className="relative z-10">
                                <div className="text-lg sm:text-xl font-bold mb-1">{item.time}</div>
                                <div className="text-base sm:text-lg font-serif italic opacity-60 leading-tight px-4">{item.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* DRESS CODE */}
            {event.dressCodeColors && event.dressCodeColors.length > 0 && (
                <section className="py-16 sm:py-24 px-6 sm:px-8 bg-[#2d4030] text-[#e8e5dc] text-center">
                    <div className="max-w-md mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-serif italic mb-6 sm:mb-8 tracking-widest uppercase">Dress Code</h2>
                        <p className="text-xs sm:text-sm font-serif italic opacity-60 mb-10 sm:mb-12">
                            We would be grateful if you support our wedding color theme:
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {event.dressCodeColors.map((color, idx) => (
                                <div key={idx} className="aspect-square rounded-[1.5rem] sm:rounded-3xl shadow-xl border-4 border-[#e8e5dc]/10 overflow-hidden" style={{ backgroundColor: color }}>
                                    {/* Texture overlay if possible, or just solid */}
                                    {idx === 0 && <div className="w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.2) 100%)' }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* COUNTDOWN */}
            <section className="py-24 px-8 text-center bg-[#f2f0eb]">
                <div className="max-w-md mx-auto">
                    <h2 className="text-2xl font-serif italic mb-10 opacity-60">We say "Yes" in...</h2>
                    <Countdown targetDate={event.eventDate} />
                </div>
            </section>

            {event.collectRsvp && (
                <section className="py-16 sm:py-24 px-6 sm:px-8 border-t border-black/5 bg-[#fcfcf9]">
                    <div className="max-w-md mx-auto text-center space-y-12">
                        <div className="space-y-4">
                            <h2 className="text-3xl sm:text-4xl font-serif italic tracking-tighter">Will you attend?</h2>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Please respond to our invitation</p>
                        </div>
                        <RsvpForm eventId={event.id} primaryColor="#2d4030" />
                    </div>
                </section>
            )}

            {/* FOOTER */}
            <footer className="py-16 sm:py-24 px-6 sm:px-8 text-center border-t border-black/5">
                <div className="flex flex-col items-center gap-6">
                    <Heart className="w-6 h-6 opacity-20 fill-current" />
                    <div className="text-3xl sm:text-4xl font-serif italic tracking-tighter">
                        {event.groomName} & {event.brideName}
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.4em] opacity-30 mt-6 sm:mt-8">Niche E Selection</p>
                </div>
            </footer>
        </div>
    );
}
