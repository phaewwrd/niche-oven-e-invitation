"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Calendar as CalendarIcon, MapPin, Quote, Globe, Loader2, Sparkles, Image as ImageIcon, Camera } from "lucide-react";
import { createEventAction } from "@/app/actions/event";
import { ImageUploadField } from "@/components/image-upload-field";

export default function CreateEventForm({ userId, themes, subscription }: { userId: string, themes: any[], subscription: any }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isPaid = subscription?.plan?.name === 'paid';
    const maxSchedules = subscription?.plan?.maxSchedule || 4;

    const [formData, setFormData] = useState({
        groomName: "",
        brideName: "",
        eventDate: "",
        locationText: "",
        googleMapsUrl: "",
        quote: "",
        slug: "",
        themeId: themes[0]?.id || "",
        image1Url: "",
        image2Url: "",
        schedules: [{ time: "", title: "" }]
    });

    const addSchedule = () => {
        if (formData.schedules.length >= maxSchedules) {
            toast.error(`Your plan limit is ${maxSchedules} schedule items.`);
            return;
        }
        setFormData({ ...formData, schedules: [...formData.schedules, { time: "", title: "" }] });
    };

    const removeSchedule = (index: number) => {
        setFormData({ ...formData, schedules: formData.schedules.filter((_, i) => i !== index) });
    };

    const updateSchedule = (index: number, field: string, value: string) => {
        const newSchedules = [...formData.schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setFormData({ ...formData, schedules: newSchedules });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createEventAction(userId, formData);
            if (result.success) {
                toast.success("Event created successfully!");
                router.push("/dashboard");
            } else {
                toast.error(result.error || "Failed to create event");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 pb-32 animate-in fade-in duration-1000">
            {/* Names Section */}
            <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-serif font-black italic">Couple Identity</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Groom</Label>
                        <Input required value={formData.groomName} onChange={e => setFormData({ ...formData, groomName: e.target.value })} placeholder="e.g. Johnathan Doe" className="py-7 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Bride</Label>
                        <Input required value={formData.brideName} onChange={e => setFormData({ ...formData, brideName: e.target.value })} placeholder="e.g. Arabella Smith" className="py-7 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg" />
                    </div>
                </div>
            </section>

            {/* Date & Location */}
            <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-serif font-black italic">Event Logistics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Magic Date & Time</Label>
                        <Input required type="datetime-local" value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} className="py-7 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Venué Name</Label>
                        <Input required value={formData.locationText} onChange={e => setFormData({ ...formData, locationText: e.target.value })} placeholder="e.g. The Glass House, Grand Hilton" className="py-7 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg" />
                    </div>
                </div>

                {isPaid ? (
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">Navigation Link <span className="bg-secondary/20 text-secondary text-[10px] px-2.5 py-1 rounded-full font-black">CURATED</span></Label>
                        <div className="relative">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
                            <Input value={formData.googleMapsUrl} onChange={e => setFormData({ ...formData, googleMapsUrl: e.target.value })} placeholder="Paste link from Google Maps" className="py-7 pl-14 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all" />
                        </div>
                    </div>
                ) : (
                    <div className="p-6 bg-muted/30 rounded-2xl border border-border text-xs font-medium text-muted-foreground flex items-center gap-4 italic">
                        <div className="bg-white p-2 rounded-lg shadow-sm"><MapPin className="w-4 h-4 text-gray-300" /></div> Upgrade to a curated plan to unlock architectural Google Maps integration.
                    </div>
                )}
            </section>

            {/* Image Gallery */}
            <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <Camera className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-serif font-black italic">Visual Gallery</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <ImageUploadField
                        label="Portfolio Cover"
                        value={formData.image1Url}
                        onChange={(url) => setFormData({ ...formData, image1Url: url })}
                    />
                    <ImageUploadField
                        label="Atmospheric Portrait"
                        value={formData.image2Url}
                        onChange={(url) => setFormData({ ...formData, image2Url: url })}
                    />
                </div>
            </section>

            {/* Theme Selection */}
            <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-serif font-black italic">Aesthetic Theme</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {themes.map(theme => (
                        <div
                            key={theme.id}
                            onClick={() => setFormData({ ...formData, themeId: theme.id })}
                            className={`group cursor-pointer rounded-3xl border-2 p-4 transition-all duration-500 ${formData.themeId === theme.id ? 'border-secondary bg-secondary/5 ring-4 ring-secondary/10 shadow-xl' : 'border-border hover:border-secondary/30 bg-white'}`}
                        >
                            <div className="aspect-[4/5] bg-muted/30 rounded-2xl mb-4 flex items-center justify-center font-bold overflow-hidden shadow-inner">
                                <div style={{ backgroundColor: theme.primaryColor }} className="w-full h-full opacity-40 transition-transform duration-700 group-hover:scale-110"></div>
                            </div>
                            <p className="text-center font-black uppercase tracking-widest text-[10px] text-primary truncate">{theme.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Schedule Section */}
            <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-2xl font-serif font-black italic">Itinerary Flow</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addSchedule} className="font-bold border-2 border-secondary/20 hover:bg-secondary/5 text-secondary px-6 rounded-xl h-12 transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Add Beat
                    </Button>
                </div>

                <div className="space-y-6">
                    {formData.schedules.map((s, i) => (
                        <div key={i} className="flex gap-6 items-end animate-in fade-in slide-in-from-top-2 group">
                            <div className="flex-1 grid grid-cols-3 gap-6 bg-muted/20 p-6 rounded-2xl border border-border shadow-sm group-hover:border-secondary/20 transition-colors">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</Label>
                                    <Input value={s.time} onChange={e => updateSchedule(i, 'time', e.target.value)} placeholder="09:00" className="rounded-xl bg-white/50 border-border py-6" />
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Activity Description</Label>
                                    <Input value={s.title} onChange={e => updateSchedule(i, 'title', e.target.value)} placeholder="Wedding Ceremony & Reception" className="rounded-xl bg-white/50 border-border py-6" />
                                </div>
                            </div>
                            {formData.schedules.length > 1 && (
                                <button type="button" onClick={() => removeSchedule(i)} className="text-destructive/40 hover:text-destructive group p-3 hover:bg-destructive/5 rounded-full transition-all mb-4">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Advanced Section */}
            <section className="bg-white/80 backdrop-blur-sm p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-serif font-black italic">Curated Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">Artistic Quote {isPaid ? <span className="bg-secondary/20 text-secondary text-[10px] px-2.5 py-1 rounded-full font-black">PREMIUM</span> : null}</Label>
                        <div className="relative">
                            <Quote className="absolute left-5 top-6 w-5 h-5 text-secondary opacity-30" />
                            <Input disabled={!isPaid} value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} placeholder={isPaid ? "Describe your love story..." : "Standard theme quote (Premium only)"} className="py-14 pl-14 rounded-3xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-xl italic font-serif" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">Signature URL {isPaid ? <span className="bg-secondary/20 text-secondary text-[10px] px-2.5 py-1 rounded-full font-black">PREMIUM</span> : null}</Label>
                        <div className="relative">
                            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-sm lowercase italic opacity-50">niche-e.com/</span>
                            <Input disabled={!isPaid} value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} placeholder={isPaid ? "yourname-wedding" : "auto-generated-slug"} className="py-7 pl-36 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all font-black text-primary" />
                        </div>
                        <p className="text-[10px] text-muted-foreground pl-2 italic">Once finalized, the signature URL becomes permanent.</p>
                    </div>
                </div>
            </section>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 flex gap-4 z-50">
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-10 text-2xl font-black rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transform active:scale-[0.98] hover:brightness-110 transition-all border-4 border-white"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-4 h-8 w-8 animate-spin text-secondary" />
                            Architecting Invitation...
                        </>
                    ) : (
                        "Publish Collection"
                    )}
                </Button>
            </div>
        </form>
    );
}
