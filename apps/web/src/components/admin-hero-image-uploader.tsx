"use client";

import { useState } from "react";
import { ImageUploadField } from "@/components/image-upload-field";
import { updateSiteHeroImage } from "@/app/actions/site-config";
import { toast } from "sonner";
import { Image as ImageIcon, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeroImageUploader({ initialUrl }: { initialUrl: string }) {
    const [url, setUrl] = useState(initialUrl);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const result = await updateSiteHeroImage(url);
            if (result.success) {
                toast.success("Hero image updated successfully!");
            } else {
                toast.error(result.error || "Failed to update hero image");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl space-y-4 max-w-md">
            <div className="flex items-center gap-3">
                <div className="bg-secondary/20 p-2 rounded-lg text-secondary">
                    <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-bold">Admin: Change Hero Background</h3>
            </div>

            <ImageUploadField
                label=""
                value={url}
                onChange={setUrl}
                folder="site-assets"
            />

            {url !== initialUrl && (
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full bg-secondary hover:brightness-110 text-primary font-bold py-6 rounded-xl shadow-lg shadow-secondary/20 transition-all animate-in fade-in slide-in-from-bottom-2"
                >
                    {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <Check className="w-5 h-5 mr-2" />
                    )}
                    Apply Background
                </Button>
            )}
        </div>
    );
}
