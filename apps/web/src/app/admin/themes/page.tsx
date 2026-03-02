import { db } from "@niche-e-invitation/db";
import { headers } from "next/headers";
import { auth } from "@niche-e-invitation/auth/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function AdminThemesPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user || session.user.role !== "admin") {
        redirect("/login");
    }

    const themes = await db.query.theme.findMany({
        orderBy: (theme, { asc }) => [asc(theme.createdAt)],
    });

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-7xl pb-20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 sm:mb-12">
                <div>
                    <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Manage Themes</h1>
                    <p className="text-muted-foreground text-sm sm:text-lg">Edit theme preview images and settings</p>
                </div>
                <Link href="/admin/themes/new" className="w-full sm:w-auto">
                    <Button className="w-full sm:w-auto gap-2 py-6 sm:py-2">
                        <Plus className="w-4 h-4" />
                        New Theme
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {themes.map((theme) => (
                    <div
                        key={theme.id}
                        className="group relative flex flex-col space-y-4 p-4 rounded-2xl border-2 border-border bg-card hover:border-primary/50 transition-all"
                    >
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted relative">
                            {theme.previewImageUrl ? (
                                <div className="absolute inset-0 overflow-y-auto">
                                    <Image
                                        src={theme.previewImageUrl}
                                        alt={theme.title}
                                        width={600}
                                        height={1200}
                                        className="w-full h-auto object-top"
                                    />
                                </div>
                            ) : (
                                <div
                                    className="w-full h-full p-6 flex flex-col"
                                    style={{ backgroundColor: theme.backgroundColor }}
                                >
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
                            {!theme.previewImageUrl && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="text-white text-center space-y-2">
                                        <ImageIcon className="w-8 h-8 mx-auto opacity-60" />
                                        <p className="text-xs font-medium">No preview image</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-sm font-black uppercase tracking-wider">{theme.title}</h3>
                            <p className="text-xs text-muted-foreground font-mono">/{theme.slug}</p>
                        </div>

                        <Link href={`/admin/themes/${theme.id}/edit`} className="w-full">
                            <Button variant="outline" className="w-full gap-2 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Pencil className="w-3 h-3" />
                                Edit Theme
                            </Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
