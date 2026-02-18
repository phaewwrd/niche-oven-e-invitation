import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateEventAction } from "@/app/actions/event";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useUpdateEvent(eventId: string, userId: string) {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: async (data: any) => {
            const result = await updateEventAction(eventId, userId, data);
            if (!result.success) {
                throw new Error(result.error);
            }
            return result;
        },
        onSuccess: () => {
            toast.success("Event updated successfully!");
            queryClient.invalidateQueries({ queryKey: ["event", eventId] });
            router.push("/dashboard");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to update event");
        },
    });
}
