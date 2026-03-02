import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { auth } from "@niche-e-invitation/auth/auth";
import { getSiteConfig } from "@/app/actions/site-config";
import { AdminHeroImageUploader } from "@/components/admin-hero-image-uploader";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const heroImageUrl = await getSiteConfig("hero_image_url") || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop";
    const isAdmin = session?.user?.role === "admin";

    return (
        <main className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImageUrl}
                    alt="Wedding background"
                    fill
                    className="object-cover transition-all duration-700"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 text-center text-white space-y-8 max-w-4xl">
                <div className="space-y-4 animate-in fade-in slide-in-from-top-10 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-secondary text-sm font-bold tracking-wider uppercase">
                        <Sparkles className="w-4 h-4" />
                        Digital Invitations for Modern Couples
                    </div>
                    <h1 className="text-4xl sm:text-5xl md:text-8xl font-serif font-black tracking-tighter leading-none italic">
                        NICHE <span className="text-secondary">E</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-white/70 font-medium max-w-2xl mx-auto leading-relaxed px-4 md:px-0">
                        Create breathtaking digital invitations that capture the magic of your love story in minutes.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                    <Link href="/manage/events/new/theme" className="w-full sm:w-auto">
                        <Button className="w-full sm:w-auto py-6 sm:py-8 px-8 sm:px-10 text-lg sm:text-xl font-black rounded-2xl bg-secondary hover:brightness-110 text-primary shadow-2xl shadow-secondary/40 border-none transform hover:scale-105 active:scale-95 transition-all">
                            Start Designing
                            <ArrowRight className="ml-2 w-5 h-5 sm:w-6 sm:h-6" />
                        </Button>
                    </Link>


                </div>

                {/* Benefits
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 animate-in fade-in duration-1000 delay-500">
                    {[
                        { icon: <Sparkles />, title: "Premium Themes", desc: "Curated aesthetic designs" },
                        { icon: <Calendar />, title: "Instant Access", desc: "Live in under 5 minutes" },
                        { icon: <ArrowRight />, title: "Global Reach", desc: "Share anywhere, instantly" }
                    ].map((item, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-left">
                            <div className="text-indigo-400 mb-3">{item.icon}</div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-white/50 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </div> */}

                {/* Admin Uploader Tool */}
                {/* {isAdmin && (
                    <div className="fixed bottom-8 right-8 z-50">
                        <AdminHeroImageUploader initialUrl={heroImageUrl} />
                    </div>
                )} */}
            </div>

            {/* Decorative bottom blur */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none"></div>
        </main>
    );
}