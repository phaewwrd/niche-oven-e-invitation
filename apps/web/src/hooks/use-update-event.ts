import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventAction } from "@/app/actions/event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateEvent(eventId: string, userId: string) {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: any) => {
            const result = await updateEventAction({ eventId, data });
            if (result?.serverError) {
                throw new Error(result.serverError);
            }
            if (result?.validationErrors) {
                throw new Error("Validation failed");
            }
            return result?.data;
        },
        onSuccess: (data) => {
            toast.success("Event updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            if (data?.slug) {
                window.open(`/invitation/${data.slug}`, "_blank");
            }
            router.push("/manage");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update event");
        },
    });
}
