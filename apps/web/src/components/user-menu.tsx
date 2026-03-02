import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { Sparkles } from "lucide-react";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24" />;
  }

  if (!session) {
    return (
      <Link href="/login">
        <Button className="bg-primary hover:brightness-110 text-primary-foreground font-bold px-6 rounded-xl transition-all shadow-lg shadow-primary/10">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" className="border-border rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-secondary/5 h-10 px-4" />}>
        <span className="truncate max-w-[80px] sm:max-w-none">{session.user.name}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white/80 backdrop-blur-xl border border-border rounded-2xl p-2 shadow-2xl shadow-primary/5 min-w-[200px]">
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">The Profile</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-border/50" />
          <div className="px-3 py-2 text-xs font-medium text-primary/70 italic truncate">
            {session.user.email}
          </div>
          <div>
            <Link href="/manage">
              <DropdownMenuItem
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-primary hover:bg-primary/5 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                events
              </DropdownMenuItem>
            </Link>
          </div>
          <DropdownMenuItem
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest text-destructive hover:bg-destructive/5 transition-all cursor-pointer"
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    router.push("/");
                  },
                },
              });
            }}
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
