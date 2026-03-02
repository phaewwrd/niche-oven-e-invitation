"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    Palette,
    Type,
    Layout,
    Check,
    Loader2,
    Sparkles,
    ArrowLeft
} from "lucide-react";
import { createThemeAction } from "@/app/actions/theme";
import Link from "next/link";

export default function CreateThemeForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        primaryColor: "#1A1A1A",
        secondaryColor: "#C5A059",
        accentColor: "#F3F4F6",
        backgroundColor: "#FFFFFF",
        fontFamily: "Inter, sans-serif",
        showDate: true,
        showSchedule: true,
        showQuote: true,
        showImage1: true,
        showImage2: true,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await createThemeAction(formData);
            if (result.success) {
                toast.success("Theme created successfully!");
                router.push("/manage"); // Or wherever themes are listed
            } else {
                toast.error(result.error || "Failed to create theme");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const ColorInput = ({ label, value, field }: { label: string, value: string, field: string }) => (
        <div className="space-y-3">
            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</Label>
            <div className="flex gap-4">
                <div
                    className="w-14 h-14 rounded-2xl border-2 border-white shadow-xl ring-1 ring-border"
                    style={{ backgroundColor: value }}
                />
                <Input
                    value={value}
                    onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                    className="font-black text-sm uppercase bg-white/50 border-border rounded-xl h-14 tracking-tighter"
                    placeholder="#000000"
                />
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto py-10 animate-in fade-in duration-1000">
            <Link href="/manage" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-secondary transition-all mb-10 group bg-white/50 px-4 py-2 rounded-full border border-border shadow-sm">
                <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                Return to Workspace
            </Link>

            <div className="mb-10 sm:mb-14 text-center px-4 sm:px-0">
                <h1 className="text-3xl sm:text-5xl md:text-7xl font-serif font-black italic mb-4 leading-none">Architecting <span className="text-secondary text-3xl sm:text-5xl md:text-7xl leading-none">Aesthetics</span></h1>
                <p className="text-muted-foreground font-medium text-sm sm:text-lg leading-relaxed max-w-xl mx-auto italic">Define the visual DNA that will encapsulate your future invitation collections.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-12">
                {/* Identity Section */}
                <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-serif font-black italic">Theme Core</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Artisan Title</Label>
                            <Input
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g. Midnight Royale"
                                className="py-8 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-xl font-serif italic"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Layout Identifier (Slug)</Label>
                            <Input
                                required
                                value={formData.slug}
                                onChange={e => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="e.g. classic, luxury-monochrome"
                                className="py-8 rounded-2xl border-border bg-white/50 focus:ring-2 focus:ring-secondary/20 transition-all text-xl font-serif italic"
                            />
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Visual DNA Section */}
                    <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 space-y-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                                <Palette className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-serif font-black italic">Visual DNA</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <ColorInput label="Primary Narrative" value={formData.primaryColor} field="primaryColor" />
                            <ColorInput label="Signature Detail" value={formData.secondaryColor} field="secondaryColor" />
                            <ColorInput label="Surface Essence" value={formData.backgroundColor} field="backgroundColor" />
                            <ColorInput label="Contrasting Hue" value={formData.accentColor} field="accentColor" />
                        </div>

                        <div className="pt-6 space-y-4">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                <Type className="w-4 h-4 text-secondary" /> Typography Configuration
                            </Label>
                            <Input
                                value={formData.fontFamily}
                                onChange={e => setFormData({ ...formData, fontFamily: e.target.value })}
                                placeholder="Serif, sans-serif, etc."
                                className="rounded-2xl border-border bg-white/50 py-7 font-medium"
                            />
                        </div>
                    </section>

                    {/* Structure Section */}
                    <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-border shadow-2xl shadow-primary/5 space-y-10">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                                <Layout className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-serif font-black italic">Architecture</h2>
                        </div>

                        <div className="space-y-6">
                            {[
                                { id: "showDate", label: "Event Timestamp", desc: "Chronological anchoring" },
                                { id: "showSchedule", label: "Itinerary Flow", desc: "Sequential activity mapping" },
                                { id: "showQuote", label: "Poetic Verse", desc: "Articulated expressions of affection" },
                                { id: "showImage1", label: "Primary Canvas", desc: "Central aesthetic focal point" },
                                { id: "showImage2", label: "Supplementary Void", desc: "Atmospheric visual expansion" },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between group p-4 hover:bg-white rounded-[1.5rem] transition-all border border-transparent hover:border-border hover:shadow-xl shadow-primary/5">
                                    <div className="space-y-1">
                                        <Label className="text-sm font-black uppercase tracking-widest text-primary">{item.label}</Label>
                                        <p className="text-[10px] text-muted-foreground italic font-medium">{item.desc}</p>
                                    </div>
                                    <Checkbox
                                        checked={(formData as any)[item.id]}
                                        onCheckedChange={(checked: boolean) => setFormData({ ...formData, [item.id]: checked })}
                                        className="w-6 h-6 rounded-lg border-2 border-border data-[state=checked]:bg-secondary data-[state=checked]:border-secondary transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Submit Bar */}
                <div className="sticky bottom-6 sm:bottom-10 left-0 right-0 pt-8 z-50 px-4 sm:px-0">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-8 sm:py-10 text-xl sm:text-2xl font-black rounded-[1.5rem] sm:rounded-[2rem] bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transform active:scale-[0.98] hover:brightness-110 transition-all border-2 sm:border-4 border-white"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-4">
                                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                                <span className="italic">Manifesting vision...</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Check className="w-8 h-8 text-secondary" />
                                <span>Finalize Masterpiece</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>

            <div className="h-20" /> {/* Spacer */}
        </div>
    );
}
