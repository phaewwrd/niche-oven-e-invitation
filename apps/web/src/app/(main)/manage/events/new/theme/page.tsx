import { db } from "@niche-e-invitation/db";
import { headers } from "next/headers";
import { auth } from "@niche-e-invitation/auth/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ThemeSelector } from "@/components/theme-selector";

export default async function ChooseThemePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const themes = await db.query.theme.findMany();

    return (
        <div className="container mx-auto p-6 max-w-6xl pb-20">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8 sm:mb-12">
                <Link href="/manage">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5 -ml-2 sm:ml-0">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Choose a Theme</h1>
                    <p className="text-muted-foreground text-sm sm:text-lg">Select the perfect aesthetic for your special day.</p>
                </div>
            </div>

            <ThemeSelector
                themes={themes.map(t => ({
                    id: t.id,
                    title: t.title,
                    previewImageUrl: t.previewImageUrl,
                    primaryColor: t.primaryColor,
                    backgroundColor: t.backgroundColor,
                    secondaryColor: t.secondaryColor,
                    accentColor: t.accentColor
                }))}
                mode="redirect"
                redirectBasePath="/manage/events/new"
            />
        </div>
    );
}
