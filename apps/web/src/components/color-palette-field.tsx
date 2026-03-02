import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Palette } from "lucide-react";
import { toast } from "sonner";

interface ColorPaletteFieldProps {
    colors: string[];
    onChange: (colors: string[]) => void;
    maxColors?: number;
    isPaid: boolean;
}

export function ColorPaletteField({ colors, onChange, maxColors, isPaid }: ColorPaletteFieldProps) {
    const handleAddColor = () => {
        if (!isPaid && maxColors && colors.length >= maxColors) {
            toast.error(`Free plan is limited to ${maxColors} colors. Upgrade for unlimited.`);
            return;
        }
        onChange([...colors, "#ffffff"]);
    };

    const handleColorChange = (index: number, value: string) => {
        const newColors = [...colors];
        newColors[index] = value;
        onChange(newColors);
    };

    const handleRemoveColor = (index: number) => {
        onChange(colors.filter((_, i) => i !== index));
    };

    return (
        <section className="bg-white/80 backdrop-blur-sm p-6 sm:p-10 rounded-3xl border border-border shadow-2xl shadow-primary/5 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="bg-secondary/20 p-2.5 rounded-xl text-secondary shadow-lg shadow-secondary/10">
                        <Palette className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black italic">Dress Code Palette</h2>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddColor}
                    className="font-bold border-2 border-secondary/20 hover:bg-secondary/5 text-secondary px-6 rounded-xl h-12 transition-all"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Color
                </Button>
            </div>

            {!isPaid && (
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-black opacity-60">
                    Free Plan: limited to {maxColors} architectural colors
                </p>
            )}

            <div className="flex flex-wrap gap-6">
                {colors.map((color, index) => (
                    <div key={index} className="group relative flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
                        <div className="relative">
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(index, e.target.value)}
                                className="w-20 h-20 rounded-2xl border-4 border-white shadow-xl cursor-pointer transition-transform group-hover:scale-105"
                                style={{ backgroundColor: color }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveColor(index)}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-tighter opacity-40">{color}</span>
                    </div>
                ))}

                {colors.length === 0 && (
                    <div className="w-full py-12 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-muted/20 opacity-40 italic text-sm">
                        No colors selected. Add colors to guide your guests' attire.
                    </div>
                )}
            </div>
        </section>
    );
}
