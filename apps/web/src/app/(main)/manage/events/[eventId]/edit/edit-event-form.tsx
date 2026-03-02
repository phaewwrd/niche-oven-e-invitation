"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSchema, type EventSchema } from "@/schemas/event";
import { Controller } from "react-hook-form";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Calendar as CalendarIcon, MapPin, Quote, Globe, Loader2, Sparkles, Image as ImageIcon, Camera } from "lucide-react";
import { useUpdateEvent } from "@/hooks/use-update-event";
import { ImageUploadField } from "@/components/image-upload-field";
import { ColorPaletteField } from "@/components/color-palette-field";
import { THAILAND_PROVINCES } from "@/constants/provinces";
import Image from "next/image";
import { ThemeSelector } from "@/components/theme-selector";

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

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<EventSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            groomName: initialData.groomName || "",
            brideName: initialData.brideName || "",
            eventDate: initialData.eventDate ? new Date(initialData.eventDate).toISOString().slice(0, 16) : "",
            locationText: initialData.locationText || "",
            locationProvince: initialData.locationProvince || "",
            locationCountry: initialData.locationCountry || "Thailand",
            googleMapsUrl: initialData.googleMapsUrl || "",
            quote: initialData.quote || "",
            themeId: initialData.themeId || themes[0]?.id || "",
            image1Url: initialData.image1Url || "",
            image2Url: initialData.image2Url || "",
            dressCodeColors: initialData.dressCodeColors || [],
            collectRsvp: initialData.collectRsvp || false,
            schedules: initialData.schedules?.length > 0
                ? initialData.schedules.map((s: any) => ({ time: s.time, title: s.title }))
                : [{ time: "", title: "" }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "schedules"
    });

    const updateEvent = useUpdateEvent(eventId, userId);

    const selectedThemeId = watch("themeId");
    const image1Url = watch("image1Url");
    const image2Url = watch("image2Url");

    const onSubmit = (data: EventSchema) => {
        // Generate Google Maps URL
        const address = `${data.locationText} ${data.locationProvince} ${data.locationCountry}`;
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

        updateEvent.mutate({
            ...data,
            googleMapsUrl: mapsUrl
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-32 animate-in fade-in duration-1000">
            {/* Names Section */}
            <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black italic">Couple Identity</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Groom</Label>
                        <Input {...register("groomName")} placeholder="e.g. Johnathan Doe" className="py-6 sm:py-7 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg" />
                        {errors.groomName && <p className="text-destructive text-xs">{errors.groomName.message}</p>}
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">The Bride</Label>
                        <Input {...register("brideName")} placeholder="e.g. Arabella Smith" className="py-6 sm:py-7 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg" />
                        {errors.brideName && <p className="text-destructive text-xs">{errors.brideName.message}</p>}
                    </div>
                </div>
            </section>

            {/* Date & Location */}
            <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black italic">Event Logistics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Magic Date & Time</Label>
                        <Controller
                            control={control}
                            name="eventDate"
                            render={({ field }: { field: any }) => (
                                <DateTimePicker
                                    value={field.value}
                                    onChange={field.onChange}
                                    placeholder="Select magic date & time"
                                />
                            )}
                        />
                        {errors.eventDate && <p className="text-destructive text-xs">{errors.eventDate.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Venue Name</Label>
                        <Input {...register("locationText")} placeholder="e.g. The Glass House" className="py-6 sm:py-7 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg" />
                        {errors.locationText && <p className="text-destructive text-xs">{errors.locationText.message}</p>}
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Province MasterData</Label>
                        <select
                            {...register("locationProvince")}
                            className="w-full flex h-14 rounded-2xl border border-border bg-white/50 px-4 py-2 text-lg ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all cursor-pointer appearance-none"
                        >
                            <option value="">Select Province</option>
                            {THAILAND_PROVINCES.map(province => (
                                <option key={province} value={province}>{province}</option>
                            ))}
                        </select>
                        {errors.locationProvince && <p className="text-destructive text-xs">{errors.locationProvince.message}</p>}
                    </div>
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Country</Label>
                        <Input {...register("locationCountry")} placeholder="e.g. Thailand" className="py-6 sm:py-7 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg" />
                        {errors.locationCountry && <p className="text-destructive text-xs">{errors.locationCountry.message}</p>}
                    </div>
                </div>

                {!isPaid && (
                    <div className="p-6 bg-muted/30 rounded-2xl border border-border text-[10px] sm:text-xs font-medium text-muted-foreground flex items-center gap-4 italic font-serif">
                        <div className="bg-white p-2 rounded-lg shadow-sm shrink-0"><MapPin className="w-4 h-4 text-gray-300" /></div> Note: Premium themes will display a beautifully integrated Google Maps button using these details.
                    </div>
                )}
            </section>

            {/* Image Gallery */}
            <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <Camera className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black italic">Visual Gallery</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                    <ImageUploadField
                        label="Portfolio Cover"
                        value={image1Url || ""}
                        onChange={(url) => setValue("image1Url", url)}
                    />
                    <ImageUploadField
                        label="Atmospheric Portrait"
                        value={image2Url || ""}
                        onChange={(url) => setValue("image2Url", url)}
                    />
                </div>
            </section>

            {/* Dress Code Section */}
            <ColorPaletteField
                colors={watch("dressCodeColors") || []}
                onChange={(colors) => setValue("dressCodeColors", colors)}
                maxColors={subscription?.plan?.maxDressCodeColors || 3}
                isPaid={isPaid}
            />

            {/* Theme Selection */}
            <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <ImageIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black italic">Aesthetic Theme</h2>
                </div>
                <ThemeSelector
                    themes={themes.map(theme => ({
                        id: theme.id,
                        title: theme.title,
                        previewImageUrl: theme.previewImageUrl,
                        primaryColor: theme.primaryColor,
                        backgroundColor: theme.backgroundColor,
                        secondaryColor: theme.secondaryColor,
                        accentColor: theme.accentColor
                    }))}
                    selectedThemeId={selectedThemeId}
                    onSelect={(themeId) => setValue("themeId", themeId)}
                    mode="select"
                />
            </section>

            {/* Schedule Section */}
            <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-black italic">Itinerary Flow</h2>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                        if (fields.length < maxSchedules) {
                            append({ time: "", title: "" });
                        } else {
                            toast.error(`Your plan limit is ${maxSchedules} schedule items.`);
                        }
                    }} className="w-full sm:w-auto font-bold border-2 border-secondary/20 hover:bg-secondary/5 text-secondary px-6 rounded-xl h-11 sm:h-12 transition-all">
                        <Plus className="w-4 h-4 mr-2" /> Add Beat
                    </Button>
                </div>

                <div className="space-y-6">
                    {fields.map((field, i) => (
                        <div key={field.id} className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-end animate-in fade-in slide-in-from-top-2 group">
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 bg-muted/20 p-5 sm:p-6 rounded-2xl border border-border shadow-sm group-hover:border-secondary/20 transition-colors w-full">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp</Label>
                                    <Input {...register(`schedules.${i}.time`)} placeholder="09:00" className="rounded-xl bg-white/50 border-border py-6 sm:py-6" />
                                </div>
                                <div className="sm:col-span-2 space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Activity Description</Label>
                                    <Input {...register(`schedules.${i}.title`)} placeholder="Wedding Ceremony & Reception" className="rounded-xl bg-white/50 border-border py-6 sm:py-6" />
                                </div>
                            </div>
                            {fields.length > 1 && (
                                <button type="button" onClick={() => remove(i)} className="self-end sm:self-auto text-destructive/40 hover:text-destructive group p-3 hover:bg-destructive/5 rounded-full transition-all sm:mb-4">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Advanced Section */}
            <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <Globe className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black italic">Curated Settings</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">Artistic Quote {isPaid ? <span className="bg-secondary/20 text-secondary text-[10px] px-2.5 py-1 rounded-full font-black">PREMIUM</span> : null}</Label>
                        <div className="relative">
                            <Quote className="absolute left-4 sm:left-5 top-5 sm:top-6 w-4 h-4 sm:w-5 sm:h-5 text-secondary opacity-30" />
                            <Input disabled={!isPaid} {...register("quote")} placeholder={isPaid ? "Describe your love story..." : "Standard theme quote (Premium only)"} className="py-12 sm:py-14 pl-12 sm:pl-14 rounded-3xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-lg sm:text-xl italic font-serif" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">Signature URL</Label>
                        <div className="relative">
                            <span className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-muted-foreground font-black text-xs sm:text-sm lowercase italic opacity-50">niche-e.com/</span>
                            <Input disabled value={initialData.slug} className="py-6 sm:py-7 pl-28 sm:pl-36 rounded-2xl border-border bg-muted/30 focus:ring-2 focus:ring-secondary/20 transition-all font-black text-primary text-sm sm:text-base opacity-60 cursor-not-allowed" />
                        </div>
                        <p className="text-[10px] text-muted-foreground pl-2 italic">The signature URL is permanent and architecturally locked.</p>
                    </div>

                    <div className="md:col-span-2 p-6 sm:p-8 bg-[#fdfdfd] border-2 border-dashed border-border rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 group hover:border-secondary/30 transition-all">
                        <div className="flex items-center gap-4 sm:gap-5 w-full sm:w-auto">
                            <div className={`p-3 sm:p-4 rounded-2xl transition-all duration-500 shrink-0 ${watch("collectRsvp") ? 'bg-secondary text-white shadow-lg shadow-secondary/20 rotate-12' : 'bg-muted/50 text-muted-foreground opacity-50'}`}>
                                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-serif font-black italic text-lg sm:text-xl">Guest Intelligence (RSVP)</h3>
                                <p className="text-[10px] sm:text-xs font-medium text-muted-foreground opacity-70">Collect names, guest counts, and personal messages.</p>
                            </div>
                        </div>

                        {isPaid ? (
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        {...register("collectRsvp")}
                                        checked={watch("collectRsvp")}
                                    />
                                    <div className="w-16 sm:w-20 h-8 sm:h-10 bg-muted/50 rounded-full peer-checked:bg-secondary transition-all peer-focus:ring-4 peer-focus:ring-secondary/10 relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 sm:after:h-8 after:w-6 sm:after:w-8 after:transition-all peer-checked:after:translate-x-8 sm:peer-checked:after:translate-x-10 after:shadow-md"></div>
                                </label>
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] w-12 ${watch("collectRsvp") ? 'text-secondary' : 'text-muted-foreground opacity-40'}`}>
                                    {watch("collectRsvp") ? 'Active' : 'Off'}
                                </span>
                            </div>
                        ) : (
                            <div className="w-full sm:w-auto p-4 bg-muted/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground italic border border-border text-center">
                                Premium Only
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="fixed bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 sm:px-8 flex gap-4 z-50">
                <Button
                    type="submit"
                    disabled={updateEvent.isPending}
                    className="flex-1 py-8 sm:py-10 text-xl sm:text-2xl font-black rounded-[1.5rem] sm:rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transform active:scale-[0.98] hover:brightness-110 transition-all border-2 sm:border-4 border-white"
                >
                    {updateEvent.isPending ? (
                        <>
                            <Loader2 className="mr-3 sm:mr-4 h-6 w-6 sm:h-8 sm:w-8 animate-spin text-secondary" />
                            <span className="hidden sm:inline">Synchronizing Collection...</span>
                            <span className="sm:hidden text-lg">Saving...</span>
                        </>
                    ) : (
                        <>
                            <span className="hidden sm:inline">Refine & Save</span>
                            <span className="sm:hidden text-lg">Save Changes</span>
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
