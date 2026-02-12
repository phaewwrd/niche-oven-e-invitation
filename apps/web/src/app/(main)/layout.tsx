import Header from "@/components/header";
import React from "react";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid grid-rows-[auto_1fr] h-svh">
            <Header />
            {children}
        </div>
    );
}
