import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import Dashboard from "./dashboard";

import { getActiveSubscription, getUserEvents } from "@/lib/services";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const subscription = await getActiveSubscription(session.user.id);
  const events = await getUserEvents(session.user.id);

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {session.user.name}</p>
        </div>
        <div className="flex gap-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription?.plan?.name === 'paid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
            Plan: {subscription?.plan?.name || 'Free'}
          </span>
          <a href="/dashboard/events/new" className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
            Create Event
          </a>
        </div>
      </div>

      <Dashboard session={session} events={events} subscription={subscription} />
    </div>
  );
}
