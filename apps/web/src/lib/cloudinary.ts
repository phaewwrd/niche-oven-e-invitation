import { env } from "@niche-e-invitation/env/server";
import crypto from "crypto";

export async function uploadToCloudinary(file: File, folder: string) {
    console.log("Starting Cloudinary direct upload (fetch)...");
    console.log("File:", file.name, "Size:", file.size);

    try {
        const timestamp = Math.round(new Date().getTime() / 1000);

        // Cloudinary expects alphabetical order for signature params
        // folder, then timestamp, then secret
        const paramsToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
        const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        formData.append("timestamp", timestamp.toString());
        formData.append("api_key", env.CLOUDINARY_API_KEY);
        formData.append("signature", signature);

        const url = `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`;

        console.log("POSTing to Cloudinary API...");

        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Cloudinary API error status:", response.status, errorData);
            throw new Error(errorData.error?.message || `Cloudinary upload failed with status ${response.status}`);
        }

        const result = await response.json();
        console.log("Cloudinary upload successful:", result.secure_url);

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error: any) {
        console.error("Cloudinary upload catch error:", error);
        throw error;
    }
}
