import { auth } from "@niche-e-invitation/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getActiveSubscription, getPlans } from "@/lib/services";
import UpgradeForm from "./upgrade-form";

export default async function UpgradePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const subscription = await getActiveSubscription(session.user.id);
    const plans = await getPlans();
    const paidPlan = plans.find(p => p.name === 'paid');

    if (subscription?.plan?.name === 'paid') {
        return (
            <div className="container mx-auto p-8 max-w-2xl text-center">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-12">
                    <h1 className="text-3xl font-bold text-green-800 mb-4">You are on the Paid Plan</h1>
                    <p className="text-green-700 mb-6">Your subscription is active and expires on {new Date(subscription.expiresAt).toLocaleDateString()}.</p>
                    <a href="/dashboard" className="text-green-800 font-semibold underline underline-offset-4">Back to Dashboard</a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <h1 className="text-4xl font-bold mb-2">Upgrade Your Plan</h1>
            <p className="text-muted-foreground mb-8 text-lg">Unlock premium themes, unlimited schedules, and custom slugs.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Plan Details */}
                <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-lg">
                    <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold mb-4 uppercase tracking-wider">Premium Access</div>
                    <h2 className="text-3xl font-bold mb-4">Paid Plan</h2>
                    <div className="flex items-baseline gap-2 mb-8">
                        <span className="text-5xl font-extrabold">329</span>
                        <span className="text-xl text-gray-500 font-medium">THB</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                        {[
                            "Create up to 5 events",
                            "Unlimited schedule items",
                            "Custom URL slug",
                            "Google Maps integration",
                            "All premium themes unlocked",
                            "30 days duration per approval"
                        ].map((feature, i) => (
                            <li key={i} className="flex gap-3 items-center text-gray-700">
                                <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                {feature}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Payment Form */}
                <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-xl mb-6">Scan to Pay</h3>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col items-center">
                        {/* QR Code Placeholder - In real use, this would be a PromptPay QR */}
                        <div className="w-56 h-56 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 mb-2">
                            <span className="text-gray-400 text-center text-sm px-4 whitespace-pre-wrap">PROMPTPAY QR CODE{"\n"}329 THB</span>
                        </div>
                        <p className="text-sm font-mono text-gray-500">Niche E-Invitation Co., Ltd</p>
                    </div>

                    <UpgradeForm userId={session.user.id} amount={paidPlan?.price || 329} />
                </div>
            </div>
        </div>
    );
}
