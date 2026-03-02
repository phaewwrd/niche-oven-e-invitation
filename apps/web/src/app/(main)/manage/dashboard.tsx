"use client";
import type { authClient } from "@/lib/auth-client";
import { theme, type Event, type Theme, type UserSubscription } from "@niche-e-invitation/db/schema/business";
import { PlusCircle, ExternalLink, Calendar, Edit3, Users } from "lucide-react";
import Image from "next/image";

interface ManageDashboardProps {
  session: typeof authClient.$Infer.Session;
  events: Event[];
  subscription: any; // UserSubscription & { plan: Plan }
  themes: Theme[];
}

export default function ManageDashboard({ session, events, subscription, themes }: ManageDashboardProps) {

  return (
    <div className="space-y-6">
      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-white rounded-2xl border border-dashed border-gray-300 text-center">
          <PlusCircle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold mb-2">No invitations yet</h3>
          <p className="text-sm sm:text-gray-500 mb-6 max-w-[240px] sm:max-w-none mx-auto">Start by creating your first digital wedding invitation.</p>
          <a href="/manage/events/new/theme" className="w-full sm:w-auto bg-primary text-primary-foreground px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-bold shadow-xl shadow-primary/10 hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95">
            <PlusCircle className="w-5 h-5" />
            Create Now
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const eventTheme = themes.find(t => t.id === event.themeId);
            const displayImage = event.image1Url || eventTheme?.image1Url;

            return (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                  {displayImage ? (
                    <Image src={displayImage} fill alt={event.groomName} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 font-mono italic text-sm">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <a href={`/invitation/${event.slug}`} target="_blank" rel="noreferrer"
                      className="p-2.5 bg-white/90 rounded-full hover:bg-white transition-colors shadow-sm" title="View Invitation">
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </a>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-1 truncate">{event.groomName} & {event.brideName}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-5">
                    <Calendar className="w-4 h-4" />
                    {new Date(event.eventDate).toLocaleDateString()}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <a href={`/invitation/${event.slug}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-primary/5 hover:bg-primary/10 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary transition-all border border-primary/10">
                        <ExternalLink className="w-4 h-4" />
                        View
                      </a>
                      <a href={`/manage/events/${event.id}/edit`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-secondary/10 hover:bg-secondary/20 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-secondary transition-all border border-secondary/20">
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </a>
                    </div>

                    {subscription?.plan?.allowRsvp && event.collectRsvp && (
                      <a href={`/manage/events/${event.id}/rsvp`} className="w-full flex items-center justify-center gap-2 py-3 bg-[#4F46E5]/10 hover:bg-[#4F46E5]/20 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#4F46E5] transition-all border border-[#4F46E5]/20">
                        <Users className="w-4 h-4" />
                        RSVP Guest List
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
