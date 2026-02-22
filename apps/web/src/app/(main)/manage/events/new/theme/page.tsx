import { db } from "@niche-e-invitation/db";
import { headers } from "next/headers";
import { auth } from "@niche-e-invitation/auth/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
            <div className="flex items-center gap-4 mb-12">
                <Link href="/manage">
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-black/5">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-4xl font-black tracking-tight">Choose a Theme</h1>
                    <p className="text-muted-foreground text-lg">Select the perfect aesthetic for your special day.</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {themes.map((theme) => (
                    <Link
                        key={theme.id}
                        href={`/manage/events/new?theme=${theme.id}`}
                        className="group relative flex flex-col space-y-4"
                    >
                        <div className="aspect-[3/4] rounded-[2rem] overflow-hidden border-4 border-transparent bg-white shadow-xl transition-all duration-500 group-hover:border-secondary group-hover:scale-[1.02] group-hover:shadow-2xl relative">
                            {/* Theme Preview Image or Mockup */}
                            {theme.previewImageUrl ? (
                                <div className="relative w-full h-full">
                                    <Image
                                        src={theme.previewImageUrl}
                                        alt={theme.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-full p-6 flex flex-col transition-transform duration-700 group-hover:scale-110" style={{ backgroundColor: theme.backgroundColor }}>
                                    <div className="h-2 w-12 rounded-full mb-4 opacity-20" style={{ backgroundColor: theme.primaryColor }} />
                                    <div className="space-y-2 mb-8">
                                        <div className="h-6 w-3/4 rounded-lg" style={{ backgroundColor: theme.primaryColor, opacity: 0.8 }} />
                                        <div className="h-6 w-1/2 rounded-lg" style={{ backgroundColor: theme.primaryColor, opacity: 0.8 }} />
                                    </div>
                                    <div className="flex-1 rounded-2xl border-4 border-dashed opacity-10" style={{ borderColor: theme.primaryColor }} />
                                    <div className="mt-6 flex gap-2">
                                        <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: theme.primaryColor }} />
                                        <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: theme.secondaryColor }} />
                                        <div className="w-8 h-8 rounded-full shadow-sm" style={{ backgroundColor: theme.accentColor }} />
                                    </div>
                                </div>
                            )}

                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                <div className="bg-white p-4 rounded-full shadow-2xl scale-50 group-hover:scale-100 transition-transform duration-500">
                                    <Check className="w-8 h-8 text-secondary" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] group-hover:text-secondary transition-colors">{theme.title}</h3>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Click to select</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
