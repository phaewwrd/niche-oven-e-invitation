"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check, X, Maximize2, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Theme {
    id: string;
    title: string;
    previewImageUrl: string | null;
    primaryColor: string;
    backgroundColor: string;
    secondaryColor: string;
    accentColor: string;
}

interface ThemeSelectorProps {
    themes: Theme[];
    selectedThemeId?: string;
    onSelect?: (themeId: string) => void;
    redirectBasePath?: string; // 👈 ใช้ตัวนี้แทน
    mode: "select" | "redirect";
}

export function ThemeSelector({ themes, selectedThemeId, onSelect, redirectBasePath, mode }: ThemeSelectorProps) {
    const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
    const [isConfirming, setIsConfirming] = useState(false);
    const router = useRouter();

    const handleConfirm = async () => {
        if (!previewTheme) return;

        setIsConfirming(true);

        try {
            if (mode === "redirect" && redirectBasePath) {
                router.push(`${redirectBasePath}?theme=${previewTheme.id}` as any);
            } else if (mode === "select" && onSelect) {
                onSelect(previewTheme.id);
                setPreviewTheme(null);
            }
        } finally {
            setTimeout(() => setIsConfirming(false), 500);
        }
    };

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        onClick={() => setPreviewTheme(theme)}
                        className={`group relative flex flex-col space-y-3 cursor-pointer`}
                    >
                        <div className={`aspect-[3/4] rounded-[2rem] overflow-hidden border-4 transition-all duration-500 relative shadow-xl ${selectedThemeId === theme.id
                            ? "border-secondary scale-[1.02] shadow-secondary/20 ring-4 ring-secondary/10"
                            : "border-white group-hover:border-secondary/30 group-hover:scale-[1.02] group-hover:shadow-2xl"
                            }`}>
                            {theme.previewImageUrl ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={theme.previewImageUrl}
                                        alt={theme.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full p-6 flex flex-col" style={{ backgroundColor: theme.backgroundColor }}>
                                    <div className="h-2 w-12 rounded-full mb-4 opacity-20" style={{ backgroundColor: theme.primaryColor }} />
                                    <div className="h-6 w-3/4 rounded-lg mb-2" style={{ backgroundColor: theme.primaryColor, opacity: 0.8 }} />
                                    <div className="flex-1 rounded-2xl border-4 border-dashed opacity-10" style={{ borderColor: theme.primaryColor }} />
                                </div>
                            )}

                            {/* Selection Badge */}
                            {selectedThemeId === theme.id && (
                                <div className="absolute top-4 right-4 bg-secondary text-white p-2 rounded-full shadow-lg z-10 animate-in zoom-in duration-300">
                                    <Check className="w-4 h-4 text-white" />
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <div className="bg-white p-4 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500 transform">
                                    <Maximize2 className="w-6 h-6 text-secondary" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center px-2">
                            <h3 className={`text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-colors truncate ${selectedThemeId === theme.id ? 'text-secondary' : 'text-primary opacity-70 group-hover:opacity-100'}`}>
                                {theme.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Preview Modal */}
            {previewTheme && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-md"
                        onClick={() => !isConfirming && setPreviewTheme(null)}
                    />

                    <div className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/20">
                        {/* Modal Header */}
                        <div className="p-6 sm:p-8 border-b border-black/5 flex items-center justify-between shrink-0 bg-white/50">
                            <div className="flex items-center gap-4">
                                <div className="bg-secondary/20 p-3 rounded-2xl text-secondary shadow-lg shadow-secondary/10">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tighter leading-none">{previewTheme.title}</h2>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-60">Architectural Preview</p>
                                </div>
                            </div>
                            <button
                                onClick={() => !isConfirming && setPreviewTheme(null)}
                                className="p-3 hover:bg-black/5 rounded-full transition-all active:scale-90"
                            >
                                <X className="w-6 h-6 text-primary/40" />
                            </button>
                        </div>

                        {/* Modal Content - Scrollable Image */}
                        <div className="flex-1 overflow-y-auto p-4 sm:p-10 bg-black/5 custom-scrollbar">
                            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-white bg-white group/preview">
                                {previewTheme.previewImageUrl ? (
                                    <Image
                                        src={previewTheme.previewImageUrl}
                                        alt={previewTheme.title}
                                        width={1200}
                                        height={2400}
                                        className="w-full h-auto"
                                        priority
                                    />
                                ) : (
                                    <div className="aspect-[3/4] flex flex-col items-center justify-center text-muted-foreground italic bg-muted/30">
                                        <Sparkles className="w-12 h-12 mb-4 opacity-10" />
                                        <span>No preview available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 sm:p-10 border-t border-black/5 bg-white/80 backdrop-blur-md flex flex-col sm:flex-row gap-4 shrink-0">
                            <Button
                                variant="ghost"
                                disabled={isConfirming}
                                onClick={() => setPreviewTheme(null)}
                                className="w-full sm:flex-1 py-8 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-black/5 transition-all order-2 sm:order-1"
                            >
                                Revisit Choices
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={isConfirming}
                                className="w-full sm:flex-1 py-8 rounded-2xl font-black uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:brightness-110 shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group order-1 sm:order-2 transform active:scale-[0.98] transition-all"
                            >
                                {isConfirming ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Designing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Confirm Selection</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
