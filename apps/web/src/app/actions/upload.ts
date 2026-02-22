"use server";

import { env } from "@niche-e-invitation/env/server";
import crypto from "crypto";

import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";

export async function getCloudinarySignature(folder: string = "events") {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${env.CLOUDINARY_API_SECRET}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    return {
        signature,
        timestamp,
        cloudName: env.CLOUDINARY_CLOUD_NAME,
        apiKey: env.CLOUDINARY_API_KEY,
    };
}
