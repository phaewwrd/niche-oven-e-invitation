import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import ManageDashboard from "./dashboard";

import { getActiveSubscription, getUserEvents, getPendingPayment } from "@/lib/services";

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

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      {pendingPayment && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between gap-4 animate-in slide-in-from-top duration-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">Payment Verification Pending</p>
              <p className="text-xs text-blue-700/60 font-serif italic">Our curators are verifying your upgrade request. Premium features will unlock soon.</p>
            </div>
          </div>
          <a href="/manage/upgrade" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
            View Slip
          </a>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Manage</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
        <div className="flex gap-4">
          {session.user.role === 'admin' && (
            <a href="/admin/payments" className="flex items-center px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest text-indigo-600 border-2 border-indigo-100 hover:bg-indigo-50 transition-all">
              ⚡ Admin
            </a>
          )}
          {subscription?.plan?.name !== 'paid' && !pendingPayment && (
            <a href="/manage/upgrade" className="flex items-center px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest text-secondary border-2 border-secondary/20 hover:bg-secondary/5 transition-all">
              👑 Upgrade
            </a>
          )}
          <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center ${subscription?.plan?.name === 'paid' ? 'bg-secondary/20 text-secondary border border-secondary/30' : 'bg-gray-100 text-gray-500 border border-gray-200'}`}>
            {subscription?.plan?.name || 'Free'} Plan
          </span>
          <a href="/manage/events/new/theme" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/10 hover:brightness-110 transition-all active:scale-95">
            Create Event
          </a>
        </div>
      </div>

      <ManageDashboard session={session} events={events} subscription={subscription} />
    </div>
  );
}
