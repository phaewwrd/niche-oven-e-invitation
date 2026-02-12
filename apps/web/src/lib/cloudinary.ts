
export async function uploadToCloudinary(file: File, folder: string) {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const formData = new FormData();
    formData.append("file", `data:${file.type};base64,${buffer.toString("base64")}`);
    formData.append("upload_preset", "ml_default");
    formData.append("folder", folder);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
    }

    return {
        url: data.secure_url,
        publicId: data.public_id,
    };
}
