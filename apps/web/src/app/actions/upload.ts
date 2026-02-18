"use server";

import { uploadToCloudinary } from "@/lib/cloudinary";

export async function uploadImageAction(formData: FormData) {
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "events";

    if (!file) {
        return { success: false, error: "No file provided" };
    }

    try {
        const result = await uploadToCloudinary(file, folder);
        return { success: true, url: result.url, publicId: result.publicId };
    } catch (error: any) {
        console.error("Upload error:", error);
        return { success: false, error: error.message || "Upload failed" };
    }
}
