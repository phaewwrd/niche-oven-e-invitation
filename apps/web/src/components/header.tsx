"use client";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <div className="bg-secondary p-1.5 rounded-lg shadow-lg shadow-secondary/20">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl sm:text-2xl font-serif font-black tracking-tighter italic">
            NICHE <span className="text-secondary">E</span>
          </span>
        </Link>



        <div className="h-6 w-px bg-border mx-2" />

        <div className="flex items-center gap-4">
          {/* <ModeToggle /> */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
