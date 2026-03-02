import { auth } from "@niche-e-invitation/auth/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { db, payment } from "@niche-e-invitation/db";
import { eq, desc } from "drizzle-orm";
import PaymentApprovalList from "./approval-list";

export default async function AdminPaymentsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (session?.user.role !== "admin") {
        redirect("/manage"); // Or show unauthorized
    }

    const payments = await db.query.payment.findMany({
        with: {
            user: true
        },
        orderBy: [desc(payment.createdAt)],
    });

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-6xl">
            <div className="mb-8 sm:mb-10">
                <h1 className="text-2xl sm:text-4xl font-black mb-2 tracking-tight">Payment Control</h1>
                <p className="text-gray-500 text-sm sm:text-base">Verify and approve subscription upgrade requests.</p>
            </div>

            {payments.length === 0 ? (
                <div className="bg-gray-50 rounded-2xl p-20 text-center border-2 border-dashed border-gray-200">
                    <p className="text-gray-400 font-medium">No payment history found.</p>
                </div>
            ) : (
                <PaymentApprovalList initialPayments={payments} />
            )}
        </div>
    );
}
