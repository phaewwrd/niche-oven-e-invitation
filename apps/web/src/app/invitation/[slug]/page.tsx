import { getInvitationBySlug } from "@/lib/services";
import { notFound } from "next/navigation";
import { ThemeClassic } from "@/components/themes/ThemeClassic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function InvitationPage({ params }: PageProps) {
    const { slug } = await params;
    const invitation = await getInvitationBySlug(slug);

    if (!invitation) {
        notFound();
    }

    // Right now we only have ThemeClassic implemented. 
    // In a real app, we would switch between components based on invitation.theme.id or title.
    // For now, let's just use ThemeClassic.

    return (
        <ThemeClassic
            event={invitation}
            theme={invitation.theme}
            schedules={invitation.schedules}
        />
    );
}
