import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import ManageDashboard from "./dashboard";

import { getActiveSubscription, getUserEvents, getPendingPayment, getThemes } from "@/lib/services";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const subscription = await getActiveSubscription(session.user.id);
  const events = await getUserEvents(session.user.id);
  const pendingPayment = await getPendingPayment(session.user.id);
  const themes = await getThemes();

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-5xl">
      {pendingPayment && (
        <div className="mb-6 p-4 sm:p-5 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Payment Verification Pending</p>
              <p className="text-[10px] sm:text-xs text-blue-700/60 font-serif italic">Our curators are verifying your upgrade request. Premium features will unlock soon.</p>
            </div>
          </div>
          <a href="/manage/upgrade" className="w-full sm:w-auto text-center py-2 sm:p-0 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors border sm:border-0 border-blue-200 rounded-lg">
            View Slip
          </a>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Manage</h1>
          <p className="text-muted-foreground text-sm sm:text-base truncate max-w-[280px] sm:max-w-none">Welcome back, {session.user.name}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {session.user.role === 'admin' && (
            <a href="/admin/payments" className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 transition-all">
              Admin
            </a>
          )}
          {subscription?.plan?.name !== 'paid' && !pendingPayment && (
            <a href="/manage/upgrade" className="flex-1 sm:flex-none flex items-center justify-center px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary border-2 border-secondary/20 hover:bg-secondary/5 transition-all whitespace-nowrap">
              Upgrade
            </a>
          )}
          <span className={`px-4 py-3 sm:py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center justify-center grow sm:grow-0 ${subscription?.plan?.name === 'paid' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
            {subscription?.plan?.name || 'Free'} Plan
          </span>
          <a href="/manage/events/new/theme" className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-3.5 sm:py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/10 hover:brightness-110 transition-all active:scale-95 text-center">
            Create Event
          </a>
        </div>
      </div>

      <ManageDashboard themes={themes} session={session} events={events} subscription={subscription} />
    </div>
  );
}
