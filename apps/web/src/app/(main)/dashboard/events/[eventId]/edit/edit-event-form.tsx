"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Calendar as CalendarIcon, MapPin, Quote, Globe, Loader2, Sparkles, Image as ImageIcon, Camera } from "lucide-react";
import { useUpdateEvent } from "@/hooks/use-update-event";
import { ImageUploadField } from "@/components/image-upload-field";

interface EditEventFormProps {
    userId: string;
    eventId: string;
    initialData: any;
    themes: any[];
    subscription: any;
}

export default function EditEventForm({ userId, eventId, initialData, themes, subscription }: EditEventFormProps) {
    const isPaid = subscription?.plan?.name === 'paid';
    const maxSchedules = subscription?.plan?.maxSchedule || 4;

    const [formData, setFormData] = useState({
        groomName: initialData.groomName || "",
        brideName: initialData.brideName || "",
        eventDate: initialData.eventDate ? new Date(initialData.eventDate).toISOString().slice(0, 16) : "",
        locationText: initialData.locationText || "",
        googleMapsUrl: initialData.googleMapsUrl || "",
        quote: initialData.quote || "",
        themeId: initialData.themeId || themes[0]?.id || "",
        image1Url: initialData.image1Url || "",
        image2Url: initialData.image2Url || "",
        schedules: initialData.schedules?.length > 0
            ? initialData.schedules.map((s: any) => ({ time: s.time, title: s.title }))
            : [{ time: "", title: "" }]
    });

    const updateEvent = useUpdateEvent(eventId, userId);

    const addSchedule = () => {
        if (formData.schedules.length >= maxSchedules) {
            toast.error(`Your plan limit is ${maxSchedules} schedule items.`);
            return;
        }
        setFormData({ ...formData, schedules: [...formData.schedules, { time: "", title: "" }] });
    };

    const removeSchedule = (index: number) => {
        setFormData({ ...formData, schedules: formData.schedules.filter((_: any, i: number) => i !== index) });
    };

    const updateSchedule = (index: number, field: string, value: string) => {
        const newSchedules = [...formData.schedules];
        newSchedules[index] = { ...newSchedules[index], [field]: value };
        setFormData({ ...formData, schedules: newSchedules });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        updateEvent.mutate(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 pb-20">
            {/* Names Section */}
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><Sparkles className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold">Couple Information</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Groom's Name</Label>
                        <Input required value={formData.groomName} onChange={e => setFormData({ ...formData, groomName: e.target.value })} placeholder="e.g. John Doe" className="py-6 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label>Bride's Name</Label>
                        <Input required value={formData.brideName} onChange={e => setFormData({ ...formData, brideName: e.target.value })} placeholder="e.g. Jane Smith" className="py-6 rounded-xl" />
                    </div>
                </div>
            </section>

            {/* Date & Location */}
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-rose-100 p-2 rounded-lg text-rose-600"><CalendarIcon className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold">Event Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label>Event Date</Label>
                        <Input required type="datetime-local" value={formData.eventDate} onChange={e => setFormData({ ...formData, eventDate: e.target.value })} className="py-6 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                        <Label>Location Name</Label>
                        <Input required value={formData.locationText} onChange={e => setFormData({ ...formData, locationText: e.target.value })} placeholder="e.g. Grand Ballroom, Hilton Hotel" className="py-6 rounded-xl" />
                    </div>
                </div>

                {isPaid ? (
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Google Maps URL <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-black uppercase">Paid</span></Label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input value={formData.googleMapsUrl} onChange={e => setFormData({ ...formData, googleMapsUrl: e.target.value })} placeholder="Paste link from Google Maps" className="py-6 pl-12 rounded-xl" />
                        </div>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-500 flex items-center gap-3">
                        <MapPin className="w-5 h-5" /> Upgrade to Paid Plan to add Google Maps integration.
                    </div>
                )}
            </section>

            {/* Image Gallery */}
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><Camera className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold">Image Gallery</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ImageUploadField
                        label="Primary Cover Photo"
                        value={formData.image1Url}
                        onChange={(url) => setFormData({ ...formData, image1Url: url })}
                    />
                    <ImageUploadField
                        label="Secondary Photo"
                        value={formData.image2Url}
                        onChange={(url) => setFormData({ ...formData, image2Url: url })}
                    />
                </div>
            </section>

            {/* Theme Selection */}
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><ImageIcon className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold">Theme Style</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {themes.map(theme => (
                        <div
                            key={theme.id}
                            onClick={() => setFormData({ ...formData, themeId: theme.id })}
                            className={`cursor-pointer rounded-xl border-2 p-3 transition-all ${formData.themeId === theme.id ? 'border-primary bg-primary/5' : 'border-gray-100 hover:border-gray-200'}`}
                        >
                            <div className="aspect-[4/5] bg-gray-100 rounded-lg mb-2 flex items-center justify-center text-gray-300 font-bold overflow-hidden">
                                <div style={{ backgroundColor: theme.primaryColor }} className="w-full h-full opacity-20"></div>
                            </div>
                            <p className="text-center font-bold text-sm truncate">{theme.title}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Schedule Section */}
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><CalendarIcon className="w-5 h-5" /></div>
                        <h2 className="text-xl font-bold">Itinerary</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={addSchedule} className="font-bold border-2">
                        <Plus className="w-4 h-4 mr-2" /> Add Item
                    </Button>
                </div>

                <div className="space-y-4">
                    {formData.schedules.map((s: any, i: number) => (
                        <div key={i} className="flex gap-4 items-end animate-in fade-in slide-in-from-top-2">
                            <div className="flex-1 grid grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <Label className="text-xs">Time</Label>
                                    <Input value={s.time} onChange={e => updateSchedule(i, 'time', e.target.value)} placeholder="09:00" className="rounded-lg" />
                                </div>
                                <div className="col-span-2 space-y-1">
                                    <Label className="text-xs">Activity</Label>
                                    <Input value={s.title} onChange={e => updateSchedule(i, 'title', e.target.value)} placeholder="Wedding Ceremony" className="rounded-lg" />
                                </div>
                            </div>
                            {formData.schedules.length > 1 && (
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeSchedule(i)} className="text-red-500 hover:text-red-700 hover:bg-red-50 mb-0.5">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Advanced Section */}
            <section className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Globe className="w-5 h-5" /></div>
                    <h2 className="text-xl font-bold">Advanced Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Quote {isPaid ? <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded font-black uppercase">Paid</span> : null}</Label>
                        <div className="relative">
                            <Quote className="absolute left-4 top-4 w-4 h-4 text-gray-400" />
                            <Input disabled={!isPaid} value={formData.quote} onChange={e => setFormData({ ...formData, quote: e.target.value })} placeholder={isPaid ? "Shared love quote..." : "Standard theme quote (Paid only)"} className="py-12 pl-12 rounded-xl text-lg italic" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="flex items-center gap-2">Custom Slug</Label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">niche-e.com/</span>
                            <Input disabled value={initialData.slug} className="py-6 pl-32 rounded-xl font-medium bg-gray-50 opacity-70" />
                        </div>
                        <p className="text-xs text-gray-400 pl-2">The URL slug is permanent and cannot be changed.</p>
                    </div>
                </div>
            </section>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 flex gap-4">
                <Button
                    type="submit"
                    disabled={updateEvent.isPending}
                    className="flex-1 py-8 text-xl font-black rounded-2xl shadow-2xl shadow-primary/40 transform active:scale-[0.98] transition-all"
                >
                    {updateEvent.isPending ? (
                        <>
                            <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                            Updating Invitation...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </form>
    );
}
