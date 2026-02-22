"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X, Upload } from "lucide-react";
import { getCloudinarySignature } from "@/app/actions/upload";
import { toast } from "sonner";
import Image from "next/image";

interface ImageUploadFieldProps {
    label: string;
    value: string;
    onChange: (url: string) => void;
    folder?: string;
}

export function ImageUploadField({ label, value, onChange, folder = "events" }: ImageUploadFieldProps) {
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 10 * 1024 * 1024) { // Increased to 10MB to match server config
            toast.error("File size must be less than 10MB");
            return;
        }

        setIsUploading(true);

        try {
            // 1. Get signature from server
            const { signature, timestamp, cloudName, apiKey } = await getCloudinarySignature(folder);

            // 2. Prepare Form Data for direct client-side upload
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", folder);
            formData.append("timestamp", timestamp.toString());
            formData.append("api_key", apiKey);
            formData.append("signature", signature);

            // 3. POST directly to Cloudinary from the browser
            const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

            const response = await fetch(url, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error?.message || "Client-side upload failed");
            }

            const result = await response.json();

            if (result.secure_url) {
                onChange(result.secure_url);
                toast.success("Image uploaded beautifully!");
            } else {
                toast.error("Upload failed internally");
            }
        } catch (error: any) {
            console.error("Direct upload error:", error);
            toast.error(error.message || "An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
            <div className="relative group">
                {value ? (
                    <div className="relative aspect-video rounded-3xl overflow-hidden border-2 border-border bg-muted/30 shadow-inner">
                        <Image
                            src={value}
                            alt={label}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => onChange("")}
                                className="rounded-full w-12 h-12 p-0 shadow-2xl transform scale-90 group-hover:scale-100 transition-transform"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label className={`
                        flex flex-col items-center justify-center aspect-video rounded-3xl border-2 border-dashed 
                        transition-all duration-500 cursor-pointer
                        ${isUploading ? 'bg-muted/50 border-border animate-pulse' : 'bg-muted/30 border-border hover:border-secondary/50 hover:bg-secondary/5 shadow-sm hover:shadow-md'}
                    `}>
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-3 text-secondary">
                                <Loader2 className="w-10 h-10 animate-spin" />
                                <span className="text-xs font-black uppercase tracking-widest italic">Archiving...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-muted-foreground group/upload">
                                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-primary/5 group-hover/upload:scale-110 transition-transform duration-500">
                                    <Upload className="w-6 h-6 text-secondary" />
                                </div>
                                <div className="text-center">
                                    <span className="block text-sm font-black uppercase tracking-widest text-primary">Upload Aesthetic</span>
                                    <span className="text-[10px] font-medium opacity-60">RAW, JPG, PNG up to 5MB</span>
                                </div>
                            </div>
                        )}
                        <input
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                    </label>
                )}
            </div>
        </div>
    );
}
