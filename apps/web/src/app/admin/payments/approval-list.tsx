"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { approvePayment, rejectPayment } from "@/app/actions/admin";
import { toast } from "sonner";
import { Check, X, ExternalLink, User } from "lucide-react";
import Image from "next/image";

export default function PaymentApprovalList({ initialPayments }: { initialPayments: any[] }) {
    const [payments, setPayments] = useState(initialPayments);

    const handleApprove = async (id: string) => {
        try {
            const res = await approvePayment(id);
            if (res.success) {
                toast.success("Payment approved!");
                setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'approved' } : p));
            }
        } catch (e: any) {
            toast.error(e.message || "Failed to approve");
        }
    };

    const handleReject = async (id: string) => {
        try {
            const res = await rejectPayment(id);
            if (res.success) {
                toast.success("Payment rejected");
                setPayments(prev => prev.map(p => p.id === id ? { ...p, status: 'rejected' } : p));
            }
        } catch (e: any) {
            toast.error(e.message || "Failed to reject");
        }
    };

    return (
        <div className="grid gap-6">
            {payments.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row gap-8 items-start hover:border-primary transition-colors">
                    {/* Slip Image */}
                    <div className="w-full md:w-32 aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0 relative group">
                        <Image src={p.slipUrl} alt="Slip" className="w-full h-full object-cover" />
                        <a href={p.slipUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                            <ExternalLink className="w-4 h-4" /> Open
                        </a>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 text-indigo-600 font-bold mb-1">
                                    <User className="w-4 h-4" />
                                    {p.user?.name || "Unknown User"}
                                </div>
                                <p className="text-sm text-gray-500">{p.user?.email}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${p.status === 'approved' ? 'bg-green-100 text-green-700' :
                                p.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                    'bg-yellow-100 text-yellow-700'
                                }`}>
                                {p.status}
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-50">
                            <p className="text-2xl font-black text-gray-900">{p.amount < 1000 ? p.amount : (p.amount / 1000).toFixed(3)} THB</p>
                            <p className="text-xs text-gray-400">ID: {p.id} • Submitted: {new Date(p.createdAt).toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Actions */}
                    {p.status === 'pending' && (
                        <div className="flex gap-3 w-full md:w-auto self-end md:self-center">
                            <Button
                                onClick={() => handleReject(p.id)}
                                variant="outline"
                                className="flex-1 md:flex-none border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
                            >
                                <X className="mr-2 w-4 h-4" /> Reject
                            </Button>
                            <Button
                                onClick={() => handleApprove(p.id)}
                                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white font-bold"
                            >
                                <Check className="mr-2 w-4 h-4" /> Approve
                            </Button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
