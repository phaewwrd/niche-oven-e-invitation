import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@niche-e-invitation/auth/auth";
import CreateThemeForm from "./create-theme-form";

export default async function NewThemePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user.role !== "admin") {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#FDFCFB] py-12 px-6">
            <CreateThemeForm />
        </div>
    );
}
