"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Loader2, X, Upload } from "lucide-react";
import { uploadImageAction } from "@/app/actions/upload";
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
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be less than 5MB");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        try {
            const result = await uploadImageAction(formData);
            if (result.success && result.url) {
                onChange(result.url);
                toast.success("Image uploaded!");
            } else {
                toast.error(result.error || "Upload failed");
            }
        } catch (error) {
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <div className="relative group">
                {value ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-gray-100 bg-gray-50">
                        <Image
                            src={value}
                            alt={label}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => onChange("")}
                                className="rounded-full w-10 h-10 p-0"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label className={`
                        flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed 
                        transition-all cursor-pointer
                        ${isUploading ? 'bg-gray-50 border-gray-200' : 'bg-gray-50 border-gray-200 hover:border-primary/50 hover:bg-primary/5'}
                    `}>
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2 text-primary">
                                <Loader2 className="w-8 h-8 animate-spin" />
                                <span className="text-sm font-bold">Uploading...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-400">
                                <div className="bg-white p-3 rounded-full shadow-sm">
                                    <Upload className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-bold">Upload Photo</span>
                                <span className="text-xs">JPG, PNG up to 5MB</span>
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
