"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Heart } from "lucide-react";
import { submitRsvpAction } from "@/app/actions/rsvp";

const rsvpSchema = z.object({
    guestName: z.string().min(1, "Please enter your name"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    totalGuests: z.number().min(1, "At least 1").max(10, "Max 10 per RSVP"),
    isAttending: z.boolean().default(true),
    message: z.string().optional().or(z.literal("")),
});

type RsvpValues = z.infer<typeof rsvpSchema>;

interface RsvpFormProps {
    eventId: string;
    primaryColor?: string;
}

export function RsvpForm({ eventId, primaryColor = "#000" }: RsvpFormProps) {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RsvpValues>({
        resolver: zodResolver(rsvpSchema) as any,
        defaultValues: {
            guestName: "",
            email: "",
            totalGuests: 1,
            isAttending: true,
            message: "",
        },
    });

    const isAttending = watch("isAttending");

    const onSubmit = async (data: any) => {
        const result = await submitRsvpAction({
            ...data,
            eventId,
            totalGuests: Number(data.totalGuests),
        });

        if (result.success) {
            setIsSubmitted(true);
            toast.success("RSVP sent successfully!");
        } else {
            toast.error(result.error || "Something went wrong");
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center p-8 sm:p-12 bg-white/50 backdrop-blur-sm rounded-[1.5rem] sm:rounded-[2rem] border-2 border-dashed border-primary/20 animate-in zoom-in duration-500">
                <div className="flex justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
                </div>
                <h3 className="text-xl sm:text-2xl font-serif italic mb-2">Thank You!</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Your response has been recorded beautifully.</p>
                <div className="mt-6 sm:mt-8 flex justify-center gap-2">
                    <Heart className="w-4 h-4 text-primary fill-current animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8 text-left max-w-lg mx-auto bg-white/40 backdrop-blur-md p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/60 shadow-xl">
            <div className="space-y-4 sm:space-y-6">
                <div className="space-y-2 sm:space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Your Full Name</Label>
                    <Input
                        {...register("guestName")}
                        placeholder="John & Jane Doe"
                        className="rounded-xl sm:rounded-2xl border-white/50 bg-white/50 h-12 sm:h-14 px-4 sm:px-6 focus:ring-primary/20"
                    />
                    {errors.guestName && <p className="text-destructive text-[10px] font-bold uppercase ml-1">{errors.guestName.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2 sm:space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Guests Count</Label>
                        <Input
                            type="number"
                            {...register("totalGuests", { valueAsNumber: true })}
                            className="rounded-xl sm:rounded-2xl border-white/50 bg-white/50 h-12 sm:h-14 px-4 sm:px-6 focus:ring-primary/20"
                        />
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Attendance</Label>
                        <div className="flex h-12 sm:h-14 bg-white/50 rounded-xl sm:rounded-2xl p-1 border border-white/50">
                            <button
                                type="button"
                                onClick={() => setValue("isAttending", true)}
                                className={`flex-1 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAttending ? 'bg-primary text-white shadow-md' : 'text-primary/40 hover:text-primary'}`}
                            >
                                Yes
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("isAttending", false)}
                                className={`flex-1 rounded-lg sm:rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isAttending ? 'bg-destructive text-white shadow-md' : 'text-primary/40 hover:text-primary'}`}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 ml-1">Message (Optional)</Label>
                    <Textarea
                        {...register("message")}
                        placeholder="Leave a sweet note for the couple..."
                        className="rounded-xl sm:rounded-2xl border-white/50 bg-white/50 min-h-[100px] sm:min-h-[120px] px-4 sm:px-6 py-3 sm:py-4 focus:ring-primary/20 resize-none font-sans text-sm"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: primaryColor }}
                className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] shadow-xl hover:brightness-110 active:scale-[0.98] transition-all text-white"
            >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mx-auto text-white" /> : "Submit Response"}
            </Button>
        </form>
    );
}
