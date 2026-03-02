"use client";

import { useState } from "react";
import type { Event, Rsvp } from "@niche-e-invitation/db/schema/business";
import {
    Download,
    Search,
    CheckCircle2,
    XCircle,
    Users,
    MessageSquare,
    Clock,
    FileDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RsvpListClientProps {
    event: Event;
    rsvps: Rsvp[];
}

export default function RsvpListClient({ event, rsvps }: RsvpListClientProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRsvps = rsvps.filter(r =>
        r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.message?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalAttending = rsvps.reduce((acc, current) =>
        current.isAttending ? acc + current.totalGuests : acc, 0
    );

    const exportToPDF = () => {
        const doc = new jsPDF();

        // Header
        doc.setFontSize(22);
        doc.setTextColor(40, 40, 40);
        doc.text("RSVP Guest List", 14, 22);

        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(`${event.groomName} & ${event.brideName}'s Wedding`, 14, 30);

        doc.setFontSize(10);
        doc.text(`Total Guests Attending: ${totalAttending}`, 14, 38);
        doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 44);

        // Table
        const tableData = rsvps.map((r, i) => [
            i + 1,
            r.guestName,
            r.isAttending ? "Yes" : "No",
            r.totalGuests,
            r.message || "-",
            new Date(r.createdAt).toLocaleDateString()
        ]);

        autoTable(doc, {
            startY: 50,
            head: [['#', 'Guest Name', 'Attending', 'Count', 'Message', 'Date']],
            body: tableData,
            headStyles: { fillColor: [79, 70, 229] }, // Brand-like indigo
            alternateRowStyles: { fillColor: [245, 247, 255] },
        });

        doc.save(`RSVP_List_${event.slug}.pdf`);
    };

    return (
        <div className="space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-border shadow-sm flex items-center gap-4 sm:gap-5">
                    <div className="bg-blue-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-blue-600 shrink-0">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Total Responses</p>
                        <h3 className="text-xl sm:text-2xl font-black">{rsvps.length}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-border shadow-sm flex items-center gap-4 sm:gap-5">
                    <div className="bg-green-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-green-600 shrink-0">
                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap">Committed Guests</p>
                        <h3 className="text-xl sm:text-2xl font-black text-green-600">{totalAttending}</h3>
                    </div>
                </div>
                <div className="bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-3xl border border-border shadow-sm flex items-center gap-4 sm:gap-5 sm:col-span-2 lg:col-span-1">
                    <div className="bg-[#4F46E5]/5 p-3 sm:p-4 rounded-xl sm:rounded-2xl text-[#4F46E5] shrink-0">
                        <FileDown className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <Button
                            variant="ghost"
                            className="w-full justify-start p-0 h-auto hover:bg-transparent text-[#4F46E5] group"
                            onClick={exportToPDF}
                        >
                            <div className="text-left">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 whitespace-nowrap">Export Registry</p>
                                <h3 className="text-xs sm:text-sm font-black flex items-center gap-2 group-hover:gap-3 transition-all truncate">
                                    Download PDF <Download className="w-4 h-4 shrink-0" />
                                </h3>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* List Section */}
            <div className="bg-white rounded-[2rem] border border-border shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8 border-b border-border bg-muted/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative flex-1 max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter by guest name or message..."
                            className="rounded-xl pl-11 py-5 sm:py-6 bg-white border-border text-sm sm:text-base"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table for larger screens */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/30">
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Guest</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Count</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Personal Note</th>
                                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Received</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredRsvps.map((rsvp) => (
                                <tr key={rsvp.id} className="hover:bg-muted/5 transition-colors">
                                    <td className="px-8 py-6">
                                        <div className="font-bold">{rsvp.guestName}</div>
                                        {rsvp.email && <div className="text-xs text-muted-foreground opacity-60">{rsvp.email}</div>}
                                    </td>
                                    <td className="px-8 py-6">
                                        {rsvp.isAttending ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-200">
                                                <CheckCircle2 className="w-3 h-3" /> Coming
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-200">
                                                <XCircle className="w-3 h-3" /> Regrets
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-muted-foreground opacity-30" />
                                            <span className="font-bold">{rsvp.totalGuests}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 max-w-xs">
                                        {rsvp.message ? (
                                            <div className="flex gap-2">
                                                <MessageSquare className="w-4 h-4 text-muted-foreground opacity-30 shrink-0 mt-1" />
                                                <p className="text-sm italic text-muted-foreground line-clamp-2">"{rsvp.message}"</p>
                                            </div>
                                        ) : (
                                            <span className="text-[10px] opacity-20 italic">No message</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-muted-foreground opacity-40">
                                            <Clock className="w-3 h-3" />
                                            {new Date(rsvp.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card layout for mobile screens */}
                <div className="lg:hidden divide-y divide-border">
                    {filteredRsvps.map((rsvp) => (
                        <div key={rsvp.id} className="p-6 space-y-4 hover:bg-muted/5 transition-colors">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <div className="font-black uppercase tracking-tight text-lg leading-tight">{rsvp.guestName}</div>
                                    {rsvp.email && <div className="text-[10px] font-medium text-muted-foreground opacity-60 break-all">{rsvp.email}</div>}
                                </div>
                                <div className="shrink-0">
                                    {rsvp.isAttending ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 text-[9px] font-black uppercase tracking-widest border border-green-200">
                                            <CheckCircle2 className="w-3 h-3" /> Coming
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[9px] font-black uppercase tracking-widest border border-red-200">
                                            <XCircle className="w-3 h-3" /> Regrets
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-6 text-[10px] font-bold text-muted-foreground/60">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-3.5 h-3.5" />
                                    <span>{rsvp.totalGuests} GUESTS</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{new Date(rsvp.createdAt).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {rsvp.message ? (
                                <div className="bg-muted/30 p-4 rounded-2xl relative">
                                    <MessageSquare className="absolute -top-2 -right-1 w-8 h-8 text-secondary opacity-10" />
                                    <p className="text-sm italic text-muted-foreground leading-relaxed">"{rsvp.message}"</p>
                                </div>
                            ) : (
                                <div className="bg-muted/10 p-4 rounded-2xl border border-dashed border-border text-center">
                                    <span className="text-[10px] uppercase tracking-widest opacity-20 italic">No message recorded</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredRsvps.length === 0 && (
                    <div className="px-8 py-20 text-center text-muted-foreground italic font-serif opacity-50">
                        No guest responses found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
