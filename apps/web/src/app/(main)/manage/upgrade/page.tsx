import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getActiveSubscription, getPlans, getPendingPayment } from "@/lib/services";
import UpgradeForm from "./upgrade-form";

export default async function UpgradePage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/login");
    }

    const subscription = await getActiveSubscription(session.user.id);
    const pendingPayment = await getPendingPayment(session.user.id);
    const plans = await getPlans();
    const paidPlan = plans.find(p => p.name === 'paid');

    if (subscription?.plan?.name === 'paid') {
        return (
            <div className="container mx-auto p-4 sm:p-8 max-w-2xl text-center">
                <div className="bg-green-50 border border-green-200 rounded-2xl sm:rounded-3xl p-8 sm:p-12">
                    <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-4 font-serif italic">You're Premium</h1>
                    <p className="text-sm sm:text-base text-green-700/80 mb-8 font-medium italic">Your architectural invitation suite is fully unlocked until {new Date(subscription.expiresAt).toLocaleDateString()}.</p>
                    <a href="/manage" className="inline-block bg-green-600 text-white px-6 sm:px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-200 hover:brightness-110 transition-all">Back to Dashboard</a>
                </div>
            </div>
        );
    }

    if (pendingPayment) {
        return (
            <div className="container mx-auto p-4 sm:p-8 max-w-2xl text-center">
                <div className="bg-blue-50 border border-blue-100 rounded-[1.5rem] sm:rounded-[2.5rem] p-8 sm:p-16 shadow-xl shadow-blue-500/5 items-center flex flex-col">
                    <div className="w-16 h-16 sm:w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 sm:mb-8 animate-pulse">
                        <svg className="w-8 h-8 sm:w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">Payment Verification In Progress</h1>
                    <p className="text-blue-700/60 mb-8 sm:mb-10 text-base sm:text-lg font-medium italic font-serif">We've received your slip. Our curators are verifying your transaction to unlock your premium experience.</p>
                    <a href="/manage" className="text-blue-800 font-black uppercase tracking-widest text-[10px] sm:text-xs border-b-2 border-blue-200 hover:border-blue-600 transition-all pb-1">Return to Dashboard</a>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">Upgrade Your Plan</h1>
            <p className="text-muted-foreground mb-8 text-base sm:text-lg">Unlock premium themes, unlimited schedules, and custom slugs.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Plan Details */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm transition-all hover:shadow-lg">
                    <div className="inline-block px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-bold mb-4 uppercase tracking-wider">Premium Access</div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-4">Paid Plan</h2>
                    <div className="flex items-baseline gap-2 mb-6 sm:mb-8">
                        <span className="text-4xl sm:text-5xl font-extrabold">329</span>
                        <span className="text-lg sm:text-xl text-gray-500 font-medium">THB</span>
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
                <div className="bg-gray-50 p-6 sm:p-8 rounded-2xl border border-gray-200">
                    <h3 className="font-bold text-lg sm:text-xl mb-6">Scan to Pay</h3>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex flex-col items-center">
                        {/* QR Code Placeholder - In real use, this would be a PromptPay QR */}
                        <div className="w-48 h-48 sm:w-56 sm:h-56 bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 mb-2">
                            <span className="text-gray-400 text-center text-xs sm:text-sm px-4 whitespace-pre-wrap">PROMPTPAY QR CODE{"\n"}329 THB</span>
                        </div>
                        <p className="text-xs sm:text-sm font-mono text-gray-500">Niche E-Invitation Co., Ltd</p>
                    </div>

                    <UpgradeForm userId={session.user.id} amount={paidPlan?.price || 329} />
                </div>
            </div>
        </div>
    );
}
