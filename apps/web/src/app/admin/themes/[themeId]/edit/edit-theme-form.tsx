"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUploadField } from "@/components/image-upload-field";
import { updateThemeAction } from "@/app/actions/theme";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Save, Eye } from "lucide-react";
import Link from "next/link";
import type { Theme } from "@niche-e-invitation/db/schema/business";
import Image from "next/image";
import { ThemePreview } from "./theme-preview";

interface EditThemeFormProps {
    theme: Theme;
}

export default function EditThemeForm({ theme }: EditThemeFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [formData, setFormData] = useState({
        title: theme.title,
        slug: theme.slug,
        primaryColor: theme.primaryColor,
        secondaryColor: theme.secondaryColor,
        accentColor: theme.accentColor,
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
        previewImageUrl: theme.previewImageUrl || "",
        image1Url: theme.image1Url || "",
        image2Url: theme.image2Url || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const result = await updateThemeAction(theme.id, formData);

            if (result.success) {
                toast.success("Theme updated successfully!");
                router.push("/admin/themes");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to update theme");
            }
        } catch (error) {
            toast.error("An error occurred while updating the theme");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4 sm:px-0">
            {/* Preview Section */}
            <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <Eye className="w-5 h-5" />
                        Live Preview
                    </h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPreview(!showPreview)}
                    >
                        {showPreview ? "Hide" : "Show"}
                    </Button>
                </div>

                {showPreview && (
                    <ThemePreview
                        theme={{
                            ...theme,
                            primaryColor: formData.primaryColor,
                            secondaryColor: formData.secondaryColor,
                            accentColor: formData.accentColor,
                            backgroundColor: formData.backgroundColor,
                            fontFamily: formData.fontFamily,
                        }}
                        image1Url={formData.image1Url}
                        image2Url={formData.image2Url}
                    />
                )}
            </div>

            {/* Edit Form Section */}
            {/* <form onSubmit={handleSubmit} className="space-y-8") */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex items-center gap-4 pb-6 border-b">
                    <Link href="/admin/themes">
                        <Button variant="ghost" size="icon" type="button" className="rounded-full shrink-0">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold truncate">{theme.title}</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono truncate">ID: {theme.id}</p>
                    </div>
                </div>

                {/* Preview Image Upload */}
                <div className="space-y-4 p-5 sm:p-6 bg-muted/30 rounded-xl sm:rounded-2xl">
                    <div>
                        <Label className="text-sm sm:text-base font-semibold">Theme Preview Image</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Upload a preview image that will be shown in the theme selection page
                        </p>
                    </div>

                    <ImageUploadField
                        label="Preview Image"
                        value={formData.previewImageUrl}
                        onChange={(url) => setFormData({ ...formData, previewImageUrl: url })}
                        folder="theme-previews"
                    />

                    {formData.previewImageUrl && (
                        <div className="mt-4">
                            <p className="text-sm font-medium mb-2">Current Preview:</p>

                            <div className="relative w-full max-w-sm h-[500px] rounded-xl overflow-y-auto border-2 border-border">
                                <Image
                                    src={formData.previewImageUrl}
                                    alt="Theme preview"
                                    width={500}
                                    height={1000}
                                    className="w-full h-auto object-top"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Default Theme Images */}
                <div className="space-y-6 p-5 sm:p-6 bg-muted/30 rounded-xl sm:rounded-2xl">
                    <div>
                        <Label className="text-sm sm:text-base font-semibold">Default Theme Images</Label>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Upload default images that will be used as fallback when users don't upload their own images
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Default Image 1 (Main/Hero)</Label>
                            <ImageUploadField
                                label="Image 1"
                                value={formData.image1Url}
                                onChange={(url) => setFormData({ ...formData, image1Url: url })}
                                folder="theme-defaults"
                            />
                            {formData.image1Url && (
                                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-border">
                                    <Image
                                        src={formData.image1Url}
                                        alt="Default image 1"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-medium">Default Image 2 (Secondary)</Label>
                            <ImageUploadField
                                label="Image 2"
                                value={formData.image2Url}
                                onChange={(url) => setFormData({ ...formData, image2Url: url })}
                                folder="theme-defaults"
                            />
                            {formData.image2Url && (
                                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden border-2 border-border">
                                    <Image
                                        src={formData.image2Url}
                                        alt="Default image 2"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Theme Details */}
                <div className="space-y-6 p-5 sm:p-6 bg-card rounded-xl sm:rounded-2xl border-2 border-border">
                    <h3 className="text-base sm:text-lg font-bold">Theme Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="primaryColor">Primary Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="primaryColor"
                                    type="color"
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={formData.primaryColor}
                                    onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                                    className="flex-1 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="secondaryColor">Secondary Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="secondaryColor"
                                    type="color"
                                    value={formData.secondaryColor}
                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={formData.secondaryColor}
                                    onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                                    className="flex-1 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="accentColor">Accent Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="accentColor"
                                    type="color"
                                    value={formData.accentColor}
                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={formData.accentColor}
                                    onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                                    className="flex-1 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="backgroundColor">Background Color</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="backgroundColor"
                                    type="color"
                                    value={formData.backgroundColor}
                                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                    className="w-20 h-10"
                                />
                                <Input
                                    value={formData.backgroundColor}
                                    onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                                    className="flex-1 font-mono"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="fontFamily">Font Family</Label>
                            <Input
                                id="fontFamily"
                                value={formData.fontFamily}
                                onChange={(e) => setFormData({ ...formData, fontFamily: e.target.value })}
                                placeholder="e.g., Playfair Display, serif"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto gap-2 py-6 sm:py-2"
                        size="lg"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </Button>
                    <Link href="/admin/themes" className="w-full sm:w-auto">
                        <Button variant="outline" type="button" size="lg" className="w-full py-6 sm:py-2">
                            Cancel
                        </Button>
                    </Link>
                </div>
            </form>

        </div>
    );
}
