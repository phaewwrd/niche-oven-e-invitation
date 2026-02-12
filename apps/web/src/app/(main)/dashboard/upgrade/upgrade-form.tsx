"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { submitPayment } from "@/app/actions/payment";

export default function UpgradeForm({ userId, amount }: { userId: string; amount: number }) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const router = useRouter();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please upload your payment slip");
            return;
        }

        setIsUploading(true);

        try {
            // Use FormData to send file to server action
            const formData = new FormData();
            formData.append("file", file);
            formData.append("amount", amount.toString());
            formData.append("userId", userId);

            const result = await submitPayment(formData);

            if (result.success) {
                setIsSuccess(true);
                toast.success("Payment slip submitted successfully! Wait for admin approval.");
                setTimeout(() => router.push("/dashboard"), 3000);
            } else {
                toast.error(result.error || "Failed to submit payment");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-8">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold mb-2">Submitted!</h4>
                <p className="text-gray-600">Admin will verify your payment shortly.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="slip" className="text-gray-700 font-medium">Upload Payment Slip</Label>
                <div className="relative">
                    <Input
                        id="slip"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="slip"
                        className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary transition-colors cursor-pointer bg-white group"
                    >
                        {file ? (
                            <div className="text-center">
                                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                <p className="text-xs text-gray-500">Click to change file</p>
                            </div>
                        ) : (
                            <div className="text-center">
                                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-primary transition-colors" />
                                <p className="text-sm font-medium text-gray-900">Choose a file or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                    </label>
                </div>
            </div>

            <Button
                type="submit"
                className="w-full py-6 text-lg font-bold rounded-xl shadow-lg shadow-primary/20"
                disabled={!file || isUploading}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    "Submit Payment Slip"
                )}
            </Button>

            <p className="text-xs text-center text-gray-400">
                By clicking submit, you agree to our terms of service.
            </p>
        </form>
    );
}
