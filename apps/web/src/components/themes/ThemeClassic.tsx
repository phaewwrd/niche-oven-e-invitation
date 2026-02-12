import type { Event, Theme, Schedule } from '@niche-e-invitation/db/schema';
import React from 'react';

interface ThemeProps {
    event: Event;
    theme: Theme;
    schedules: Schedule[];
}

export function ThemeClassic({ event, theme, schedules }: ThemeProps) {
    const {
        primaryColor, secondaryColor, accentColor, backgroundColor,
        fontFamily
    } = theme;

    // Mapping font names to CSS vars (configured in layout or globally)
    const fontVarMap: Record<string, string> = {
        'Playfair Display': 'var(--font-playfair)',
        'Cormorant Garamond': 'var(--font-cormorant)',
        'Great Vibes': 'var(--font-great-vibes)',
        'Montserrat': 'var(--font-montserrat)',
        'Lora': 'var(--font-lora)',
    };

    const styles = {
        '--primary': primaryColor,
        '--secondary': secondaryColor,
        '--accent': accentColor,
        '--bg': backgroundColor,
        fontFamily: fontVarMap[fontFamily] || 'serif',
    } as React.CSSProperties;

    return (
        <div style={styles} className="min-h-screen bg-[var(--bg)] text-[var(--primary)] p-8 transition-colors duration-500">
            <div className="max-w-2xl mx-auto space-y-12 text-center">
                {/* Header */}
                <header className="space-y-4">
                    <div className="uppercase tracking-[0.2em] text-sm text-[var(--secondary)]">The Wedding Of</div>
                    <h1 className="text-5xl md:text-7xl">
                        {event.groomName} <span className="text-[var(--accent)]">&</span> {event.brideName}
                    </h1>
                </header>

                {/* Image 1 */}
                {theme.showImage1 && event.image1Url && (
                    <div className="relative aspect-[3/4] rounded-t-full rounded-b-lg overflow-hidden border border-[var(--accent)]/50 mx-auto w-72 shadow-2xl">
                        <img src={event.image1Url} alt="Couple" className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700" />
                    </div>
                )}

                {/* Quote */}
                {theme.showQuote && event.quote && (
                    <blockquote className="italic text-xl text-[var(--secondary)] border-l-2 border-[var(--accent)] pl-4 inline-block max-w-lg">
                        "{event.quote}"
                    </blockquote>
                )}

                {/* Date & Location */}
                {theme.showDate && (
                    <div className="py-8 border-y border-[var(--secondary)]/20">
                        <div className="text-3xl font-bold mb-2">
                            {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <p className="text-lg text-[var(--secondary)] mb-6">{event.locationText}</p>
                        {event.googleMapsUrl && (
                            <a href={event.googleMapsUrl} target="_blank" rel="noreferrer"
                                className="inline-block px-8 py-3 bg-[var(--accent)] text-white hover:bg-[var(--primary)] transition-all rounded-sm uppercase tracking-wider text-sm">
                                View Map
                            </a>
                        )}
                    </div>
                )}

                {/* Image 2 */}
                {theme.showImage2 && event.image2Url && (
                    <div className="p-2 border border-[var(--secondary)]/30 inline-block bg-white/5 rotate-2">
                        <img src={event.image2Url} alt="Decor" className="max-w-md w-full shadow-lg -rotate-2" />
                    </div>
                )}

                {/* Schedule */}
                {theme.showSchedule && schedules.length > 0 && (
                    <div className="space-y-8 text-left max-w-md mx-auto">
                        <h2 className="text-3xl text-center uppercase tracking-widest border-b border-[var(--accent)] pb-4">Itinerary</h2>
                        <div className="space-y-6">
                            {schedules.sort((a, b) => a.order - b.order).map(s => (
                                <div key={s.id} className="flex gap-6 items-baseline group">
                                    <span className="font-bold text-[var(--accent)] w-24 text-right group-hover:text-[var(--primary)] transition-colors">{s.time}</span>
                                    <span className="text-lg border-l border-[var(--secondary)]/30 pl-6 py-1">{s.title}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
