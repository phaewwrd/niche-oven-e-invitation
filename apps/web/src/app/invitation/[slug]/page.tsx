import { getInvitationBySlug } from "@/lib/services";
import { notFound } from "next/navigation";
import InvitationDisplay from "./invitation-display";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params;
    const invitation = await getInvitationBySlug(slug);

    if (!invitation) return { title: "Invitation Not Found" };

    return {
        title: `${invitation.groomName} & ${invitation.brideName} — Wedding Invitation`,
        description: `You're invited to the wedding of ${invitation.groomName} & ${invitation.brideName}`,
    };
}

export default async function InvitationPage({ params }: PageProps) {
    const { slug } = await params;
    const invitation = await getInvitationBySlug(slug);

    if (!invitation) {
        notFound();
    }

    return (
        <InvitationDisplay
            event={invitation}
            theme={invitation.theme}
            schedules={invitation.schedules}
            isExpired={invitation.isExpired}
        />
    );
}
